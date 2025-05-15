let add_row_price = 10;
let increase_bucket_value_price = 10;
let increase_ball_value_price = 10;

function reset_board() {
    static_objects.length = 0;
    buckets.length = 0;
    dynamic_objects.length = 0;

    for (let i = bucket_container.children.length - 1; i >= 0; i--) {
        bucket_container.children.item(i).remove();
    }
}

const add_row = function() {
    if (money > add_row_price) {
        money -= add_row_price;
        update_money_display(money);

        reset_board();
        peg_rows++;

        generate_board(peg_rows);
        add_row_price *= 10; // make this more creative maybe

        // TODO add a display
    }
}

const increase_bucket_value = function() {
    if (money > increase_bucket_value_price) {
        money -= increase_bucket_value_price;
        update_money_display(money);

        reset_board();
        base_bucket_multiplier *= 2;

        generate_board(peg_rows);
        increase_bucket_value_price *= 10;
    }
}

const increase_ball_value = function() {
    if (money > increase_ball_value_price) {
        money -= increase_ball_value_price;
        update_money_display(money);

        reset_board();
        plinko_val *= 2;

        generate_board(peg_rows);
        increase_ball_value_price *= 10;
    }
}
