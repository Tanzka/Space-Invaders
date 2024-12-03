

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

const background = new Image();
background.src = "images/space.jpg";

background.onload = function() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}