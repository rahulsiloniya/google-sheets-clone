// src/utils/mathFunctions.ts
import { FormulaParser } from 'hot-formula-parser';

/**
 * Register custom mathematical functions with the formula parser
 * @param parser - The formula parser instance
 */
export function registerMathFunctions(parser: FormulaParser): void {
  // 1. SUM function
  parser.setFunction('SUM', function(params: number[]): number {
    if (!params || !params.length) {
      return 0;
    }
    
    // Flatten nested arrays and filter out non-numeric values
    const flattenedParams = params.flat(Infinity).filter(value => 
      typeof value === 'number' && !isNaN(value)
    );
    
    // Calculate sum
    return flattenedParams.reduce((acc, val) => acc + val, 0);
  });
  
  // 2. AVERAGE function
  parser.setFunction('AVERAGE', function(params: number[]): number {
    if (!params || !params.length) {
      return 0;
    }
    
    // Flatten nested arrays and filter out non-numeric values
    const flattenedParams = params.flat(Infinity).filter(value => 
      typeof value === 'number' && !isNaN(value)
    );
    
    if (flattenedParams.length === 0) {
      return 0;
    }
    
    // Calculate sum
    const sum = flattenedParams.reduce((acc, val) => acc + val, 0);
    
    // Return average
    return sum / flattenedParams.length;
  });
  
  // 3. MAX function
  parser.setFunction('MAX', function(params: number[]): number {
    if (!params || !params.length) {
      return 0;
    }
    
    // Flatten nested arrays and filter out non-numeric values
    const flattenedParams = params.flat(Infinity).filter(value => 
      typeof value === 'number' && !isNaN(value)
    );
    
    if (flattenedParams.length === 0) {
      return 0;
    }
    
    // Find maximum value
    return Math.max(...flattenedParams);
  });
  
  // 4. MIN function
  parser.setFunction('MIN', function(params: number[]): number {
    if (!params || !params.length) {
      return 0;
    }
    
    // Flatten nested arrays and filter out non-numeric values
    const flattenedParams = params.flat(Infinity).filter(value => 
      typeof value === 'number' && !isNaN(value)
    );
    
    if (flattenedParams.length === 0) {
      return 0;
    }
    
    // Find minimum value
    return Math.min(...flattenedParams);
  });
  
  // 5. COUNT function
  parser.setFunction('COUNT', function(params: unknown[]): number {
    if (!params || !params.length) {
      return 0;
    }
    
    // Flatten nested arrays and count numeric values
    return params.flat(Infinity).filter(value => 
      typeof value === 'number' && !isNaN(value)
    ).length;
  });
}