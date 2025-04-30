const buttons = document.querySelectorAll('.calc-button');
const screen = document.querySelector('.text');

let currentInput = '';
let firstOperand = null;
let operator = null;
let shouldResetScreen = false;

buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

function handleButtonClick(event) {
    const value = event.target.textContent;

    if (value >= '0' && value <= '9' || value === '.') {
        handleNumber(value);
    } else if (['+', '-', '×', '÷'].includes(value)) {
        handleOperator(value);
    } else if (value === '=') {
        handleEquals();
    } else if (value === 'C') {
        clearCalculator();
    } else if (value === '+/-') {
        handlePlusMinus();
    }
}

function handleNumber(value) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }

    if (value === '.' && currentInput.includes('.')) return;

    currentInput += value;
    updateScreen(`${firstOperand ?? ''} ${operator ?? ''} ${currentInput}`.trim());
}

function handleOperator(op) {
    if (currentInput === '') return;

    if (firstOperand !== null && operator !== null) {
        handleEquals(); 
    }

    firstOperand = currentInput;
    operator = op;
    currentInput = '';
    updateScreen(`${firstOperand} ${operator}`);
}

function handleEquals() {
    if (firstOperand === null || operator === null || currentInput === '') return;

    const a = parseFloat(firstOperand);
    const b = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '×':
            result = a * b;
            break;
        case '÷':
            result = b !== 0 ? a / b : 'ERROR';
            break;
        default:
            return;
    }

    if (result !== 'ERROR') {
        result = Math.round(result * 1e6) / 1e6;
    }

    updateScreen(result.toString());
    currentInput = result.toString();
    firstOperand = null;
    operator = null;
    shouldResetScreen = true;
}


function clearCalculator() {
    currentInput = '';
    firstOperand = null;
    operator = null;
    shouldResetScreen = false;
    updateScreen('0');
}

function handlePlusMinus() {
    if (currentInput === '') return; 

    currentInput = (parseFloat(currentInput) * -1).toString(); 
    updateScreen(`${firstOperand ?? ''} ${operator ?? ''} ${currentInput}`.trim()); 
}


function updateScreen(content) {
    screen.textContent = content;

    screen.scrollLeft = screen.scrollWidth;
}

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    const key = event.key;

    if (!isNaN(key) || key === '.') {
        handleNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        const symbolMap = {
            '*': '×',
            '/': '÷'
        };
        handleOperator(symbolMap[key] || key);
    } else if (key === 'Enter' || key === '=') {
        handleEquals();
    } else if (key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        updateScreen(`${firstOperand ?? ''} ${operator ?? ''} ${currentInput}`.trim());
    } else if (key.toLowerCase() === 'c') {
        clearCalculator();
    } else if (key === 'p') {
        handlePlusMinus();
    }
}
