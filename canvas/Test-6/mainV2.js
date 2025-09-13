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
var r = 50;

for (let i = 0; i < 800; i++) {
  var x = Math.random() * window.innerWidth;
  var y = Math.random() * window.innerHeight;

  var over = false;

  var l = circles.length;
  for (let u = 0; u < l; u++) {
    let d = Math.sqrt(
      Math.pow(circles[u].x - x, 2) + Math.pow(circles[u].y - y, 2)
    );
    if (d < r + circles[u].r + 10) {
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

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let j = 0; j < circles.length; j++) {
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
    let dist = Math.sqrt(
      Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2)
    );
    if (dist < this.r && this.moove === false) {
      this.dx = (this.x - mouse.x) / (vit / 2);
      this.dy = (this.y - mouse.y) / (vit / 2);
      this.moove = true;
      this.color = "rgba(210,10,80,1)";
    }

    for (let i = 0; i < circles.length; i++) {
      let dist2 = Math.sqrt(
        Math.pow(this.x - circles[i].x, 2) + Math.pow(this.y - circles[i].y, 2)
      );
      if (dist2 < this.r + circles[i].r && dist2 != 0) {
        this.color = "rgba(210,10,80,1)";
        this.dx = (this.x - circles[i].x) / vit;
        this.dy = (this.y - circles[i].y) / vit;
      }
    }

    if (this.x + this.r > innerWidth || this.x - this.r < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.r > innerHeight || this.y - this.r < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };

  this.updateTouch = function() {
    this.draw();
  };

  this.draw();
}

console.log("nombre de cercles " + circles.length);
animate();
