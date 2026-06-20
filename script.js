const scoreEl = document.querySelectorAll(".score-num");
const result = document.querySelector(".result");
const startGameBtn = document.querySelector(".start-game-btn");
const sound = document.querySelector(".sound");
const soundToggle = document.querySelector(".sound-btn");
const soundimgs = soundToggle.getElementsByTagName("img");
const soundSetting = document.querySelector(".sound-setting");
const volumeRange = document.querySelector("#vol-range");

const canvas = document.querySelector(".canvas");

canvas.width = 700;
canvas.height = innerHeight;

const context = canvas.getContext("2d");

const spriteRunLeft = creatImage("images/spriteRunLeft.png");
const spriteRunRight = creatImage("images/spriteRunRight.png");
const spriteStandLeft = creatImage("images/spriteStandLeft.png");
const spriteStandRight = creatImage("images/spriteStandRight.png");

const platformImg = creatImage("images/platform.png");
const backgroundSound = createAudio("audio/Background.mp3");
const jumpSound = createAudio("audio/Jump.mp3");

let speed = 2;
let gravity = 0.5;

class Player{
    constructor() {
        this.scale = 0.7;
        this.image = spriteStandRight;
        this.width = 66 * this.scale;
        this.height = 150 * this.scale;

        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 50,
        }
        this.velocity = {
            x: 0,
            y: 0
        };
        
        this.frame=0;
        this.sprite={
            stand:{
                left: spriteStandLeft,
                right: spriteStandRight,
                cropWidth: 177,
                width: 66* this.scale,
            },
            run:{
                left: spriteRunLeft,
                right: spriteRunRight,
                cropWidth: 341,
                width: 127.875*this.scale,
            }
        }

        this.currentSprite=this.sprite.stand.right;
        this.currentCropWidth = this.sprite.stand.cropWidth;
    }
    draw(){
        context.beginPath();

        context.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frame,
            0,
            this.currentCropWidth,
            400,
           this.position.x,
           this.position.x,
           this.position.y,
           this.width,
           this.height
        );
 
        context.closePath();
      }

      update() {
          this.frame++;
            if (this.frame > 59 && (this.currentSprite === this.sprite.stand.right ||
                 this.currentSprite === this.sprite.stand.left)) {
                      this.frame = 0;
                   } else if (this.frame>29&&(this.currentSprite === this.sprite.run.right ||
                    this.currentSprite === this.sprite.run.left)) {
                    this.frame = 0;
                   } else {

                   }

                   this.draw();
                   this.position.x+=this.velocity.x;
                   this.position.y += this.velocity.y;

                   if(this.position.y + this.height + this.velocity.y <= canvas.height){
                    this.velocity.y += gravity;
                   }
      }
}