#!/usr/bin/env python3
"""
Simple Flask API for Drawing Solver
Handles OCR processing and equation solving
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import tempfile
import os
import sys

# Add the parent directory to the path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)
CORS(app)

# Try to import our modules
try:
    import olol_hahahaa
    SOLVER_AVAILABLE = True
except ImportError as e:
    print(f"Solver module not available: {e}")
    SOLVER_AVAILABLE = False

try:
    import lcd
    OCR_AVAILABLE = True
    print("OCR module loaded successfully")
except ImportError as e:
    print(f"OCR module not available: {e}")
    OCR_AVAILABLE = False

@app.route('/api/ocr/process', methods=['POST'])
def process_ocr():
    """Process uploaded image through OCR"""
    temp_file = None
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Save the uploaded file temporarily
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        temp_file.close()
        file.save(temp_file.name)
        
        # Real OCR processing using your lcd module
        if OCR_AVAILABLE:
            result = lcd.process_image(temp_file.name)
            print(f"[DEBUG] OCR result: {result}")
            
            # Clean up temp file before returning
            if temp_file:
                os.unlink(temp_file.name)
            
            # Check if OCR actually failed or just had solving issues
            if result.get("error") and not result.get("latex_raw"):
                # Real OCR failure
                return jsonify(result), 500
            elif result.get("error") and result.get("latex_raw"):
                # OCR succeeded but solving failed - this is not a 500 error
                print(f"[DEBUG] OCR succeeded but solving failed: {result['error']}")
                result["warning"] = result.pop("error")  # Convert error to warning
                return jsonify(result), 200
            else:
                # Complete success
                return jsonify(result), 200
        else:
            # Fallback if OCR not available
            result = {
                "error": "OCR module not available"
            }
            # Clean up temp file before returning
            if temp_file:
                os.unlink(temp_file.name)
            return jsonify(result), 500
        
    except Exception as e:
        print(f"[DEBUG] API exception: {e}")
        # Clean up temp file before returning error
        if temp_file:
            os.unlink(temp_file.name)
        return jsonify({'error': f'OCR processing failed: {str(e)}'}), 500

@app.route('/api/solver/solve', methods=['POST'])
def solve_equation():
    """Solve the given equation"""
    try:
        data = request.get_json()
        if not data or 'equation' not in data:
            return jsonify({'error': 'No equation provided'}), 400
        
        equation = data['equation']
        print(f"[DEBUG] API received equation: {equation}")
        
        if not SOLVER_AVAILABLE:
            return jsonify({'error': 'Equation solver not available'}), 500
        
        # Handle Eq(...) format - extract content and convert to equation
        if equation.startswith('Eq(') and equation.endswith(')'):
            print(f"[DEBUG] Found Eq format: {equation}")
            # Extract content from Eq(..., ...) format
            content = equation[3:-1]  # Remove 'Eq(' and ')'
            print(f"[DEBUG] Extracted content: {content}")
            
            # Find the comma that separates left and right sides
            # We need to be careful about commas inside parentheses
            paren_count = 0
            split_pos = -1
            
            for i, char in enumerate(content):
                if char == '(':
                    paren_count += 1
                elif char == ')':
                    paren_count -= 1
                elif char == ',' and paren_count == 0:
                    split_pos = i
                    break
            
            if split_pos != -1:
                left_side = content[:split_pos]
                right_side = content[split_pos + 1:]
                equation = f"{left_side}={right_side}"
                print(f"[DEBUG] Converted Eq to equation: {equation}")
            else:
                # If no comma found, treat as single expression = 0
                equation = f"{content}=0"
                print(f"[DEBUG] No comma found, treating as: {equation}")
        
        # Handle OCR errors: replace comma with equal sign
        # This helps with common OCR misreadings where "," is read instead of "="
        if ',' in equation and '=' not in equation:
            equation = equation.replace(',', '=')
            print(f"[DEBUG] Replaced comma with equals: {equation}")
        
        print(f"[DEBUG] Final equation to solve: {equation}")
        
        # Solve the equation
        solution = olol_hahahaa.stepwise_rational_solution_with_explanations(equation)
        
        return jsonify({
            'solution': solution,
            'steps': solution.split('\n'),
            'error': None
        })
        
    except Exception as e:
        print(f"[DEBUG] API solver exception: {e}")
        return jsonify({'error': f'Equation solving failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ocr_available': OCR_AVAILABLE,
        'solver_available': SOLVER_AVAILABLE
    })

if __name__ == '__main__':
    print("Starting Drawing Solver API...")
    print(f"OCR Available: {OCR_AVAILABLE}")
    print(f"Solver Available: {SOLVER_AVAILABLE}")
    app.run(host='0.0.0.0', port=5001, debug=True)
