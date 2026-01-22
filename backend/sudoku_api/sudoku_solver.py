class SudokuValidator:
    @staticmethod
    def is_valid_solution(grid):
        """Validate if the sudoku solution is correct"""
        # Check if grid is complete (no zeros)
        for row in grid:
            if 0 in row:
                return False
        
        # Check rows
        for row in grid:
            if sorted(row) != list(range(1, 10)):
                return False
        
        # Check columns
        for col in range(9):
            column = [grid[row][col] for row in range(9)]
            if sorted(column) != list(range(1, 10)):
                return False
        
        # Check 3x3 boxes
        for box_row in range(0, 9, 3):
            for box_col in range(0, 9, 3):
                box = []
                for i in range(box_row, box_row + 3):
                    for j in range(box_col, box_col + 3):
                        box.append(grid[i][j])
                if sorted(box) != list(range(1, 10)):
                    return False
        
        return True
    
    @staticmethod
    def is_valid_with_original(submitted_grid, original_puzzle):
        """Validate that submitted solution matches original puzzle constraints"""
        # Check that original numbers haven't been changed
        for i in range(9):
            for j in range(9):
                if original_puzzle[i][j] != 0:
                    if submitted_grid[i][j] != original_puzzle[i][j]:
                        return False
        
        # Check if solution is valid
        return SudokuValidator.is_valid_solution(submitted_grid)