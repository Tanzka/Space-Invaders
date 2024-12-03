

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

const background = new Image();
background.src = "images/space.jpg";

background.onload = function() { //This is just a test at this point, wrap it up in a function and do it better when we start building the game
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}