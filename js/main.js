window.onload = function () {

    /*
     * button functionality
     */

    document.getElementById("load_btn")
        .addEventListener("click", load_puzzle, false);
    document.getElementById("reset_btn")
        .addEventListener("click", reset_puzzle, false);
    document.getElementById("undo_btn")
        .addEventListener("click", undo_last, false);
    document.getElementById("hint_btn")
        .addEventListener("click", give_hint, false);
    document.getElementById("solve_btn")
        .addEventListener("click", solve_puzzle, false);

    /*
     * puzzle storage
     */

    let easy_puzzles = [

    ];

    let medium_puzzles = [

    ];

    let hard_puzzles = [

    ];

    /*
     * sudoku grid data
     */

    function create_Box() {
        let _value = NaN;
        let _is_modifiable = true;

        return {
            value() {
                return _value;
            },
            is_modifiable() {
                return _is_modifiable;
            },
            set_value(new_value) {
                _value = new_value;
            },
            set_modifiable(new_modif) {
                _is_modifiable = new_modif;
            }
        }
    }

    const grid_len = 9;
    const subgrid_len = grid_len / 3;

    let grid = [];
    for (let grid_row = 0; grid_row < grid_len; ++grid_row) {
        let row = [];
        for (let grid_col = 0; grid_col < grid_len; ++grid_col) {
            row.push(create_Box());
        }
        grid.push(row);
    }

    const valid_bg_color = "white";
    const invalid_bg_color = "red";
    const empty_text_content = "";
    let user_interacting = false;
    let cur_box_id = "";


    /*
     * Error checking for boxes
     */

    // determine if a box is modifiable
    function is_modifiable(box) {
        let box_row = box.id.charAt(1);
        let box_col = box.id.charAt(3);
        return grid[box_row][box_col].is_modifiable();
    }

    // check if a box has a row error
    function has_row_error(box_row, box_col) {
        const box_val = grid[box_row][box_col].value();
        if (isNaN(box_val)) {
            return false;
        }

        for (let grid_col = 0; grid_col < grid_len; ++grid_col) {
            if (box_col == grid_col) {
                continue;
            }

            if (grid[box_row][grid_col].value() == box_val) {
                return true;
            }
        }
        return false;
    }

    // check if a box has a column error
    function has_col_error(box_row, box_col) {
        const box_val = grid[box_row][box_col].value();
        if (isNaN(box_val)) {
            return false;
        }

        for (let grid_row = 0; grid_row < grid_len; ++grid_row) {
            if (box_row == grid_row) {
                continue;
            }

            if (grid[grid_row][box_col].value() == box_val) {
                return true;
            }
        }
        return false;
    }

    // check if a box has a subgrid error
    function has_subgrid_error(box_row, box_col) {
        const box_val = grid[box_row][box_col].value();
        if (isNaN(box_val)) {
            return false;
        }

        const start_row = box_row - (box_row % subgrid_len);
        const start_col = box_col - (box_col % subgrid_len);

        for (let grid_row = start_row; grid_row < start_row + subgrid_len;
            ++grid_row) {
            for (let grid_col = start_col; grid_col < start_col + subgrid_len;
                ++grid_col) {
                if (box_row == grid_row && box_col == grid_col) {
                    continue;
                }

                if (grid[grid_row][grid_col].value() == box_val) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * Coloring of valid and invalid boxes
     */

    // color a box
    function color_box(box_id, color) {
        if (document.getElementById(box_id)
            .style.backgroundColor != color) {
            document.getElementById(box_id)
                .style.backgroundColor = color;
        }
    }

    // given a row, color valid boxes white and invalid boxes red
    function color_row_boxes(row) {
        for (let grid_col = 0; grid_col < grid_len; ++grid_col) {
            const box_id = 'r' + row + 'c' + grid_col;

            if (isNaN(grid[row][grid_col].value())) {
                color_box(box_id, valid_bg_color);
            } else if (!has_row_error(row, grid_col)
                && !has_col_error(row, grid_col)
                && !has_subgrid_error(row, grid_col)) {
                color_box(box_id, valid_bg_color);
            } else {
                color_box(box_id, invalid_bg_color);
            }
        }
    }

    // given a col, color valid boxes white and invalid boxes red
    function color_col_boxes(col) {
        for (let grid_row = 0; grid_row < grid_len; ++grid_row) {
            const box_id = 'r' + grid_row + 'c' + col;

            if (isNaN(grid[grid_row][col].value())) {
                color_box(box_id, valid_bg_color);
            } else if (!has_row_error(grid_row, col)
                && !has_col_error(grid_row, col)
                && !has_subgrid_error(grid_row, col)) {
                color_box(box_id, valid_bg_color);
            } else {
                color_box(box_id, invalid_bg_color);
            }
        }
    }

    // given a box row and col, color valid boxes in the subgrid white
    // and invalid boxes red
    // assumes the boxes in the given row and col have been previously checked
    function color_subgrid_boxes(row, col) {
        const start_row = row - (row % subgrid_len);
        const start_col = col - (col % subgrid_len);
        for (let grid_row = start_row; grid_row < start_row + subgrid_len;
            ++grid_row) {
            for (let grid_col = start_col; grid_col < start_col + subgrid_len;
                ++grid_col) {
                if (row == grid_row) {
                    break;
                }

                if (col == grid_col) {
                    continue;
                }

                const box_id = 'r' + grid_row + 'c' + grid_col;

                if (isNaN(grid[grid_row][grid_col].value())) {
                    color_box(box_id, valid_bg_color);
                } else if (!has_subgrid_error(grid_row, grid_col)
                    && !has_row_error(grid_row, grid_col)
                    && !has_col_error(grid_row, grid_col)) {
                    color_box(box_id, valid_bg_color);
                } else {
                    color_box(box_id, invalid_bg_color);
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
        const box_row = box.id.charAt(1);
        const box_col = box.id.charAt(3);
        if (box_val != empty_text_content) {
            grid[box_row][box_col].set_value(box_val);
        } else {
            grid[box_row][box_col].set_value(NaN);
        }
        handle_grid_coloring(box_row, box_col);
    }

    /*
     * user interface methods
     */

    // update that the user is interacting when a box is hovered
    $('.box').hover(function () {
        if (is_modifiable(this)) {
            user_interacting = true;
            cur_box_id = this.id;
        }
    }, function () {
            if (is_modifiable(this)) {
                user_interacting = false;
                cur_box_id = "";
            }
    });

    // read valid key presses when the user is interacting
    $(document).keypress(function (e) {
        if (user_interacting) {
            let box_val = 0;
            const key = e.keyCode;

            if (key > 48 && key <= 57) { // numbers
                box_val = key - 48;
            } else if (key > 96 && key <= 105) { // numpad
                box_val = key - 96;
            }
            if (box_val) {
                let box = document.getElementById(cur_box_id);
                place_value(box, box_val);
            }
        }
    });

    /*
     * button onclick methods 
     */

    // clear the grid and make all boxes empty
    function clear_grid() {
        for (let grid_row = 0; grid_row < grid_len; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_len; ++grid_col) {
                let box = document
                    .getElementById('r' + grid_row + 'c' + grid_col);
                grid[grid_row][grid_col].set_modifiable(true);
                place_value(box, empty_text_content);
            }
        }
    }

    // load a puzzle with the selected difficulty
    function load_puzzle() {
        clear_grid();
        // check difficulty
        // get a random number limited by size of amount of puzzles
        // get index of puzzle
        // loop through string representing puzzle
        // place values down
        // make those boxes unmodifiable
    }

    // reset a puzzle to the default state
    function reset_puzzle() {
        // just change puzzle back to unmodifiable tiles
    }

    // undo the last value placement
    function undo_last() {
        // keep array of actions
        // cleared when grid is cleared/reset or a new puzzle is loaded
    }

    // change or place a correct value into a box
    function give_hint() {
        // try to solve puzzle using given info
        // give a random uncleared box (if there are any)
        // otherwise change status
    }

    // solve the puzzle for the player
    function solve_puzzle() {
        // try to solve puzzle using given info
        // otherwise try with only the unmodifiable boxes
        // otherwise change status
    }

}
