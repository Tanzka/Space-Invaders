const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

const background = new Image();
background.src = "images/space.jpg";

// Class for player to draw and move the sprite
class Player {
    constructor() {
        this.velocity = { x: 0, y: 0 };
        const image = new Image();
        image.src = "./images/PlayerShip.png";
        image.onload = () => {
            const scale = 0.40;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
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


addEventListener("keydown", ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            //console.log("left")
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            //console.log("right")
            keys.ArrowRight.pressed = true;
            break;
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: { x: 0, y: -5 }
            }));
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
            break;
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            //console.log("left")
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            //console.log("right")
            keys.ArrowRight.pressed = false;
            break;
        case ' ':
            //console.log("pew")
            keys.space.pressed = false;
            break;
    }
});


// Class for creating and moving single enemy
class Enemy {
    constructor({position}) {
        this.speed = { x: 0, y: 0 };
        const image = new Image();
        image.src = "images/enemy.png";
        image.onload = () => {
            const scale = 0.6;
            this.alive = true;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = { x: position.x, y: position.y };
        }
    }

    draw() {
        if (this.alive && this.image) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update({speed}) {
        if (this.alive && this.image) {
            this.position.x += speed.x;
            this.position.y += speed.y
            this.draw();
        }
    }
}

// Class for managing grid of enemies
class EnemyGrid {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.speed = { x: 3, y: 0 };
        this.enemies = [];

        const columns = Math.floor(Math.random() * 6 + 5);
        const rows = Math.floor(Math.random() * 4 + 2);

        this.width = columns * 30;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.enemies.push(
                    new Enemy({
                        position: { x: x * 30, y: y * 30 }
                    })
                );
            }
        }
    }

    update() {
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    
        this.speed.y = 0
    
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
          this.speed.x = -this.speed.x * 1.05;
          this.speed.y = 30;
        }

        this.enemies.forEach(enemy => {
            enemy.update({speed: { x: this.speed.x, y: this.speed.y } }); 
        });
    }
}

const enemyGrids = [];
let spawnSpeed= 7000;
let lastSpawn = 0;


// Function to check if a projectile collides with an enemy
function checkHit(projectile, enemy) {
    const distX = projectile.position.x - enemy.position.x - enemy.width / 2;
    const distY = projectile.position.y - enemy.position.y - enemy.height / 2;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < projectile.radius + Math.min(enemy.width / 2, enemy.height / 2);
}

// Function to spawn new enemy grids
function moreEnemies() {
    const currentTime = Date.now();
    if (currentTime - lastSpawn > spawnSpeed) {
        enemyGrids.push(new EnemyGrid());
        lastSpawn = currentTime;
    }
}

// Merged both of our codes
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    player.update();
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        } else {
            projectile.update();

            enemyGrids.forEach(grid => {
                grid.enemies.forEach((enemy, i) => {
                    if (enemy.alive && checkHit(projectile, enemy)) {
                        enemy.alive = false;
                        projectiles.splice(index, 1);

                        setTimeout(() => {
                            grid.enemies.splice(i, 1);
                        }, 0);
                    }
                });
            });
        }
    });

    if (keys.ArrowLeft.pressed && player.position.x > 0) {
        player.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && player.position.x + player.width < canvas.width) {
        player.velocity.x = 5;
    } else {
        player.velocity.x = 0;
    }

    enemyGrids.forEach(grid => {
        grid.update();
    });

    moreEnemies();

    requestAnimationFrame(animate);
}

animate();