const canvas = document.getElementById("gameboard");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);
const ctx = canvas.getContext("2d");
// ctx.beginPath();
// ctx.arc(95, 50, 40, 0, 2 * Math.PI);
// ctx.stroke();

class Circle {
    constructor(x, y, rad, color) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

class Ball extends Circle {
    calc_gravity() {
        this.y += 5;
    }
}
// function draw_circle(x, y, rad, color) {
//     ctx.beginPath();
//     ctx.fillStyle = color;
//     ctx.strokeStyle = color;
//     ctx.arc(x, y, rad, 0, 2 * Math.PI);
//     ctx.fill();
//     ctx.stroke();
// }

// draw_circle(100, 100, 25, "red");
const circle = new Circle(100, 100, 25, "red");
circle.draw();

function test_grav() {
    const ball = new Ball(200, 100, 25, "blue");
    for (let i = 0; i < 10; i++ ) {
        ball.calc_gravity();
        ball.draw();
    }
    
}

test_grav()