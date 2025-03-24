const canvas = document.getElementById("gameboard");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);
const ctx = canvas.getContext("2d");

// in order to draw all objects later
let static_objects = []; 
let dynamic_objects = [];

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

const grav = 0.25;
class Ball extends Circle {
    constructor(x, y, rad, color) {
        super(x, y, rad, color);
        this.dy = 0;
        this.dx = 0;
    }

    step() {
        this.dy += grav;
        this.y += this.dy;
        this.x += this.dx;
    }

    collide(nearby_obj) { // I wanted to write an efficient collision checker with spatial hashing but im not even kidding this runs perfectly smooth with 3.5k balls
        nearby_obj.forEach((obj) => {
            let delta_x = this.x - obj.x;
            let delta_y = this.y - obj.y;
            let dist = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
            let overlap_dist = this.rad + obj.rad;

            if (dist <= overlap_dist) {
                let theta = Math.atan2(-delta_y, delta_x); // -delta_y because bigger y results in a lower y position.
                this.dx = (Math.cos(theta) * obj.rad / 1.75) + ((Math.random() * 2 - 1) / 5); // primary x adjustment + a small random x movement for fun :))

                this.y -= 2;
                this.dy *= -Math.sin(theta) * .75;
            }
        })
    }

    update_pos() {
        this.step();
        this.collide(static_objects);
    }
}

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
}

const peg_xgap = 50;
const peg_ygap = 50;
const peg_rad = 2.5;
const plinko_board_y = 250;
const canvas_center = canvas.width / 2;
function add_pegs(rows) {
    for (let i = 0; i < rows; i++) {
        let num_pegs = i + 3;
        let xstart = ((num_pegs - 1) / 2 * (peg_xgap + peg_rad)) * -1 + canvas_center;

        for (let j = 0; j < num_pegs; j++) {
            let circle = new Circle(xstart + (j * peg_xgap) + peg_rad * j, plinko_board_y + i * peg_ygap, peg_rad, "black");
            static_objects.push(circle);
        }
    }
}

// let center = new Rect(canvas_center, 0, 2, canvas.height);
// static_objects.push(center);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    static_objects.forEach((obj) => {
        obj.draw();
    })

    dynamic_objects.forEach((obj) => {
        obj.draw();
        obj.update_pos();
    })
}

add_pegs(10);
for (let i = 0; i < 100; i++) {
    let ball = new Ball(canvas_center, 200, 7.5, "red");
    dynamic_objects.push(ball);
}

setInterval(draw, 10);