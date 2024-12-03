

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

const background = new Image();
background.src = "images/space.jpg";

background.onload = function() { //This is just a test at this point, wrap it up in a function and do it better when we start building the game
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}


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