var user_interacting = false;
var cur_box_id = "";
var valid_bg_color = "white";
var invalid_bg_color = "red";

var grid = [
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN]
];

const grid_len = grid.length;
const subgrid_len = grid_len / 3;

// check if a box has a row error
function has_row_error(box_row, box_col) {
    var box_val = grid[box_row][box_col];
    if (isNaN(box_val)) {
        return false;
    }

    for (var grid_col = 0; grid_col < grid_len; ++grid_col) {
        if (box_col == grid_col) {
            continue;
        }

        if (grid[box_row][grid_col] == box_val) {
            return true;
        }
    }
    return false;
}

// check if a box has a column error
function has_col_error(box_row, box_col) {
    var box_val = grid[box_row][box_col];
    if (isNaN(box_val)) {
        return false;
    }

    for (var grid_row = 0; grid_row < grid_len; ++grid_row) {
        if (box_row == grid_row) {
            continue;
        }

        if (grid[grid_row][box_col] == box_val) {
            return true;
        }
    }
    return false;
}

// check if a box has a subgrid error
function has_subgrid_error(box_row, box_col) {
    var box_val = grid[box_row][box_col];
    if (isNaN(box_val)) {
        return false;
    }

    var start_row = box_row - (box_row % subgrid_len);
    var start_col = box_col - (box_col % subgrid_len);

    for (grid_row = start_row; grid_row < start_row + subgrid_len;
        ++grid_row) {
        for (grid_col = start_col; grid_col < start_col + subgrid_len;
            ++grid_col) {
            if (box_row == grid_row && box_col == grid_col) {
                continue;
            }

            if (grid[grid_row][grid_col] == box_val) {
                return true;
            }
        }
    }
    return false;
}

$(document).ready(function () {

    // given a row, color valid boxes white and invalid boxes red
    function color_row_boxes(row) {
        for (var grid_col = 0; grid_col < grid_len; ++grid_col) {
            var box_id = 'r' + row + 'c' + grid_col;

            if (isNaN(grid[row][grid_col])) {
                if (document.getElementById(box_id)
                    .style.backgroundColor != valid_bg_color) {
                    document.getElementById(box_id)
                        .style.backgroundColor = valid_bg_color;
                }
            } else if (!has_row_error(row, grid_col)
                && !has_col_error(row, grid_col)
                && !has_subgrid_error(row, grid_col)) {
                if (document.getElementById(box_id)
                    .style.backgroundColor != valid_bg_color) {
                    document.getElementById(box_id)
                        .style.backgroundColor = valid_bg_color;
                }
            } else {
                if (document.getElementById(box_id)
                    .style.backgroundColor != invalid_bg_color) {
                    document.getElementById(box_id)
                        .style.backgroundColor = invalid_bg_color;
                }
            }
        }
    }

    // given a col, color valid boxes white and invalid boxes red
    function color_col_boxes(col) {
        for (var grid_row = 0; grid_row < grid_len; ++grid_row) {
            var box_id = 'r' + grid_row + 'c' + col;

            if (isNaN(grid[grid_row][col])) {
                if (document.getElementById(box_id)
                    .style.backgroundColor != valid_bg_color) {
                    document.getElementById(box_id)
                        .style.backgroundColor = valid_bg_color;
                }
            } else if (!has_row_error(grid_row, col)
                && !has_col_error(grid_row, col)
                && !has_subgrid_error(grid_row, col)) {
                if (document.getElementById(box_id)
                    .style.backgroundColor != valid_bg_color) {
                    document.getElementById(box_id)
                        .style.backgroundColor = valid_bg_color;
                }
            } else {
                if (document.getElementById(box_id)
                    .style.backgroundColor != invalid_bg_color) {
                    document.getElementById(box_id)
                        .style.backgroundColor = invalid_bg_color;
                }
            }
        }
    }

    // given a box row and col, color valid boxes in the subgrid white
    // and invalid boxes red
    // assumes the boxes in the given row and col have been previously checked
    function color_subgrid_boxes(row, col) {
        var start_row = row - (row % subgrid_len);
        var start_col = col - (col % subgrid_len);

        for (grid_row = start_row; grid_row < start_row + subgrid_len;
            ++grid_row) {
            for (grid_col = start_col; grid_col < start_col + subgrid_len;
                ++grid_col) {
                if (row == grid_row) {
                    break;
                }

                if (col == grid_col) {
                    continue;
                }

                var box_id = 'r' + grid_row + 'c' + grid_col;

                if (isNaN(grid[grid_row][grid_col])) {
                    if (document.getElementById(box_id)
                        .style.backgroundColor != valid_bg_color) {
                        document.getElementById(box_id)
                            .style.backgroundColor = valid_bg_color;
                    }
                } else if (!has_row_error(grid_row, grid_col)
                    && !has_col_error(grid_row, grid_col)
                    && !has_subgrid_error(grid_row, grid_col)) {
                    if (document.getElementById(box_id)
                        .style.backgroundColor != valid_bg_color) {
                        document.getElementById(box_id)
                            .style.backgroundColor = valid_bg_color;
                    }
                } else {
                    if (document.getElementById(box_id)
                        .style.backgroundColor != invalid_bg_color) {
                        document.getElementById(box_id)
                            .style.backgroundColor = invalid_bg_color;
                    }
                }
            }
        }
    }

    // given a box location, color valid boxes white and invalid boxes red
    function handle_grid_coloring(box_row, box_col) {
        color_row_boxes(box_row);
        color_col_boxes(box_col);
        color_subgrid_boxes(box_row, box_col);
    }

    // place a value in a box
    function place_value(box, box_val) {
        box.innerHTML = box_val;
        var box_row = box.id.charAt(1);
        var box_col = box.id.charAt(3);
        grid[box_row][box_col] = box_val;
        handle_grid_coloring(box_row, box_col);
    }

    $('.box').hover(function () {
        user_interacting = true;
        cur_box_id = this.id;
    }, function () {
            user_interacting = false;
            cur_box_id = "";
    });

    $(document).keypress(function (e) {
        if (user_interacting) {
            var box_val = 0;
            var key = e.keyCode;

            if (key > 48 && key <= 57) { // numbers
                box_val = key - 48;
            } else if (key > 96 && key <= 105) { // numpad
                box_val = key - 96;
            }
            if (box_val) {
                var box = document.getElementById(cur_box_id);
                setTimeout(function () {
                    place_value(box, box_val);
                }, 1000);
            }
        }
    });
});