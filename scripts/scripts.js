const pattern = /(\d+\.\d+|\d+|(?<=\))-|(?<=\D|^)-\d+|\+|\-|\*|\^|\/|\(|\))/g;
const operators = ["+", "-", "*", "/", "^"];
let table = document.getElementById("convert-steps");

$("button").click(function(){
	const equation = document.getElementById('equation').value
	let workingEquation = exponentFix(equation.match(pattern));
	$("#scount").html(postFixConversion(workingEquation));
});

function exponentFix(workingEquation) {
    for(i = 0; i < workingEquation.length; i++) {
        if(workingEquation[i] === "^" && workingEquation[i-1] === ")" && workingEquation[i-2] < 0) {
            workingEquation[i-2] /= -1; // Convert to positive
        }
    }
    return workingEquation;
}

function postFixConversion(postFixThis) {
    let postFixEquation = [];
    let stack = [];
    let step = 0;
    postFixThis.forEach(value => {
      generateTable(value);
        if(operators.includes(value)) { // If the current index is an operator
           while(opEval(value) <= opEval(stack[stack.length-1])) { // If the operator at the top of the stack is equal or higher importance. No need to check if it's empty, because that will return -1.
                if(value !== "^") {
                    postFixEquation.push(stack.pop()); // Push the top of the operator stack to the expression as long as it's not an exponent
                }
            } 
            stack.push(value);
        } else if(!isNaN(parseFloat(value)) || value === "(") { // If current value is a number or an opening parenthesis, push to the corresponding stack/array.
            if(value === "(") {
                stack.push(value);
            } else {
                postFixEquation.push(value);
            }
        } else if(value === ")") { // If the current value is a closing parenthesis, pop operators from the stack onto the expression until an opening parenthesis is found
            while(stack[stack.length-1] !== "(") {
                postFixEquation.push(stack.pop()); 
                }
            stack.pop();
        }
    });
    while(stack.length >= 1) { // Finish popping any left over operators from the operator stack to the expression.
        generateTable(" ");
        postFixEquation.push(stack.pop());
    }
    $("#expression").html("<b>"+postFixEquation+"</b>"); // Puts the finished post-fixed expression onto the page.
    generateTable(" ");
    postFixEquation.forEach(value => {
        if(operators.includes(value)) {
            runCalc(value);
        } else {
            stack.push(value);
        }
    })
    return stack[0];

    function runCalc(op) {
        let num2 = stack.pop();
        let num1 = stack.pop();
        switch(op) {
            case "^":
                case "^":
                num1 < 0 ? stack.push(-(num1 ** num2)) : stack.push(num1 ** num2);
                break;
            case "*":
                stack.push(num1*num2);
                break;

            case "/":
                if(num2 == 0) {
                    console.log("Division by zero not allowed");
                    return Error;
                }
                stack.push(num1/num2);
                break;

            case "+":
                stack.push(parseFloat(num1)+parseFloat(num2)); // REMEMBER + ON STRINGS WILL CONCAT THEM SO THEY MUST BE CONVERTED
                break;

            case "-":
                stack.push(num1-num2);
                break;
        }

    }

    function generateTable(value) {
      step++;
      let row = table.insertRow(-1);
      let cell1 = row.insertCell(-1);
      let cell2 = row.insertCell(-1);
      let cell3 = row.insertCell(-1);
      let cell4 = row.insertCell(-1);
      cell1.innerHTML = step;
      cell2.innerHTML = value;
      cell3.innerHTML = stack;
      cell4.innerHTML = postFixEquation;
      console.log(`Current Value: ${value}`);
      console.log(`Current Stack: ${stack}`);
      console.log(`Current expression: ${postFixEquation}`);
      console.log(`Step ${step} of conversion.`);
    }

}

function opEval(op) {
    if(op === "+" || op === "-") {
        return 1;
    } else if(op === "*" || op === "/") {
        return 2;
    } else if(op === "^") {
        return 3;
    } else {
        return -1;
    }
}