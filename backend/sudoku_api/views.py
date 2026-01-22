from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .sudoku_generator import SudokuGenerator
from .sudoku_solver import SudokuValidator

# Store puzzles in memory (in production, use a database)
puzzles = {}

def home(request):
    return HttpResponse("Welcome to the Sudoku App homepage!")

@api_view(['POST'])
def generate_puzzle(request):
    """Generate a new sudoku puzzle"""
    print("Generate a new sudoku puzzle")
    difficulty = request.data.get('difficulty', 'medium')
    
    if difficulty not in ['easy', 'medium', 'hard']:
        return Response({'error': 'Invalid difficulty'}, status=400)
    
    generator = SudokuGenerator()
    result = generator.generate_puzzle(difficulty)
    
    # Generate a unique ID for this puzzle
    import uuid
    puzzle_id = str(uuid.uuid4())
    
    # Store the original puzzle and solution
    puzzles[puzzle_id] = {
        'original': result['puzzle'],
        'solution': result['solution']
    }
    
    return Response({
        'puzzle_id': puzzle_id,
        'puzzle': result['puzzle'],
        'difficulty': difficulty
    })

@api_view(['POST'])
def verify_solution(request):
    """Verify if submitted sudoku solution is correct"""
    print("Verify if submitted sudoku solution is correct")
    puzzle_id = request.data.get('puzzle_id')
    submitted_grid = request.data.get('grid')
    
    if not puzzle_id or puzzle_id not in puzzles:
        return Response({'error': 'Invalid puzzle ID'}, status=400)
    
    if not submitted_grid:
        return Response({'error': 'No grid provided'}, status=400)
    
    original_puzzle = puzzles[puzzle_id]['original']
    
    validator = SudokuValidator()
    is_valid = validator.is_valid_with_original(submitted_grid, original_puzzle)
    
    response_data = {
        'correct': is_valid,
        'message': 'Congratulations! You solved it correctly!' if is_valid else 'The solution is incorrect. Keep trying!'
    }
    
    if is_valid:
        # Optionally include the solution
        response_data['solution'] = puzzles[puzzle_id]['solution']
    
    return Response(response_data)