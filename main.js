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

//Class to spawn projectiles to let the player shoot
class Projectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 4;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red';
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player();
const projectiles = [];
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

function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    player.update();
    projectiles.forEach((projectile, index) => {
    
        if(projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -3;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 3;
    } else {
        player.velocity.x = 0;
    }
}

animate()

addEventListener("keydown", ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            //console.log("left")
            keys.ArrowLeft.pressed = true;
            break
        case 'ArrowRight':
            //console.log("right")
            keys.ArrowRight.pressed = true;
            break
        case ' ':
            //console.log("pew")
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -5
                }
            }))
            keys.space.pressed = true;
            break
    }
})

addEventListener("keyup", ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            //console.log("left")
            keys.ArrowLeft.pressed = false;
            break
        case 'ArrowRight':
            //console.log("right")
            keys.ArrowRight.pressed = false;
            break
        case ' ':
            //console.log("pew")
            keys.space.pressed = false;
            break
    }
})


//Enemy
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

//Test settings
enemySettings = {
    width: 40,
    height: 40,
    padding: 10,
    x: 50,
    y: 50,
    colomnCount: 8,
    rowCount: 1,
    dx: 2,
    dy: 20
};

let enemies = [];
function createEnemies() {
    for (let row = 0; row < enemySettings.rowCount; row++) {
        for (let col = 0; col < enemySettings.colomnCount; col++) {
            enemies.push({
                x: enemySettings.x + col * (enemySettings.width + enemySettings.padding),
                y: enemySettings.y + row * (enemySettings.height + enemySettings.padding),
                width: enemySettings.width,
                height: enemySettings.height,
                alive: true // Check if the enemy has been shot
            });
        }
    }
}

//Draw enemy
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height)
        }
    });
}

function moveEnemies() {

}


enemyImage.onload = () => {
    createEnemies();
    drawEnemies();
}