function reset_board() {
    update_money_display(money);

    static_objects.length = 0;
    buckets.length = 0;
    // dynamic_objects.length = 0;

    for (let i = bucket_container.children.length - 1; i >= 0; i--) {
        bucket_container.children.item(i).remove();
    }
}

class Upgrade {
    constructor(upgrade_name, default_price, num_total_upgrades, price_display, upgrade_counter_display) {
        this.name = upgrade_name
        this.price = default_price;
        this.num_upgrades_bought = 0;
        this.num_total_upgrades = num_total_upgrades;
        this.price_display = price_display;
        this.upgrade_counter_display = upgrade_counter_display;
    }

    buy_upgrade() {
        if (this.num_upgrades_bought >= this.num_total_upgrades) {
            // do smth idk
        }

        if (money >= this.price) {
            money -= this.price;
            this.num_upgrades_bought++;
            this.upgrade(); // must be implemeneted by child class. should just update the value needed for update to take effect.
            this.increase_price();
            this.update_display();
            reset_board();
            generate_board(peg_rows);
        }
    }

    update_display() {
        this.upgrade_counter_display.innerText = this.num_upgrades_bought.toString() + "/" + this.num_total_upgrades.toString();
        this.price_display.innerText = "Price: $" + this.price.toFixed(2);
    }

    upgrade() {
        console.log("child class must implement this function");
    }

    increase_price() {
        const log_base = Math.E;
        // this.price *= 2 * ((this.num_upgrades_bought * Math.log(this.num_upgrades_bought + log_base)) + 1 / 2);
        this.price *= 4 * Math.log(this.num_upgrades_bought + 2 * log_base);
        // this.price *= 10;
    }
}

class AutoDropperUpgrade extends Upgrade {
    constructor(upgrade_name, default_price, num_total_upgrades, price_display, upgrade_counter_display, drops_per_second) {
        super(upgrade_name, default_price, num_total_upgrades, price_display, upgrade_counter_display);
        this.autodroppers = [];
        this.set_delay(drops_per_second);
    }

    increase_price() {
        const log_base = Math.E;
        // this.price *= Math.log(this.num_upgrades_bought + log_base) / Math.log(log_base);
        this.price *= Math.log(this.num_upgrades_bought / 10 + log_base);
        console.log(this.price);
    }

    upgrade() {
        this.autodroppers.push(setInterval(spawn_plinko, this.delay));

        spawn_plinko();
    }

    set_delay(drops_per_second) {
        this.delay = 1000 / drops_per_second;
    }

    clear_auto_droppers() {
        this.autodroppers.forEach((autodropper) => {
            clearInterval(autodropper);
        })
    }
}

let upgrades = [];
function buy_upgrade(upgrade_name) {
    upgrades.forEach((upgrade) => {
        if (upgrade.name == upgrade_name) {
            upgrade.buy_upgrade();
        }
    })
}

function create_ui(upgrade_name) {
    const upgrades_div = document.getElementById("upgrades-div");

    const upgrade = document.createElement("div");
    upgrade.classList.add("upgrade");
    upgrades_div.appendChild(upgrade);

    let upgrade_button = document.createElement("button");
    upgrade_button.classList.add("inline");
    // upgrade_button.classList.add("upgrade-button");
    upgrade_button.onclick = () => { buy_upgrade(upgrade_name) };
    upgrade_button.textContent = upgrade_name.replaceAll("_", " ");
    upgrade.appendChild(upgrade_button);

    let price_display = document.createElement("p");
    price_display.classList.add("inline");
    price_display.classList.add("float-right");
    price_display.id = upgrade_name + "_price_display";
    upgrade.appendChild(price_display);
    let upgrade_counter_display = document.createElement("p");

    // upgrade_counter_display.classList.add("inline");
    upgrade_counter_display.id = upgrade_name + "_upgrade_counter_display";
    upgrade.appendChild(upgrade_counter_display);

    return [price_display, upgrade_counter_display];
}

function add_upgrade(upgrade_name, default_price, num_total_upgrades = 10, upgrade_function) {
    const [price_display, upgrade_counter_display] = create_ui(upgrade_name);

    let new_upgrade = new Upgrade(upgrade_name, default_price, num_total_upgrades, price_display, upgrade_counter_display);
    new_upgrade.upgrade = () => { upgrade_function() };

    new_upgrade.update_display();
    upgrades.push(new_upgrade);

}

function add_auto_dropper_upgrade(upgrade_name, drops_per_second, default_price, num_total_upgrades = 25) {
    const [price_display, upgrade_counter_display] = create_ui(upgrade_name);
    let new_upgrade = new AutoDropperUpgrade(upgrade_name, default_price, num_total_upgrades, price_display, upgrade_counter_display, drops_per_second);

    new_upgrade.update_display();
    upgrades.push(new_upgrade);
}

add_upgrade("Add_Row", 50, 10, () => { peg_rows++ });
add_upgrade("Increase_Ball_Value", 100, 10, () => { plinko_val *= 1.15 });
add_upgrade("Increase_Bucket_Multiplier", 250, 10, () => { base_bucket_multiplier *= 2 });

add_auto_dropper_upgrade("Auto_Dropper_1", .1, 5);
add_auto_dropper_upgrade("Auto_Dropper_2", .5, 100);
add_auto_dropper_upgrade("Auto_Dropper_3", 2.5, 1000);
