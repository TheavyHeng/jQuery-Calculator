// Define a variable to hold the calculator's input and output
let input = [];

// Define the display and history elements
const display = $('.display');
const history = $('.history');
display.text('0');
history.text('');

// Define functions for each of the calculator's operations
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) {
    throw new Error('Error');
  }
  return a / b;
}

// Define a function to clear the calculator's input and output
function clear() {
  input = [];
  display.text('0');
  history.text(''); // clear the calculation history
}

// Define a function to delete the last character of the calculator's input
function backspace() {
  display.text(display.text().slice(0, -1));// Remove the last character from the display text
  if (display.text() === '') {
    display.text('0');
  }
}

// Define a function to change the sign of the displayed number
function changeSign() {
  // If the display starts with a negative sign, remove it
  if (display.text().substring(0, 1) == "-")
    display.text(display.text().substring(1, display.text().length))
  // Otherwise, add a negative sign to the display
  else
    display.text("-" + display.text());
}

// Define a function to format a number with comma separators
function formatNumber(num) {
  return num.toLocaleString(undefined, { maximumFractionDigits: 12 });
}

// Define a function to evaluate the calculator's input and output
function calculate() {
  let result = Number(input[0]);
  let historyText = input[0]; // initialize the calculation history with the first operand

  for (let i = 1; i < input.length; i += 2) {
    const operator = input[i];
    const operand = Number(input[i + 1]);

    switch (operator) {
      case '+':
        result = add(result, operand);
        break;
      case '-':
        result = subtract(result, operand);
        break;
      case 'x':
        result = multiply(result, operand);
        break;
      case '÷':
        result = divide(result, operand);
        break;
    }

    // update the calculation history with the current operator and operand
    historyText += ` ${operator} ${input[i + 1]}`;
  }

  // Format the result with comma separators and remove trailing zeros
  const formattedResult = formatNumber(result);
  // Display the formatted result on the calculator's display
  display.text(formattedResult);
  // Display the calculation history on the calculator's history element
  history.text(historyText + ' = ' + formattedResult);
}

// Define a function to handle button clicks
function handleButtonClick(buttonValue) {
  try {
    switch (buttonValue) {
      // code for handling arithmetic operators
      case '+':
      case '-':
      case 'x':
      case '÷':
        // If the last item in the input array is an operator, replace it with the new operator
        if (['+', '-', 'x', '÷'].includes(input[input.length - 1])) {
          input[input.length - 1] = buttonValue;
        } else {
          // Check if the last character in the display is a decimal point, and remove it
          const displayText = display.text();
          const lastChar = displayText.charAt(displayText.length - 1);
          if (lastChar === '.') {
            display.text(displayText.slice(0, -1));
          }
          // Push the current display value (without commas) and the operator to the input array
          input.push(display.text().replace(/,/g, ''));
          input.push(buttonValue);
        }
        // Clear the display
        display.text('');
        break;
      case '=':
        // If the last item in the input array is an operator, remove it
        if (['+', '-', 'x', '÷'].includes(input[input.length - 1])) {
          input.pop();
        }
        // Push the current display value (without commas) to the input array and evaluate it
        input.push(display.text().replace(/,/g, ''));
        calculate();
        // Reset the input array
        input = [];
        break;
        case 'C':
          // Clear the calculator's input and output
          clear();
          break;
        case 'DEL':
          // Delete the last character of the calculator's input
          backspace();
          break;
        case '+/-':
          // Change the sign of the displayed number
          changeSign();
          break;
        case '%':
          // Convert the displayed number to a percentage
          display.text(Number(display.text().replace(/,/g, '')) / 100);
          // Format the display with comma separators
          display.text(display.text().toLocaleString('en-US', { maximumFractionDigits: 12 }));
          break;
        case '.':
          // Add a decimal point to the display if it doesn't already have one
          if (display.text() === '') {
            display.text('0.');
          } else if (!display.text().includes('.')) {
            display.text(display.text() + '.');
          }
        break;
      default:
        // If the display value is currently "0" and a digit is pressed, replace the "0" with the digit
        if (
          display.text() === '0' &&
          !['.', '+', '-', 'x', '÷'].includes(input[input.length - 1])
        ) {
          display.text(buttonValue);
        } else {
          // If the display value is less than 12 digits, append the pressed digit to the display
          if (display.text().length < 12) {
            display.text(display.text() + buttonValue);
          }
        }
        // Format the display value with comma separators
        display.text(display.text().replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        break;
    }
  } catch (error){
    // Handle errors by displaying an error message on the calculator display
    display.text(error.message);
 }
}
// Add event listeners to all the calculator buttons
const buttons = $('button');
buttons.on('click', function () {
  handleButtonClick($(this).text());
});

// Define a mapping of keyboard keys to calculator button labels
const keyMap = {
  'Enter': '=',
  '=': '=',
  'Delete': 'C',
  'Backspace': 'DEL',
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '÷',
  '.': '.',
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
};

// Add event listener for keydown events on the document
$(document).on('keydown', function (event) {
  const key = event.key;
  const buttonValue = keyMap[key];

  if (buttonValue) {
    // Handle the button press for the mapped keyboard key
    handleButtonClick(buttonValue);
    // Prevent the default behavior of the key press
    event.preventDefault();
  }
});