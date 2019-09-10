window.onload = function () {

    /*
     * Methods for button functionality.
     */

    document.getElementById("easy_puzzle_btn")
        .addEventListener("click", load_easy_puzzle, false);
    document.getElementById("medium_puzzle_btn")
        .addEventListener("click", load_medium_puzzle, false);
    document.getElementById("hard_puzzle_btn")
        .addEventListener("click", load_hard_puzzle, false);

    document.getElementById("reset_btn")
        .addEventListener("click", reset_puzzle, false);
    document.getElementById("clear_btn")
        .addEventListener("click", clear_grid, false);
    document.getElementById("solve_btn")
        .addEventListener("click", solve_puzzle, false);

    /*
     * Information for puzzle storage.
     */

    const empty_box_storage_val = "_";
    const valid_box_values = "_123456789";
    const empty_puzzle
        = "_________________________________________________________________________________";

    const easy_puzzles = [
        "1__9_4_____4_3_5_6_2_7__49_____1_94__59_7_32__17_2_____83__7_5_5_1_9_6_____6_5__3",
        "____1_4_6___6_8_7_65___213__4_28_7_35__4_6__92_8_31_5__951___42_2_3_9___1_3_2____",
        "8_4_____7_65_27_18_72_3_9_5_9__1___3____8____5___7__2_6_1_9_85_25_16_73_3_____6_1",
        "_74______5_2_48___1_83_7542____1_9_7_2_9_4_8_3_9_8____9476_51_8___47_2_9______67_",
        "___2____554_718_26___65_9_7___9872____2___8____1524___2_7_65___41_892_636____1___",
        "______8_57__58___6_2_6_3_918_21__54____4_2____94__73_228_9_5_1_6___28__44_5______",
        "_23____5_6_7_3_82___4__96_____4_32___4_752_6___19_8_____52__3___32_7_9_6_1____57_",
        "4_652____732_6___45___387___1_8__9_2_________9_5__4_3___895___33___8_159____462_8",
        "_8____1939____867__56__14__5_7_34____1_8_7_6____19_2_7__54__93__947____2623____4_",
        "92_6_3___8_7____6553__________46__824_15_26_765__98__________5924____8_6___2_5_71"
    ];

    const medium_puzzles = [
        "__97_2_____1_____98_23__7__48__7__5__2_569_8__9__3__67__8__53_25_____8_____9_76__",  
        "__2598_6_9_5_7__3__4_16___5__9_______7_8_5_1_______3__6___59_2__5__8_9_3_9_2148__",
        "6_9__8___51_7___8____1__9_2_75__6___8___2___9___3__56_4_7__1____9___5_37___2__6_5",
        "_29__57__5____4__8____3__51_853______9__8__1______148_46__2____2__4____5__18__34_",
        "___25____4___16_929______8__6__72_43_________32_94__7__9______424_19___5____28___",
        "5____4______6_5_1_21____4351__5_9_4_9_2___3_7_3_8_2__1725____96_9_7_6______2____4",
        "_____2_1___164___96___9__538__2___47_3_____6_45___6__272__8___65___612___6_4_____",
        "_8_51___6__4__2___79_38__________419_4_____7_168__________21_57___9__3__9___43_2_",
        "7___4__96______1__2_5________32__45__825_196__57__63________8_9__8______19__5___2",
        "1_______6__6_7_8___83__5_728459___6___________6___478169_3__51___8_9_3__2_______7"
    ];

    const hard_puzzles = [
        "_46_____9_7_2_____9__6_58________9_66_53_92_13_9________18_3__2_____2_9_2_____16_",
        "_62_____7___4_7______5__6__5___43_71__61_93__37_28___4__5__4______7_8___9_____75_",
        "___4___5_14_9__72___8__1_9___6___8__41_____32__9___6___7_8__5___52__9_43_9___5___",
        "1___784___7____5____4_13___7__1_98_6_________3_12_7__5___69_1____5____8___985___4",
        "___4__175___7____3_4______6__1__7_89_2__1__5_49_5__6__8______1_2____4___379__6___",
        "9__2____7_2___4__38____529__91______5___9___2______63__631____52__7___6_1____9__4",
        "______32_____49_7__7__18__953_________25879_________456__92__8__9_87_____17______",
        "__5_74__1____815________62_3_2_______6_345_1_______8_3_57________145____9__16_4__",
        "_95____2_6_______4__4_62_1____47__9__3__1__6__1__95____5_98_1__8_______9_7____25_",
        "_4__3__9_1____75___3_8__1____45_9____8_____1____4_69____1__3_6___32____9_5__9__7_"
    ];

    /*
     * Information for the sudoku grid.
     */

    const empty_box_grid_val = NaN;
    function create_Box() {
        let _value = empty_box_grid_val;
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

    const grid_length = 9;
    const subgrid_length = grid_length / 3;

    let grid = [];
    for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
        let row = [];
        for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
            row.push(create_Box());
        }
        grid.push(row);
    }

    const valid_bg_color = "white";
    const invalid_bg_color = "red";
    const empty_text_content = "";
    const default_box_text_color = "black";
    const loaded_box_text_color = "blue";

    let user_interacting = false;
    let current_box_id = "";

    const in_progress_status = "In progress...";
    const solved_status = "Solved!";
    const unsolvable_status = "Unsolvable!";
    let puzzle_status = in_progress_status;

    /*
     * Methods for updating puzzle status
     */ 

    // change the status message
    function change_status(message) {
        document.getElementById('status').innerHTML = message;
        puzzle_status = message;
    }

    // check and update the status message
    function update_status() {
        if (has_empty_box().length == 0 && current_state_valid()) {
            change_status(solved_status);
        }
        else if (puzzle_status != in_progress_status) {
            change_status(in_progress_status);
        }
    }

    /*
     * Methods for error checking boxes.
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

        for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
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

        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
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

        const start_row = box_row - (box_row % subgrid_length);
        const start_col = box_col - (box_col % subgrid_length);

        for (let grid_row = start_row; grid_row < start_row + subgrid_length;
            ++grid_row) {
            for (let grid_col = start_col; grid_col < start_col + subgrid_length;
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

    // check if a box has any errors
    function has_error(box_row, box_col) {
        if (has_row_error(box_row, box_col)
            || has_col_error(box_row, box_col)
            || has_subgrid_error(box_row, box_col)) {
            return true;
        }
        return false;
    }

    /*
     * Methods for coloring boxes.
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
        for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
            const box_id = 'r' + row + 'c' + grid_col;

            if (isNaN(grid[row][grid_col].value())) {
                color_box(box_id, valid_bg_color);
            } else if (!has_error(row, grid_col)) {
                color_box(box_id, valid_bg_color);
            } else {
                color_box(box_id, invalid_bg_color);
            }
        }
    }

    // given a col, color valid boxes white and invalid boxes red
    function color_col_boxes(col) {
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            const box_id = 'r' + grid_row + 'c' + col;

            if (isNaN(grid[grid_row][col].value())) {
                color_box(box_id, valid_bg_color);
            } else if (!has_error(grid_row, col)) {
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
        const start_row = row - (row % subgrid_length);
        const start_col = col - (col % subgrid_length);
        for (let grid_row = start_row; grid_row < start_row + subgrid_length;
            ++grid_row) {
            for (let grid_col = start_col; grid_col < start_col + subgrid_length;
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
                } else if (!has_error(grid_row, grid_col)) {
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
        update_status();
    }


    /**
     * Methods for loading in puzzles.
     */

    // rotate the puzzle 90 degrees clockwise 
    // for a given amount of times
    function rotate_puzzle(puzzle) {
        let total_rotations = Math.floor(Math.random() * 4);
        let current_rotation = 0;
        let rotated_puzzle = puzzle;

        while (current_rotation != total_rotations) {
            let previous_puzzle = rotated_puzzle;
            rotated_puzzle = "";
            for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
                for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                    rotated_puzzle += previous_puzzle.charAt
                        (((grid_length - grid_col - 1) * grid_length)
                            + grid_row);
                }
            }
            ++current_rotation;
        }
        return rotated_puzzle;
    }

    // reflect a puzzle over its horizontal mid-line
    function reflect_horizontal(puzzle) {
        let reflected_puzzle = "";
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                reflected_puzzle += puzzle.charAt
                    (((grid_length - grid_row - 1) * grid_length)
                        + grid_col);
            }
        }
        return reflected_puzzle;
    } 

    // reflect a puzzle over its vertical mid-line
    function reflect_vertical(puzzle) {
        let reflected_puzzle = "";
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                reflected_puzzle += puzzle.charAt
                    ((grid_row * grid_length) + (grid_length - grid_col - 1));
            }
        }
        return reflected_puzzle;
    }

    // reflect a puzzle with itself, over its horizontal mid-line,
    // over its vertical mid-line, or over both of its mid-lines
    function reflect_puzzle(puzzle) {
        let reflection_specifier = Math.floor(Math.random() * 4);
        let reflected_puzzle = puzzle;

        if (reflection_specifier == 1) {
            reflected_puzzle = reflect_horizontal(puzzle);
        } else if (reflection_specifier == 2) {
            reflected_puzzle = reflect_vertical(puzzle);
        } else if (reflection_specifier == 3) {
            reflected_puzzle = reflect_horizontal(puzzle);
            reflected_puzzle = reflect_vertical(reflected_puzzle);
        }
        return reflected_puzzle;
    }

    // reassign each value on the board to another value
    function reassign_values(puzzle) {
        let assignments = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        assignments.sort(function (a, b) { return 0.5 - Math.random() });
        let reassigned_puzzle = "";
        for (let box_i = 0; box_i < puzzle.length; ++box_i) {
            if (puzzle.charAt(box_i) == empty_box_storage_val) {
                reassigned_puzzle += empty_box_storage_val;
            } else {
                reassigned_puzzle += assignments[Number(puzzle.charAt(box_i)) - 1];
            }
        }
        return reassigned_puzzle;
    }

    // scramble a puzzle
    function scramble_puzzle(puzzle) {
        let transformed_puzzle = rotate_puzzle(puzzle);
        transformed_puzzle = reflect_puzzle(transformed_puzzle);
        transformed_puzzle = reassign_values(transformed_puzzle);
        return transformed_puzzle;
    }

    // select a valid puzzle
    function select_puzzle(set_of_puzzles) {
        let random_index = Math.floor(Math.random() * (set_of_puzzles.length));
        selected_puzzle = set_of_puzzles[random_index];

        if (selected_puzzle.length != grid_length * grid_length) {
            selected_puzzle = empty_puzzle;
        }

        for (let value_i = 0; value_i < selected_puzzle.length; ++value_i) {
            if (!(valid_box_values.includes(selected_puzzle.charAt(value_i)))) {
                selected_puzzle = empty_puzzle;
                break;
            }
        }
        return selected_puzzle;
    }

    // load a puzzle into the grid
    function load_puzzle_to_grid(puzzle) {
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                let box = document
                    .getElementById('r' + grid_row + 'c' + grid_col);
                let puzzle_box_val = puzzle
                    .charAt((grid_row * grid_length) + grid_col);

                // representation of empty box val in storage is "_"
                // representation of empty box val on the viewed board is ""
                // set "_" to "" for placement on the board
                if (puzzle_box_val == empty_box_storage_val) {
                    puzzle_box_val = empty_text_content;
                }

                place_value(box, puzzle_box_val);

                if (puzzle_box_val != empty_text_content) {
                    box.style.color = loaded_box_text_color;
                    grid[grid_row][grid_col].set_modifiable(false);
                } else {
                    grid[grid_row][grid_col].set_modifiable(true);
                }
            }
        }
    }

    /*
    * Methods tied to buttons.
    */

    // clear the grid and make all boxes empty
    function clear_grid() {
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                let box = document
                    .getElementById('r' + grid_row + 'c' + grid_col);
                grid[grid_row][grid_col].set_modifiable(true);
                place_value(box, empty_text_content);
                if (box.style.color != default_box_text_color) {
                    box.style.color = default_box_text_color;
                }
            }
        }
    }

    // load an easy puzzle
    function load_easy_puzzle() {
        clear_grid();
        let default_puzzle = select_puzzle(easy_puzzles);
        let scrambled_puzzle = scramble_puzzle(default_puzzle);
        load_puzzle_to_grid(scrambled_puzzle);
    }

    // load a medium puzzle
    function load_medium_puzzle() {
        clear_grid();
        let default_puzzle = select_puzzle(medium_puzzles);
        let scrambled_puzzle = scramble_puzzle(default_puzzle);
        load_puzzle_to_grid(scrambled_puzzle);
    }

    // load a hard puzzle
    function load_hard_puzzle() {
        clear_grid();
        let default_puzzle = select_puzzle(hard_puzzles);
        let scrambled_puzzle = scramble_puzzle(default_puzzle);
        load_puzzle_to_grid(scrambled_puzzle);
    }

    // reset a puzzle to its default state
    function reset_puzzle() {
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                if (grid[grid_row][grid_col].is_modifiable()) {
                    let box = document
                        .getElementById('r' + grid_row + 'c' + grid_col);
                    place_value(box, empty_text_content);
                }
            }
        }
    }

    // check the validity of the current state
    function current_state_valid() {
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                if (has_error(grid_row, grid_col)) {
                    return false;
                }
            }
        }
        return true;
    }

    // return the coordinates of an empty box
    function has_empty_box() {
        let box_coords = [];
        for (let grid_row = 0; grid_row < grid_length; ++grid_row) {
            for (let grid_col = 0; grid_col < grid_length; ++grid_col) {
                if (isNaN(grid[grid_row][grid_col].value())) {
                    box_coords = [grid_row, grid_col];
                    return box_coords;
                }
            }
        }
        return box_coords;
    }

    // helper to solve the puzzle
    function solve_puzzle_helper() {
        let empty_box_coords = has_empty_box();
        if (empty_box_coords.length == 0) {
            return true;
        }

        let box_row = empty_box_coords[0];
        let box_col = empty_box_coords[1];
        let box = document.getElementById('r' + box_row + 'c' + box_col);

        for (let valid_i = 1; valid_i < valid_box_values.length; ++valid_i) {
            place_value(box, valid_box_values[valid_i]);
            if (has_error(box_row, box_col)) {
                place_value(box, empty_text_content);
            } else {
                if (solve_puzzle_helper()) {
                    return true;
                }
                place_value(box, empty_text_content);
            }
        }
        return false;
    }

    // solve the puzzle for the player
    // try to solve the puzzle with the current inputs
    // if the puzzle is unsolvable, reset the puzzle
    // to its default state and try again
    function solve_puzzle() {
        if (current_state_valid()) {
            let is_solvable = solve_puzzle_helper();
            if (!is_solvable) {
                reset_puzzle();
                is_solvable = solve_puzzle_helper();
                if (!is_solvable) {
                    change_status(unsolvable_status);
                }
            }
        } else {
            reset_puzzle();
            let is_solvable = solve_puzzle_helper();
            if (!is_solvable) {
                change_status(unsolvable_status);
            }
        }
    }

    /*
     * Methods for user interaction.
     */

    // update that the user is interacting when a box is hovered
    $('.box').hover(function () {
        if (is_modifiable(this)) {
            user_interacting = true;
            current_box_id = this.id;
        }
    }, function () {
        if (is_modifiable(this)) {
            user_interacting = false;
            current_box_id = "";
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
                let box = document.getElementById(current_box_id);
                place_value(box, box_val);
            }
        }
    });
}
