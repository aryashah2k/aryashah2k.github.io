var bodyElement = document.querySelector("body");
bodyElement.addEventListener("mousemove", getMouseDirection, false);

var xDirection = "";
var yDirection = "";

var oldX = 0;
var oldY = 0;

function getMouseDirection(e) {
  //deal with the horizontal case
  if (oldX < e.pageX) {
    xDirection = +1;
  } else {
    xDirection = -1;
  }

  //deal with the vertical case
  if (oldY < e.pageY) {
    yDirection = -1;
  } else {
    yDirection = +1;
  }

  oldX = e.pageX;
  oldY = e.pageY;

  //console.log(xDirection + " " + yDirection);
}

var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;

var c = canvas.getContext("2d");

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 4;
});

var circles = [];

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  circles.push(new circle(oldX, oldY));
  let l = circles.length - 1;

  for (let i = l; i > l - 8; i = i - 1) {
    //console.log(i)
    circles[i].update();
  }
}

function circle(x, y) {
  this.x = x;
  this.y = y;
  this.r = 5;
  this.c = 1;
  this.color = 'rgba(0,0,0,'+this.c+')';

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  this.update = function() {
    this.c -=0.15;
    this.color = "rgba(0,0,0,+"+this.c+")";
    this.draw();
  };
}

animate();
