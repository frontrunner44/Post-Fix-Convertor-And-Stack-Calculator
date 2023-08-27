const pattern = /(\d+\.\d+|\d+|\+|\-|\*|\^|\/|\(|\))/g;
const operators = ["+", "-", "*", "/", "^"];

$("button").click(function(){
	const equation = document.getElementById('equation').value
	let workingEquation = equation.match(pattern);
	// send workingEquation to the function to convert to new type of equation, then that function calls the function to process and calculate.
	$("#scount").html(postFixConversion(workingEquation));
});

function postFixConversion(postFixThis) {
    let postFixEquation = [];
    let stack = [];
    let step = 1;
    postFixThis.forEach(value => {
        console.log(`Step ${step++} of conversion.`);
        console.log(`Current Value: ${value}`);
        console.log(`Current Stack: ${stack}`);
        console.log(`Current expression: ${postFixEquation}`);
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
        postFixEquation.push(stack.pop());
    }
    $("#expression").html(postFixEquation); // Puts the finished post-fixed expression onto the page.
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
                stack.push(num1**num2);
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