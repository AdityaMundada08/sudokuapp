import random
import copy

class SudokuGenerator:
    def __init__(self):
        self.grid = [[0 for _ in range(9)] for _ in range(9)]
    
    def is_valid(self, grid, row, col, num):
        """Check if placing num at (row, col) is valid"""
        # Check row
        if num in grid[row]:
            return False
        
        # Check column
        if num in [grid[i][col] for i in range(9)]:
            return False
        
        # Check 3x3 box
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if grid[i][j] == num:
                    return False
        
        return True
    
    def solve(self, grid):
        """Solve sudoku using backtracking"""
        for row in range(9):
            for col in range(9):
                if grid[row][col] == 0:
                    numbers = list(range(1, 10))
                    random.shuffle(numbers)
                    for num in numbers:
                        if self.is_valid(grid, row, col, num):
                            grid[row][col] = num
                            if self.solve(grid):
                                return True
                            grid[row][col] = 0
                    return False
        return True
    
    def count_solutions(self, grid, limit=2):
        """Count number of solutions (up to limit)"""
        count = [0]
        
        def solve_count(g):
            if count[0] >= limit:
                return
            
            for row in range(9):
                for col in range(9):
                    if g[row][col] == 0:
                        for num in range(1, 10):
                            if self.is_valid(g, row, col, num):
                                g[row][col] = num
                                solve_count(g)
                                g[row][col] = 0
                        return
            count[0] += 1
        
        grid_copy = copy.deepcopy(grid)
        solve_count(grid_copy)
        return count[0]
    
    def generate_complete_grid(self):
        """Generate a complete solved sudoku grid"""
        self.grid = [[0 for _ in range(9)] for _ in range(9)]
        self.solve(self.grid)
        return self.grid
    
    def remove_numbers(self, grid, difficulty):
        """Remove numbers based on difficulty level"""
        attempts_map = {
            'easy': 35,
            'medium': 45,
            'hard': 55
        }
        
        attempts = attempts_map.get(difficulty, 40)
        puzzle = copy.deepcopy(grid)
        cells = [(i, j) for i in range(9) for j in range(9)]
        random.shuffle(cells)
        
        removed = 0
        for row, col in cells:
            if removed >= attempts:
                break
            
            backup = puzzle[row][col]
            puzzle[row][col] = 0
            
            # Check if puzzle still has unique solution
            if self.count_solutions(puzzle, 2) == 1:
                removed += 1
            else:
                puzzle[row][col] = backup
        
        return puzzle
    
    def generate_puzzle(self, difficulty='medium'):
        """Generate a sudoku puzzle with given difficulty"""
        complete_grid = self.generate_complete_grid()
        puzzle = self.remove_numbers(complete_grid, difficulty)
        return {
            'puzzle': puzzle,
            'solution': complete_grid
        }