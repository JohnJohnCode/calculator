// VARIABLES

const display = document.querySelector(".disText");
const disHistory = document.querySelector(".disHistory");
const numbers = document.querySelectorAll(".number");
const clearBtn = document.querySelector(".clear");
const operands = document.querySelectorAll(".operand");
const equals = document.querySelector(".equals");
const deleteBtn = document.querySelector(".delete");
const float = document.querySelector(".float");
const start = "..."
let floatCheck = false;
let error = false;
let isFirst = true;
let number1 = null;
let number2 = null;
let disOperand = "";


// FUNCTIONS

function add(a,b) {
    return (parseFloat(a) + parseFloat(b));
}

function subtract(a,b) {
    return parseFloat(a) - parseFloat(b);
}

function multiply(a,b) {
    return parseFloat(a) * parseFloat(b);
}

function divide(a,b) {
    return parseFloat(a) / parseFloat(b);
}

function operate(operator, a, b) {
    if (operator == "+") {
        return add(a,b);
    } else if (operator == "-") {
        return subtract(a,b);
    } else if (operator == "×") {
        return multiply(a,b);
    } else if (operator == "÷") {
        return divide(a,b);
    } else {
        return "OPERATOR ERROR";
    }
}

function updateHistory(number, operand) {
    // Updates math history with latest actions
    disHistory.textContent = disHistory.textContent + " " + number + " " + operand + " ";
    if (disHistory.textContent.length >= 34) {
        // Handle history overflow
        disHistory.textContent = disHistory.textContent.slice((disHistory.textContent.length - 33), disHistory.textContent.length);
        disHistory.textContent = start.concat("", disHistory.textContent);
    }
}

function clear() {
    // Clears display and resets variables
    display.textContent = "";
    disHistory.textContent = "";
    number1 = null;
    number2 = null;
    operand = "";
    isFirst = true;
    error = false;
    floatCheck = false;
}


// EVENT LISTENERS

numbers.forEach((number) => {
    // Numbers
    number.addEventListener("click", () => {
        if (error == true) {
            // If there was an error, clear everything
            clear();
        } else if (display.textContent.slice(0,1) == "0" && display.textContent.length == 1) {
            // If there is a 0 on the display, do not type numbers
        } else if ((display.textContent + number.textContent).length >= 16) {
            // Handle number overflow
        } else if (isFirst == true) {
            // If an operator was not clicked yet, type number but do NOT update variable
            display.textContent = display.textContent + number.textContent;
        } else {
            // If everything is okay and operator was clicked at least once, type number and update variable
            display.textContent = display.textContent + number.textContent;
            number2 = display.textContent;
        }
    })
})


clearBtn.addEventListener("click", () => clear()); // Clear / AC button


operands.forEach((operand) => {
    // Operands
    operand.addEventListener("click", () => {
        if (display.textContent !== "") {
            // If the display is NOT empty do this
            if (display.textContent == "-") {
                // If there is only a minus on the display, do not execute / type operands
            } else if (error == true) {
                // If there was an error, clear everything
                clear();
            } else if (display.textContent.slice(-1) == ".") {
                // If the number ends with a float, do not execute / type operands
            } else if (isFirst == true) {
                // If this is the first time that an operand was pressed, update variables, history and clear the display
                number1 = display.textContent;
                disOperand = operand.textContent;
                updateHistory(number1, disOperand);
                display.textContent = ""
                isFirst = false;
                floatCheck = false;
            } else {
                // Else update variables and history, do math and clear the display
                number2 = display.textContent;
                number1 = operate(disOperand, number1, number2);
                disOperand = operand.textContent;
                updateHistory(number2, disOperand);
                number2 = null;
                display.textContent = "";   
                floatCheck = false;                 
            }
        } else {
            if (operand.className.includes("minus") == true) {
                // If the display is empty and user pressed minus, type it
                display.textContent = operand.textContent;
            }
        }
    })
})


equals.addEventListener("click", () => {
    // Equals
    if (isFirst == false) {
        // If the user clicked an operand at least once
        if (number1 !== null && number2 !== null) {
            // If number 1 and number 2 exist
            if (operate(disOperand, number1, number2).toString().length >= 16) {
                // Handle result overflow
                display.textContent = "ERROR: RESULT TOO BIG";
                disHistory.textContent = "";
                error = true;
            } else if (number1 == "0" && number2 == "0" && disOperand == "÷") {
                // Handle 0 ÷ 0 division
                display.textContent = "MATH ERROR"
                disHistory.textContent = "";
                error = true;
            } else if (error == true) {
                // If there was an error, clear everything
                    clear();
            } else if (display.textContent.slice(-1) == ".") {
                // If the number ends with a float, do nothing
            } else if (operate(disOperand, number1, number2) % 1 !== 0) {
                // If the result is a float, round it
                disHistory.textContent = "";
                display.textContent = Math.round((operate(disOperand, number1, number2) + 0.00001) * 1000) / 1000;
                number2 = null;
                isFirst = true;
                floatCheck = true;
            } else {
                // If everything is okay, do math, reset variables and history and show result
                disHistory.textContent = "";
                display.textContent = operate(disOperand, number1, number2);
                number2 = null;
                isFirst = true;
                floatCheck = false;
            }
        }
    }
})


deleteBtn.addEventListener("click", () => {
    // Delete
    if (error == true) {
        // If there was an error, clear everything
        clear();
    } else if (display.textContent.length != 0) {
        // If there is at least one character on the display
        if (display.textContent.slice(-1) == ".") {
            // If a float got deleted, enable it again
            display.textContent = display.textContent.slice(0,-1);
            floatCheck = false;
        } else {
            // Delete last character
            display.textContent = display.textContent.slice(0,-1);
        }
    }
})


float.addEventListener("click", () => {
    // Decimal / float
    if (error == true) {
        // If there was an error, clear everything
        clear();
    } else if (floatCheck == false && display.textContent.length != 0) {
        // If floats are enabled and there is at least one character on the screen
        if (display.textContent.length == 1 && display.textContent[0] == "-") {
            // If that one character is a minus, do not type float;
        } else {
            // Else type float and disable it
            display.textContent = display.textContent + float.textContent;
            floatCheck = true;
        }
    }
})