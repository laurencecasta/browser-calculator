let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;

let operate = (operator, a, b) => operator(a, b);

const calculator = {
  displayValue: '0',
  first: null,
  waitingForNext: false,
  operator: null,
};

function updateDisplay() {
  const display = document.querySelector('#display');
  display.textContent = calculator.displayValue;
}
updateDisplay()

function erase () {
  if (calculator.waitingForNext) return;
  const {displayValue} = calculator;
  if (displayValue.length == 1) {
    calculator.displayValue = '0';
  } else {
    calculator.displayValue = displayValue.slice(0, displayValue.length - 1);
  }
  console.log(calculator);
}

function inputDigit(digit) {
  const {displayValue, waitingForNext} = calculator;
  const displayContainer = document.getElementsByClassName('display-container');
  const display = document.querySelector('h1');

  if (displayContainer[0].clientWidth - display.clientWidth <= '40') {
    return;
  }
  
  if (calculator.displayValue.length > 0 && calculator.displayValue % 3 == 0) {

  }
  if (waitingForNext === true) {
    calculator.displayValue = digit;
    calculator.waitingForNext = false;
  } else {
    calculator.displayValue = (displayValue === '0') ? digit :
    displayValue + digit;
  }
  console.log(calculator);
}

function inputDecimal(dot) {
  if (calculator.waitingForNext === true) return;
  
  // If the `displayValue` does not contain a decimal point
  if (!calculator.displayValue.includes(dot)) {
    // Append the decimal point
    calculator.displayValue += dot;
  }
  console.log(calculator);
}

function handleOperator(nextOperator) {
  const { first, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForNext)  {
    calculator.operator = nextOperator;
    console.log(calculator);
    return;
  }

  if (first === null) {
    calculator.first = inputValue;
  } else if (operator) {
    const currentValue = first || 0;
    const result = operate(operator, currentValue, inputValue);

    if (result == NaN || result == Infinity) {
      calculator.displayValue = 'Error!';
      calculator.first = null;
    } else {
      calculator.displayValue = roundAnswer(result);
      calculator.first = result;
    }
  }

  calculator.waitingForNext = true;
  calculator.operator = nextOperator;
  console.log(calculator);
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.first = null;
  calculator.waitingForNext = false;
  calculator.operator = null;
  console.log(calculator);
}

function roundAnswer (ans) {
  return (ans < 10 && ans.toString().length >= 9) ? ans.toFixed(7).toString() :
    ans.toString().split('').slice(0, 9).join('');
}

const btns = document.querySelectorAll('button');
const btnsArr = Array.from(btns);  
const opsArr = btnsArr.filter(btn => !(btn.textContent.charCodeAt(0) >= 46 && btn.textContent.charCodeAt(0) <= 57));
const numsArr = btnsArr.filter(btn => (btn.textContent.charCodeAt(0) >= 46 && btn.textContent.charCodeAt(0) <= 57))
                       .sort((a, b) => (a.textContent > b.textContent) ? 1 : -1);

numsArr.forEach(num => {
  num.addEventListener('click', () => {
    if (num.textContent == '.') {
      inputDecimal(num.textContent);
    } else {
      inputDigit(num.textContent);
    }
    updateDisplay();
  });
});

opsArr.forEach(op => {
  op.addEventListener('click', () => {
    if (op.classList == 'clear') {
      resetCalculator();
      updateDisplay();
    } else if (op.classList == 'back') {
      erase();
      updateDisplay();
    } else if (op.classList == 'add') {
      handleOperator(add);
      updateDisplay();
    } else if (op.classList == 'subtract') {
      handleOperator(subtract);
      updateDisplay();
    } else if (op.classList == 'multiply') {
      handleOperator(multiply);
      updateDisplay();
    } else if (op.classList == 'divide') {
      handleOperator(divide);
      updateDisplay();
    } else if(op.classList == 'equals') {
      handleOperator(calculator.operator);
      updateDisplay();
    }
  });
});

// Add keyboard support

function matchNumToButton (button, key) {
  if (button.textContent.charCodeAt(0) == key.charCodeAt(0)) {
    button.classList.add('pressed');
    console.log('time');
  }
  
  if (button.classList == 'back' && key == 'Backspace') {
    button.classList.add('pressed');
  } else if (button.classList == 'equals' && key == 'Enter') {
    button.classList.add('opPressed');
  } else if (button.classList == 'add' && key == '+') {
    button.classList.add('opPressed');
  } else if (button.classList == 'subtract' && key == '-') {
    button.classList.add('opPressed');
  } else if (button.classList == 'multiply' && key == ('*' || 'x')) {
    button.classList.add('opPressed');
  } else if (button.classList == 'divide' && key == '/') {
    button.classList.add('opPressed');
  }
} 

window.addEventListener('keydown', (e) => {
  btnsArr.forEach(btn => matchNumToButton(btn, e.key));

  if (e.key >= '.' && e.key <= '9' && e.key != '/') {
    if (e.key == '.') {
      inputDecimal(e.key);
    } else {
      inputDigit(e.key);
    }
    updateDisplay();
  }

  if (e.which == '8') {
    erase();
    updateDisplay();
  }

  switch (e.key) {
    case '+':
      handleOperator(add);
      updateDisplay();
      break;
    case '-':
      handleOperator(subtract);
      updateDisplay();
      break;
    case '*' || 'x':
      handleOperator(multiply);
      updateDisplay();
      break;
    case '/':
      handleOperator(divide);
      updateDisplay();
      break;
    case 'Enter':
      handleOperator(calculator.operator);
      updateDisplay();
    default:
      break;
  }
  console.log(e.key);

});

window.addEventListener('keyup', (e) => {
  let classes = ['pressed', 'opPressed'];
  btnsArr.forEach(btn => btn.classList.remove(...classes));
})

window.addEventListener('touchend', (e) => {
  let classes = ['pressed', 'opPressed'];
  btnsArr.forEach(btn => btn.classList.remove(...classes));
})