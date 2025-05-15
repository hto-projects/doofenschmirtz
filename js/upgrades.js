function reset_board() {
    update_money_display(money);

    static_objects.length = 0;
    buckets.length = 0;
    dynamic_objects.length = 0;

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

        if (money > this.price) {
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
        this.price_display.innerText = "Price: $" + this.price.toString();
    }

    upgrade() {
        console.log("child class must implement this function");
    }

    increase_price() {
        this.price *= 10;
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

function add_upgrade(upgrade_name, default_price, num_total_upgrades=10, upgrade_function) {

    const upgrades_div = document.getElementById("upgrades-div");
    
    const upgrade = document.createElement("div");
    upgrade.classList.add("upgrade");
    upgrades_div.appendChild(upgrade);

    let upgrade_counter_display = document.createElement("p");
    upgrade_counter_display.classList.add("inline");
    upgrade_counter_display.id = upgrade_name + "_upgrade_counter_display";
    upgrade.appendChild(upgrade_counter_display);

    let upgrade_button = document.createElement("button");
    upgrade_button.classList.add("inline");
    upgrade_button.onclick = () => {buy_upgrade(upgrade_name)};
    upgrade_button.textContent = upgrade_name.replace("_", " ");
    upgrade.appendChild(upgrade_button);

    let price_display = document.createElement("p");
    price_display.classList.add("inline");
    price_display.id = upgrade_name + "_price_display";
    upgrade.appendChild(price_display);
    
    let new_upgrade = new Upgrade(upgrade_name, default_price, num_total_upgrades, price_display, upgrade_counter_display);
    new_upgrade.upgrade = () => {upgrade_function()};

    new_upgrade.update_display();
    upgrades.push(new_upgrade);

}

add_upgrade("Add_Row", 10, 10, () => {peg_rows++}); 
add_upgrade("Increase_Ball_Value", 10, 10, () => {plinko_val *= 2});
add_upgrade("Increase_Bucket_Multiplier", 10, 10, () => {base_bucket_multiplier *= 2});