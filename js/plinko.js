let money = 0;
let peg_rows = 3;
let plinko_val = 1;

const canvas = document.getElementById("gameboard");
canvas.setAttribute("width", window.innerWidth * .7);
canvas.setAttribute("height", window.innerHeight);
const ctx = canvas.getContext("2d");

// in order to draw all objects later
let static_objects = [];
let dynamic_objects = [];
let buckets = [];

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
const friction = 1.5;
class Ball extends Circle {
    constructor(x, y, rad, color, val) {
        super(x, y, rad, color);
        this.val = val;
        this.dy = 0;
        this.dx = (Math.random() * 2 - 1) / 2;
    }

    step() {
        this.dy += grav;
        this.y += this.dy;
        this.x += this.dx;
    }

    collide(nearby_obj) { // I wanted to write an efficient collision checker with spatial hashing but im not even kidding this runs perfectly smooth with 3.5k balls (hence the nearby_obj input)
        nearby_obj.forEach((obj) => {
            let delta_x = this.x - obj.x;
            let delta_y = this.y - obj.y;
            let dist = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
            let overlap_dist = this.rad + obj.rad;

            if (dist <= overlap_dist) {
                if (delta_y < -.25) {
                    this.y -= 2;
                }

                let theta = Math.atan2(-delta_y, delta_x); // -delta_y because bigger y results in a lower y position.
                this.dx = (Math.cos(theta) * obj.rad / friction);
                this.dy *= -Math.sin(theta) / friction;
            }
        })
    }

    update_pos() {
        this.step();
        this.collide(static_objects);
    }
}

class Rect {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
    }
}

function update_money_display() {
    money_display.innerText = "Money: " + money;
}

let money_display = document.getElementById("money_counter");
class Bucket extends Rect {
    constructor(x, y, w, h, mult, color) {
        super(x, y, w, h, color);
        this.mult = mult;
    }

    detect_plinko(plinkos) {
        plinkos.forEach((plinko) => {
            if (plinko.y + plinko.rad >= this.y && plinko.x > this.x && plinko.x < (this.x + this.w)) {
                const index = dynamic_objects.indexOf(plinko);
                if (index > -1) {
                    dynamic_objects.splice(index, 1);

                    money += plinko_val * this.mult;
                    update_money_display(money);
                }
            }
        })
    }
}

const peg_xgap = 50;
const peg_ygap = 50;
const peg_rad = 2.5;
// const plinko_board_y = 250;
const canvas_center_y = canvas.height / 2;
const canvas_center_x = canvas.width / 2;

let base_bucket_multiplier = 0.5;
const bucket_container = document.getElementById("bucket_container");
function generate_board(rows) {
    for (let i = 0; i < rows; i++) {
        const num_pegs = i + 3;
        const xstart = ((num_pegs - 1) / 2 * (peg_xgap + peg_rad)) * -1 + canvas_center_x;
        const ystart = canvas_center_y - rows * peg_ygap / 2;

        for (let j = 0; j < num_pegs; j++) {
            let circle = new Circle(xstart + (j * peg_xgap) + peg_rad * j, ystart + i * peg_ygap, peg_rad, "black");
            static_objects.push(circle);
        }
    }

    const bucket_height = 40;
    const border_width = 5;

    bucket_borders = [];
    bottom_row = static_objects.slice(static_objects.length - rows - 2, static_objects.length);
    bottom_row.forEach((peg) => {
        let rect = new Rect(peg.x - border_width / 2, peg.y + 15, border_width, bucket_height, "black");
        bucket_borders.push(rect);
    })

    let mults = new Array(bucket_borders.length - 1);
    let center = Math.round((mults.length - 1) / 2); // even arrays takes the "center" on the right
    if (mults.length % 2 == 0) {
        mults[center - 1] = base_bucket_multiplier;
        mults[center - 2] = base_bucket_multiplier;
        mults[center] = base_bucket_multiplier;
        mults[center + 1] = base_bucket_multiplier;
    }
    else {
        mults[center] = base_bucket_multiplier;
        mults[center + 1] = base_bucket_multiplier;
        mults[center - 1] = base_bucket_multiplier;
    }

    let index = 2;
    while (center + index < mults.length) {
        mults[center + index] = mults[center + index - 1] * 2;
        if (mults.length % 2 == 0) {
            mults[center - index - 1] = mults[center + index - 1] * 2;
        }
        else {
            mults[center - index] = mults[center + index - 1] * 2;
        }
        index++;
    }

    for (let i = 0; i < bucket_borders.length - 1; i++) {
        x = bucket_borders[i].x + border_width;
        y = bucket_borders[i].y;
        w = bucket_borders[i + 1].x - bucket_borders[i].x - border_width;
        h = bucket_height;

        let bucket = new Bucket(x, y, w, h, mults[i], "orange");
        buckets.push(bucket);
    }

    const ui = document.getElementsByClassName("ui")[0];
    const canvas_x_0 = ui.offsetWidth + 15;

    for (let i = 0; i < buckets.length; i++) {
        let bucket_display = document.createElement("p");
        bucket_display.classList.add("bucket");
        // bucket_display.classList.add("bucket_mult_" + buckets[i].mult)
        let yellow = 200 - (20 * Math.log2(buckets[i].mult / base_bucket_multiplier));
        bucket_display.style.backgroundColor = `rgb(255, ${yellow}, 55)`;
        bucket_display.style.left = canvas_x_0 + buckets[i].x + "px";
        bucket_display.style.top = buckets[i].y + "px";
        bucket_display.style.width = buckets[i].w + "px";
        bucket_display.style.padding = buckets[i].w / 4 + "px" + " 0";
        bucket_display.style.height = buckets[i].h / 2 + "px";
        bucket_display.innerText = buckets[i].mult + "x";
        // document.body.appendChild(bucket_display);
        bucket_container.appendChild(bucket_display);
    }
}

const ball_rad = 9;
const spawn_plinko = function() {
    const y = canvas_center_y - peg_rows * peg_ygap / 2 - 50;
    const x = canvas_center_x + (Math.random() * 2 - 1) * peg_xgap * .8;
    let ball = new Ball(x, y, ball_rad, "red", plinko_val);
    dynamic_objects.push(ball);
}

// let center = new Rect(canvas_center_x, 0, 2, canvas.height);
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

    buckets.forEach((bucket) => {
        // bucket.draw(); // hide hitboxes on boxes to make a prettier ui
        bucket.detect_plinko(dynamic_objects);
    })
}

generate_board(peg_rows);
setInterval(draw, 10);
setInterval(spawn_plinko, 100);
