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

class Player {
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

        this.frame = 0;
        this.sprite = {
            stand: {
                left: spriteStandLeft,
                right: spriteStandRight,
                cropWidth: 177,
                width: 66 * this.scale,
            },
            run: {
                left: spriteRunLeft,
                right: spriteRunRight,
                cropWidth: 341,
                width: 127.875 * this.scale,
            }
        }

        this.currentSprite = this.sprite.stand.right;
        this.currentCropWidth = this.sprite.stand.cropWidth;
    }
    draw() {
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
        } else if (this.frame > 29 && (this.currentSprite === this.sprite.run.right ||
            this.currentSprite === this.sprite.run.left)) {
            this.frame = 0;
        } else {

        }

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }
    }
}

class Platform {
    constructor({ position, width }) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = width;
        this.height = 60;
        this.image = platformImg;
    }

    draw() {
        context.beginPath();
        context.drawImage(this.image, 0, 0, this.width, this.height,
            this.position.x, this.position.y, this.width, this.height);
        context.closePath();
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
    }
}


const widths = [100, 200, 250, 300, 350, 400];
let platforms = [];
let player;

const keys = {
    left: {
        pressed: false
    },
    right: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
}

let jump;
let parallax;
let lastPlatform;
let score;
let userVolume = 1;


function createPlatform(height) {
    let randomWidth = Math.floor(Math.random() * widths.length);
    let positionX = Math.floor(Math.random() * (canvas.width - widths[randomWidth]))
    platforms.push(new Platform({
        position: {
            x: positionX, y: canvas.height - (height) - 50,
        }, width: widths[ransomWidth]
    }));
}

function creatImage(imgSrc) {
    const img = new Image();
    img.src = imgSrc;
    return img;
}

function createAudio(path) {
    const audio = new Audio();
    audio.src = path;
    return audio;
}

function initGame() {
    jump = true;
    parallax = false;
    lastPlatform = 0;
    score = 0;

    player = new Player();

    platforms = [
        new Platform({
            position: {
                x: 0, y: canvas.height - 50,
            }, width: canvas.width
        }),
    ];

    scoreEl[0].innerHTML = score;
    backgroundSound.play();
    backgroundSound.volume = 0.3 * userVolume;

    for (let i = 1; i < 50; i++) {
        createPlatform(i * 200);
    }
}

let animateID;
function animate() {
    animateID = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    platformsforEach((platform, index) => {

        if (parallax && player.position.y < 50) {
            platform.velocity.y = speed + 2;
        } else if (parallax || player.position.y <= 200) {
            platform.velocity.y = speed;
            parallax = true;
        }

        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {

            if (index != lastPlatform) {
                score += 50;
                lastPlatform = index;
                scoreEl[0].innerHTML = score;

                if (index === 49) {
                    speed++;
                    gravity += 0.1;
                }
            }
        }
    })
}