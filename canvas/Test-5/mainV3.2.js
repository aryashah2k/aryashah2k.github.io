var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;

var c = canvas.getContext("2d");

/// Mouse
var mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  //console.log(mouse)
});

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 4;
});

var circles = [];
var vit = 25;

for (let i = 0; i < 40000; i++) {
  var x = Math.random() * window.innerWidth;
  var y = Math.random() * window.innerHeight;
  var r = Math.random() * 45 + 3;

  var over = false;

  var l = circles.length;
  for (let u = 0; u < l; u++) {
    let d = Math.sqrt(
      Math.pow(circles[u].x - x, 2) + Math.pow(circles[u].y - y, 2)
    );
    if (d < r + circles[u].r + 2) {
      over = true;
    }
  }

  if (
    !over &&
    x > r + 2 &&
    x < window.innerWidth - r + 2 &&
    y > r + 2 &&
    y < window.innerHeight - r + 2
  ) {
    circles.push(new circle(x, y, r));
  }
}

let v = 0;
let rMax = 0;
for (let i = 0; i < circles.length; i++) {
  if (circles[i].r > rMax) {
    rMax = circles[i].r;
    v = i;
  }
}
circles[v].color = "rgba(50,210,100,1)";

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let j = 0; j < circles.length/2; j++) {
    circles[j].update();
  }
}

function circle(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.dx = 0;
  this.dy = 0;
  this.color = "rgba(50,210,100,.5)";
  this.moove = false;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  this.update = function() {
	    this.draw();

  }
  this.draw();
}

console.log("nombre de cercles " + circles.length);
animate();
