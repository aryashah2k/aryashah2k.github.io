var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 4;

var c = canvas.getContext("2d");

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 4;
});

var NBpoint = 25;
var rat = 80;
var rat2 = rat / 2;
var vit = 0.35;

function point(x, y, vit, rat, NBpoint) {
  this.x = x + Math.random() * 50;
  this.y = y + Math.random() * 50;
  this.i = 0;
  this.plus;
  this.vit = vit;
  this.NBpoint = NBpoint;

  this.r = 4;
  this.rat = rat;
  this.rat2 = this.rat / 2;

  // genrerator NBpoints
  this.move = [];
  var coor = {
    x: this.x,
    y: this.y
  };
  this.move.push(coor);
  for (let i = 0; i < this.NBpoint - 1; i++) {
    var coor = {
      x: this.x + Math.random() * this.rat - this.rat2,
      y: this.y + Math.random() * this.rat - this.rat2
    };
    this.move.push(coor);
  }

  // generator vecteur
  this.vect = [];
  for (let i = 0; i < this.NBpoint; i++) {
    var j = i + 1;
    if (j == this.NBpoint) {
      j = 0;
    }
    var div = Math.sqrt(
      Math.pow(this.move[j].x - this.move[i].x, 2) +
        Math.pow(this.move[j].y - this.move[i].y, 2)
    );
    var vecteur = {
      x: (this.move[j].x - this.move[i].x) * (this.vit / div),
      y: (this.move[j].y - this.move[i].y) * (this.vit / div)
    };
    this.vect.push(vecteur);
  }

  this.update = function() {
    this.x += this.vect[this.i].x;
    this.y += this.vect[this.i].y;
    
    var plus = this.i + 1;
    if (plus == this.vect.length) {
      plus = 0;
    }
    if (
      ((Math.sign(this.vect[this.i].x) == -1 && this.x < this.move[plus].x) ||
        (Math.sign(this.vect[this.i].x) == 1 && this.x > this.move[plus].x)) &&
      ((Math.sign(this.vect[this.i].y) == -1 && this.y < this.move[plus].y) ||
        (Math.sign(this.vect[this.i].y) == 1 && this.y > this.move[plus].y))
    ) {
      this.i += 1;
      if (this.i == this.vect.length) {
        this.i = 0;
      }

      this.x = this.move[this.i].x;
      this.y = this.move[this.i].y;
    }

    return { x: this.x, y: this.y, r: this.r };
  };
}

var ctr = {
  // centre hexa
  x: window.innerWidth / 2,
  y: window.innerHeight / 2 - window.innerHeight / 20
};
var r = 200;

var hexa = [
  new point(ctr.x + 0, ctr.y - r, vit, rat, NBpoint),
  new point(ctr.x + (r * Math.sqrt(3)) / 2, ctr.y - r / 2, vit, rat, NBpoint),
  new point(ctr.x + (r * Math.sqrt(3)) / 2, ctr.y + r / 2, vit, rat, NBpoint),
  new point(ctr.x + 0, ctr.y + r, vit, rat, NBpoint),
  new point(ctr.x + (-r * Math.sqrt(3)) / 2, ctr.y + r / 2, vit, rat, NBpoint),
  new point(ctr.x + (-r * Math.sqrt(3)) / 2, ctr.y - r / 2, vit, rat, NBpoint)
];
var hexaLength = hexa.length;

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  var liste = [];
  for (let l = 0; l < hexaLength; l++) {
    liste.push(hexa[l].update());
  }

  ///console.log(liste[0].x)

  var dr = 5;

  // xb - xa
  var bezier = [
    {
      x: (liste[hexaLength - 1].x - liste[1].x) / dr,
      y: (liste[hexaLength - 1].y - liste[1].y) / dr
    }
  ];
  for (let l = 0; l < hexaLength - 2; l++) {
    var bz = {
      x: (liste[l].x - liste[l + 2].x) / dr,
      y: (liste[l].y - liste[l + 2].y) / dr
    };
    bezier.push(bz);
  }
  var bz = {
    x: (liste[hexaLength - 2].x - liste[0].x) / dr,
    y: (liste[hexaLength - 2].y - liste[0].y) / dr
  };
  bezier.push(bz);

  // Max x, Max y
  var xMin = Math.round(liste[0].x);
  var xMax = Math.round(liste[0].x);
  var yMin = Math.round(liste[0].y);
  var yMax = Math.round(liste[0].y);

  for (let l = 0; l < hexaLength; l++) {
    if (xMin > Math.round(liste[l].x)) {
      xMin = Math.round(liste[l].x);
    }
    if (xMax < Math.round(liste[l].x)) {
      xMax = Math.round(liste[l].x);
    }
    if (yMin > Math.round(liste[l].y)) {
      yMin = Math.round(liste[l].y);
    }
    if (yMax < Math.round(liste[l].y)) {
      yMax = Math.round(liste[l].y);
    }
  }

  var grad = c.createLinearGradient(xMin, yMin, xMax, yMax);
  grad.addColorStop(0, "rgb(110,193,255)");
  grad.addColorStop(1, "rgb(139,255,244)");

  c.beginPath();
  c.moveTo(liste[0].x, liste[0].y);
  for (let l = 0; l < hexaLength - 1; l++) {
    c.bezierCurveTo(
      liste[l].x - bezier[l].x,
      liste[l].y - bezier[l].y,
      liste[l + 1].x + bezier[l + 1].x,
      liste[l + 1].y + bezier[l + 1].y,
      liste[l + 1].x,
      liste[l + 1].y
    );
  }
  c.bezierCurveTo(
    liste[hexaLength - 1].x - bezier[hexaLength - 1].x,
    liste[hexaLength - 1].y - bezier[hexaLength - 1].y,
    liste[0].x + bezier[0].x,
    liste[0].y + bezier[0].y,
    liste[0].x,
    liste[0].y
  );
  c.fillStyle = grad;
  c.fill();
  c.closePath();
/*
  for (let l = 0; l < hexaLength ; l++) {
    c.beginPath();
    c.arc(liste[l].x, liste[l].y, 2, 0, Math.PI * 2, false);
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }*/
}

var hover;
canvas.addEventListener("mousemove", function(event) {
  if (c.isPointInPath(event.clientX, event.clientY)) {
    hover = true;
  } else {
    hover = false;
  }
  console.log(hover);
});

animate();
