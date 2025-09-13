var canvas = document.querySelector('canvas')


canvas.width = window.innerWidth - 19
canvas.height = window.innerHeight - 5

var c = canvas.getContext('2d')


var x = 200
var y = 200
var dx = 10
var dy = 10
var radius = 50;

function circle(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color

    this.draw = function () {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        //c.strokeStyle = 'red'
        //c.stroke()
        c.fillStyle = color
        c.fill()
    }
    this.update = function () {

        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx
        }
        this.x += this.dx

        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy
        }
        this.y += this.dy

        this.draw()

    }
}

var cicleArray = []

for (let i = 0; i < 100; i++) {
    var radius = 30;

    var x = Math.random() * (innerWidth - radius) + radius/2
    var y = Math.random() * (innerHeight - radius) + radius/2
    var dx = Math.random() * 2
    var dy = Math.random() * 2
    var color = 'rgba('+Math.random()*256+','+Math.random()*256+','+Math.random()*256+','+Math.random()+')'
    cicleArray.push(new circle(x, y, dx, dy, radius, color))
}

//var circle = new circle(200,200,2,2,50);
//var cir = new circle(300,150,1,1,30);

function animate() {
    requestAnimationFrame(animate)

    c.fillStyle = '#fff'
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    for (let i = 0; i < cicleArray.length; i++) {
        cicleArray[i].update()
    }

}

animate()