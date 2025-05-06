const add_row = function() {
    peg_rows++;
    static_objects.length = 0;
    buckets.length = 0;
    dynamic_objects.length = 0;
    for (let i = bucket_container.children.length - 1; i >= 0; i--) {
        bucket_container.children.item(i).remove();
    }
    generate_board(peg_rows);
}
