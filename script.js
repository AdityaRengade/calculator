const display = document.getElementById('display');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');
const themeToggle = document.getElementById('themeToggle');

let currentInput = '0';
let prevInput = '';
let operation = null;
let resetScreen = false;

// Update display
function updateDisplay() {
  display.textContent = currentInput;
}

// Handle button clicks
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    
    if (value >= '0' && value <= '9') {
      if (currentInput === '0' || resetScreen) {
        currentInput = value;
        resetScreen = false;
      } else {
        currentInput += value;
      }
    } else if (value === '.') {
      if (!currentInput.includes('.')) {
        currentInput += '.';
      }
    } else if (value === 'C') {
      currentInput = '0';
      prevInput = '';
      operation = null;
    } else if (value === '±') {
      currentInput = (parseFloat(currentInput) * -1).toString();
    } else if (value === '%') {
      currentInput = (parseFloat(currentInput) / 100).toString();
    } else if (['+', '-', '*', '/'].includes(value)) {
      if (operation !== null) calculate();
      prevInput = currentInput;
      operation = value;
      resetScreen = true;
    } else if (value === '=') {
      calculate();
      operation = null;
    }
    
    updateDisplay();
  });
});

// Perform calculation
function calculate() {
  let result;
  const prev = parseFloat(prevInput);
  const current = parseFloat(currentInput);
  
  if (isNaN(prev) || isNaN(current)) return;
  
  switch (operation) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/': result = prev / current; break;
    default: return;
  }
  
  history.textContent = `${prevInput} ${operation} ${currentInput} =`;
  currentInput = result.toString();
  resetScreen = true;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;
  
  if (key >= '0' && key <= '9') {
    const button = document.querySelector(`.btn[data-value="${key}"]`);
    button.click();
  } else if (key === '.') {
    const button = document.querySelector('.btn[data-value="."]');
    button.click();
  } else if (key === 'Escape') {
    const button = document.querySelector('.btn[data-value="C"]');
    button.click();
  } else if (key === 'Enter' || key === '=') {
    const button = document.querySelector('.btn[data-value="="]');
    button.click();
  } else if (['+', '-', '*', '/'].includes(key)) {
    const button = document.querySelector(`.btn[data-value="${key}"]`);
    button.click();
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.setAttribute('data-theme', 
    document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
  themeToggle.textContent = document.body.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
});