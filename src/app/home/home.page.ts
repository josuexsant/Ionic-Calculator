import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  display: string = '0';
  private currentInput: string = '';
  private calculationResult: string = ''; // Renamed to avoid conflict
  private operator: string = '';
  private previousInput: string = '';
  private isNewInput: boolean = true;
  private readonly operators: string[] = ['+', '-', '*', '/'];
  
  constructor() {}

  public clear(): void {
    this.display = '0';
    this.currentInput = '';
    this.calculationResult = '';
    this.operator = '';
    this.previousInput = '';
    this.isNewInput = true;
  }

  public backspace(): void {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
    }
    this.currentInput = this.display;
  }

  public append(value: string): void {
    // Check if the value is an operator
    if (this.operators.includes(value)) {
      this.handleOperator(value);
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
  }

  private handleOperator(op: string): void {
    if (this.operator && !this.isNewInput) {
      // If there's a pending operation, calculate it first
      this.calculate();
    }
    
    this.operator = op;
    this.previousInput = this.currentInput || this.display;
    this.isNewInput = true;
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

    // Handle decimal places and display formatting
    this.calculationResult = result.toString();
    this.display = this.formatResult(result);
    this.currentInput = this.display;
    this.operator = '';
    this.previousInput = '';
    this.isNewInput = true;
  }

  private formatResult(result: number): string {
    // Format the result to avoid very long decimal numbers
    if (result % 1 === 0) {
      // It's a whole number
      return result.toString();
    } else {
      // It's a decimal, limit to reasonable precision
      return parseFloat(result.toFixed(8)).toString();
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

  // Getter for the current display value
  public get currentDisplay(): string {
    return this.display;
  }
}