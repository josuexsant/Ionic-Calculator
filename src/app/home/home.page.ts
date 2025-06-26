import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  display: string = '0';
  secondaryDisplay: string = '';
  
  // Calculator state
  private currentInput: string = '';
  private calculationResult: string = '';
  private operator: string = '';
  private previousInput: string = '';
  private isNewInput: boolean = true;
  private readonly basicOperators: string[] = ['+', '-', '*', '/'];
  
  // Scientific mode properties (always in scientific mode for landscape layout)
  isScientific: boolean = true;
  isSecondFunction: boolean = false;
  isRadians: boolean = true;
  
  // Memory
  private memoryValue: number = 0;
  private hasMemory: boolean = false;
  
  // Advanced state
  private lastOperation: string = '';
  private operatorActive: boolean = false;
  
  constructor() {}

  // Basic calculator functions
  public allClear(): void {
    this.display = '0';
    this.secondaryDisplay = '';
    this.currentInput = '';
    this.calculationResult = '';
    this.operator = '';
    this.previousInput = '';
    this.isNewInput = true;
    this.operatorActive = false;
    this.lastOperation = '';
  }

  public clear(): void {
    if (this.display !== '0') {
      this.display = '0';
      this.currentInput = '';
      this.isNewInput = true;
    } else {
      this.allClear();
    }
  }

  public backspace(): void {
    if (this.display.length > 1 && this.display !== '0') {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
      this.isNewInput = true;
    }
    this.currentInput = this.display;
  }

  public append(value: string): void {
    if (this.basicOperators.includes(value)) {
      this.handleOperator(value);
    } else if (this.isFunction(value)) {
      this.handleFunction(value);
    } else {
      this.handleNumber(value);
    }
  }

  private handleNumber(value: string): void {
    if (this.isNewInput || this.display === '0') {
      this.display = value;
      this.isNewInput = false;
    } else {
      this.display += value;
    }
    this.currentInput = this.display;
    this.operatorActive = false;
  }

  private handleOperator(op: string): void {
    if (this.operator && !this.isNewInput && !this.operatorActive) {
      this.calculate();
    }
    
    this.operator = op;
    this.previousInput = this.currentInput || this.display;
    this.secondaryDisplay = `${this.previousInput} ${this.getOperatorSymbol(op)}`;
    this.isNewInput = true;
    this.operatorActive = true;
  }

  private getOperatorSymbol(op: string): string {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  }

  public calculate(): void {
    if (!this.operator || !this.previousInput || this.isNewInput) {
      return;
    }

    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput || this.display);
    
    if (isNaN(prev) || isNaN(current)) {
      this.display = 'Error';
      return;
    }

    let result: number;

    try {
      switch (this.operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) {
            this.display = 'Error';
            return;
          }
          result = prev / current;
          break;
        default:
          return;
      }

      this.lastOperation = `${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${current}`;
      this.secondaryDisplay = this.lastOperation;
      this.display = this.formatResult(result);
      this.currentInput = this.display;
      this.operator = '';
      this.previousInput = '';
      this.isNewInput = true;
      this.operatorActive = false;
    } catch (error) {
      this.display = 'Error';
      this.allClear();
    }
  }

  private formatResult(result: number): string {
    if (result % 1 === 0 && Math.abs(result) < 1e10) {
      return result.toString();
    } else if (Math.abs(result) >= 1e10 || Math.abs(result) < 1e-6) {
      return result.toExponential(6);
    } else {
      return parseFloat(result.toFixed(10)).toString();
    }
  }

  public appendDecimal(): void {
    if (this.isNewInput) {
      this.display = '0.';
      this.isNewInput = false;
    } else if (!this.display.includes('.')) {
      this.display += '.';
    }
    this.currentInput = this.display;
  }

  // Scientific mode functions
  public toggleScientific(): void {
    this.isScientific = !this.isScientific;
  }

  public toggleSecond(): void {
    this.isSecondFunction = !this.isSecondFunction;
  }

  public toggleRadDeg(): void {
    this.isRadians = !this.isRadians;
  }

  public toggleSign(): void {
    if (this.display !== '0' && this.display !== 'Error') {
      if (this.display.startsWith('-')) {
        this.display = this.display.substring(1);
      } else {
        this.display = '-' + this.display;
      }
      this.currentInput = this.display;
    }
  }

  public percentage(): void {
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      const result = value / 100;
      this.display = this.formatResult(result);
      this.currentInput = this.display;
      this.isNewInput = true;
    }
  }

  // Memory functions
  public memoryClear(): void {
    this.memoryValue = 0;
    this.hasMemory = false;
  }

  public memoryAdd(): void {
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.memoryValue += value;
      this.hasMemory = true;
    }
  }

  public memorySubtract(): void {
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.memoryValue -= value;
      this.hasMemory = true;
    }
  }

  public memoryRecall(): void {
    if (this.hasMemory) {
      this.display = this.formatResult(this.memoryValue);
      this.currentInput = this.display;
      this.isNewInput = true;
    }
  }

  // Advanced functions
  private isFunction(value: string): boolean {
    const functions = [
      'sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(',
      'log(', 'ln(', 'exp(', 'sqrt(', 'cbrt(',
      '^2', '^3', '^', '!', '1/', 'pi', 'e',
      'sinh(', 'cosh(', 'tanh('
    ];
    return functions.some(func => value.includes(func)) || value === 'pi' || value === 'e';
  }

  private handleFunction(func: string): void {
    const value = parseFloat(this.display);
    let result: number;

    try {
      switch (func) {
        case 'sin(':
          result = this.isRadians ? Math.sin(value) : Math.sin(value * Math.PI / 180);
          break;
        case 'cos(':
          result = this.isRadians ? Math.cos(value) : Math.cos(value * Math.PI / 180);
          break;
        case 'tan(':
          result = this.isRadians ? Math.tan(value) : Math.tan(value * Math.PI / 180);
          break;
        case 'asin(':
          result = this.isRadians ? Math.asin(value) : Math.asin(value) * 180 / Math.PI;
          break;
        case 'acos(':
          result = this.isRadians ? Math.acos(value) : Math.acos(value) * 180 / Math.PI;
          break;
        case 'atan(':
          result = this.isRadians ? Math.atan(value) : Math.atan(value) * 180 / Math.PI;
          break;
        case 'log(':
          result = Math.log10(value);
          break;
        case 'ln(':
          result = Math.log(value);
          break;
        case 'exp(':
          result = Math.exp(value);
          break;
        case 'sqrt(':
          result = Math.sqrt(value);
          break;
        case 'cbrt(':
          result = Math.cbrt(value);
          break;
        case '^2':
          result = value * value;
          break;
        case '^3':
          result = value * value * value;
          break;
        case '!':
          result = this.factorial(value);
          break;
        case '1/':
          result = 1 / value;
          break;
        case 'sinh(':
          result = Math.sinh(value);
          break;
        case 'cosh(':
          result = Math.cosh(value);
          break;
        case 'tanh(':
          result = Math.tanh(value);
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          if (func.includes('^')) {
            // Handle power operations
            return;
          }
          return;
      }

      if (isNaN(result) || !isFinite(result)) {
        this.display = 'Error';
      } else {
        this.display = this.formatResult(result);
      }
      
      this.currentInput = this.display;
      this.isNewInput = true;
    } catch (error) {
      this.display = 'Error';
    }
  }

  private factorial(n: number): number {
    if (n < 0 || n % 1 !== 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  public appendEE(): void {
    if (!this.display.includes('e') && this.display !== '0') {
      this.display += 'e';
      this.currentInput = this.display;
    }
  }

  public appendRandom(): void {
    const randomValue = Math.random();
    this.display = this.formatResult(randomValue);
    this.currentInput = this.display;
    this.isNewInput = true;
  }

  // Additional methods for the authentic iOS calculator
  public showHistory(): void {
    // Toggle or show calculation history
    // This could open a modal or toggle a history view
    console.log('Show history clicked');
  }

  // Enhanced scientific functions
  private handleAdvancedFunction(func: string): void {
    const value = parseFloat(this.display);
    let result: number;

    try {
      switch (func) {
        case 'asinh(':
          result = Math.asinh(value);
          break;
        case 'acosh(':
          result = Math.acosh(value);
          break;
        case 'atanh(':
          result = Math.atanh(value);
          break;
        case '10^(':
          result = Math.pow(10, value);
          break;
        case 'nthroot(':
          // This would need two inputs - for now just return sqrt
          result = Math.sqrt(value);
          break;
        default:
          return;
      }

      if (isNaN(result) || !isFinite(result)) {
        this.display = 'Error';
      } else {
        this.display = this.formatResult(result);
      }
      
      this.currentInput = this.display;
      this.isNewInput = true;
    } catch (error) {
      this.display = 'Error';
    }
  }

  // Enhanced append method to handle all function types
  public appendAdvanced(value: string): void {
    if (this.basicOperators.includes(value)) {
      this.handleOperator(value);
    } else if (this.isAdvancedFunction(value)) {
      this.handleAdvancedFunction(value);
    } else if (this.isFunction(value)) {
      this.handleFunction(value);
    } else {
      this.handleNumber(value);
    }
  }

  private isAdvancedFunction(value: string): boolean {
    const advancedFunctions = ['asinh(', 'acosh(', 'atanh(', '10^(', 'nthroot('];
    return advancedFunctions.includes(value);
  }

  // Additional helper methods
  public get operatorSymbol(): string {
    return this.getOperatorSymbol(this.operator);
  }

  public isOperatorActive(op: string): boolean {
    return this.operator === op && this.operatorActive;
  }
}