const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

const background = new Image();
background.src = "images/space.jpg";

//Class for player to draw and move the sprite
class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();
        image.src = "./images/PlayerShip.png"
        image.onload = () => {
            const scale = 0.40;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }  
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}

const player = new Player();
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    }
}



addEventListener("keydown", ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            console.log("left")
            keys.ArrowLeft.pressed = true;
            break
        case 'ArrowRight':
            console.log("right")
            keys.ArrowRight.pressed = true;
            break
        case ' ':
            console.log("pew")
            keys.space.pressed = true;
            break
    }
})

addEventListener("keyup", ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            console.log("left")
            keys.ArrowLeft.pressed = false;
            break
        case 'ArrowRight':
            console.log("right")
            keys.ArrowRight.pressed = false;
            break
        case ' ':
            console.log("pew")
            keys.space.pressed = false;
            break
    }
})


const enemyImage = new Image();
enemyImage.src = "images/enemy.png";


//Enemies settings
const enemySettings = {
    width: 40,
    height: 40,
    padding: 1,
    dx: 3,
    dy: 10,
    max: 50,
    minperrow: 3,
    maxperrow: 8,
    minrows: 1,
    maxrows: 5
};

let enemies = [];
let direction = 1;

function createEnemy(x, y) {
    return {
        x: x,
        y: y,
        width: enemySettings.width,
        height: enemySettings.height,
        alive: true,
    };
}

function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

function addEnemies() {
    while (enemies.filter(enemy => enemy.alive).length < enemySettings.max) {
        let maxY = 0;
        enemies.forEach(enemy => {
            if (enemy.alive && enemy.y + enemy.height > maxY) {
                maxY = enemy.y + enemy.height;
            }
        });

        const startY = maxY + enemySettings.height + enemySettings.padding;

        const numEnemies = Math.floor(Math.random() * (enemySettings.maxperrow - enemySettings.minperrow + 1)) + enemySettings.minperrow;

        for (let col = 0; col < numEnemies; col++) {
            if (enemies.length >= enemySettings.max) break;

            const x = col * (enemySettings.width + enemySettings.padding);

            const conflict = enemies.some(
                enemy => enemy.alive && Math.abs(enemy.x - x) < enemySettings.width
            );

            if (!conflict) {
                enemies.push(createEnemy(x, startY));
            }
        }
    }
}

function moveEnemies() {
    let edgeReached = false;

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) {
            if (direction === 1 && enemies[i].x + enemySettings.width >= canvas.width) {
                edgeReached = true;
                break;
            }
            if (direction === -1 && enemies[i].x <= 0) {
                edgeReached = true;
                break;
            }
        }
    }

    if (edgeReached) {
        direction *= -1;
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].alive) {
                enemies[i].y += enemySettings.dy;
            }
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) {
            enemies[i].x += direction * enemySettings.dx;
        }
    }
}



function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    player.update();

    addEnemies();
    moveEnemies();
    drawEnemies();


    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -3;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 3;
    } else {
        player.velocity.x = 0;
    }

    requestAnimationFrame(animate);
}

enemyImage.onload = () => {
    addEnemies();
    animate();
};
