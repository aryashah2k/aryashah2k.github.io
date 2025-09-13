var canvas = document.querySelector('canvas')

canvas.width  = window.innerWidth
canvas.height = window.innerHeight - 4

var c = canvas.getContext('2d')

///
var mouse = {
    x : undefined,
    y: undefined
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x
    mouse.y = event.y
    //console.log(mouse)
})
window.addEventListener('resize', function () {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight - 4
})

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

        let r2 = 50
        // interact
        if ( (mouse.x < (this.x + r2 )) && mouse.x > (this.x - r2 ) && (mouse.y < (this.y + r2)) && (mouse.y > (this.y - r2)) ){
            this.radius += 1
        } else if (this.radius > radius) {
            this.radius -= 1
        }

        this.draw()

    }
}

var cicleArray = []

for (let i = 0; i < 500; i++) {
    var radius = 5;

    var x = Math.random() * (innerWidth - radius) + radius/2
    var y = Math.random() * (innerHeight - radius) + radius/2
    var dx = Math.random() * 2
    var dy = Math.random() * 2
    var color = 'rgba('+Math.random()*256+','+Math.random()*256+','+Math.random()*256+',.7)'
    cicleArray.push(new circle(x, y, dx, dy, radius, color))
}


function animate() {
    requestAnimationFrame(animate)

    c.fillStyle = '#fff'
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    for (let i = 0; i < cicleArray.length; i++) {
        cicleArray[i].update()
    }

}

animate()