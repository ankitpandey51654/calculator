let btnDelete = document.getElementById("delete");
let btnClear = document.getElementById("clear");
let operator = document.querySelectorAll("[data-op]");
let numbers = document.querySelectorAll("[data-num]");
let currentOperand = document.getElementById("currentOperand");
let previousOperand = document.getElementById("previousOperand");
let equal = document.getElementById("equals");

document.addEventListener("keydown", (event) => {
  if (event.key == "Escape") {
    currentOperand.innerText = "0";
    previousOperand.innerText = "";
  } else if (event.key == "Backspace") {
    deletebtn();
  } else if (event.key === "=" || event.key === "Enter") {
    calculate(); // keyboard se bhi calculation chalega
  }
});

btnDelete.addEventListener("click", () => {
  deletebtn();
});

function deletebtn(num) {
  let currentData = currentOperand.innerText;
  if (currentData.length > 1) {
    currentOperand.innerText = currentData.slice(0, -1);
  } else {
    currentOperand.innerText = "0";
  }
}
btnClear.addEventListener("click", () => {
  currentOperand.innerText = "0";
  previousOperand.innerText = "";
});

let shouldReset = false; // flag banaya

numbers.forEach((num) => {
  num.addEventListener("click", () => {
    let value = num.innerText;

    if (shouldReset) {
      currentOperand.innerText = ""; // naya number overwrite karega
      shouldReset = false;
    }

    // agar dot hai aur already ek dot present hai to return kar do
    if (value === "." && currentOperand.innerText.includes(".")) {
      return;
    }

    if (currentOperand.innerText === "0" && value !== ".") {
      currentOperand.innerText = "";
    }

    currentOperand.innerText += value;
  });
});

operator.forEach((opr) => {
  opr.addEventListener("click", () => {
    let currentData = currentOperand.innerText;
    let op = opr.innerText;
    console.log("currentData:", currentData, "operator:", op);

    // console.log("currentdata:", currentData);
    previousOperand.innerText = currentData + " " + op;
    // currentOperand.innerText = currentData[currentData.length - 1];
    shouldReset = true;
  });
});

// = button click se bhi
equal.addEventListener("click", calculate);

// Keyboard support (Escape, Backspace, Enter/=)
document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k === "Escape") {
    currentOperand.innerText = "0";
    previousOperand.innerText = "";
  } else if (k === "Backspace") {
    deletebtn();
  } else if (k === "=" || k === "Enter" || e.code === "NumpadEnter") {
    // Kabhi default focus/behavior hota hai, isliye prevent karein
    e.preventDefault();
    calculate();
  }
});

function calculate() {
  // e.g. previous: "8 +"
  const prevData = previousOperand.innerText.trim();
  const currentData = currentOperand.innerText.trim();

  if (!prevData || currentData === "") return;

  // Robust split: number aur operator alag nikal jayenge
  const [firstStr, op] = prevData.split(/\s+/);
  const a = parseFloat(firstStr);
  const b = parseFloat(currentData);

  let result;

  switch (op) {
    case "+":
      result = a + b;
      break;

    case "−": // Unicode minus (U+2212)
    case "-":
      result = a - b;
      break;

    case "×":
    case "*":
      result = a * b;
      break;

    case "÷":
    case "/":
      result = b !== 0 ? a / b : "Error";
      break;

    case "%":
      result = a % b;
      break;

    default:
      return; // unknown operator
  }

  currentOperand.innerText = result;
  previousOperand.innerText = "";
  shouldReset = true; // next number type karte hi overwrite ho
}
document.addEventListener("keydown", (e) => {
  const k = e.key;

  // 1. Clear
  if (k === "Escape") {
    currentOperand.innerText = "0";
    previousOperand.innerText = "";
    return;
  }

  // 2. Delete
  if (k === "Backspace") {
    deletebtn();
    return;
  }

  // 3. Calculate
  if (k === "=" || k === "Enter" || e.code === "NumpadEnter") {
    e.preventDefault();
    calculate();
    return;
  }

  // 4. Numbers and dot
  if ((k >= "0" && k <= "9") || k === ".") {
    if (shouldReset) {
      currentOperand.innerText = "";
      shouldReset = false;
    }
    if (k === "." && currentOperand.innerText.includes(".")) return;

    if (currentOperand.innerText === "0" && k !== ".") {
      currentOperand.innerText = "";
    }

    currentOperand.innerText += k;
    return;
  }

  // 5. Operators
  if (["+", "-", "*", "/", "%"].includes(k)) {
    let currentData = currentOperand.innerText;
    let op = k;

    previousOperand.innerText = currentData + " " + op;
    shouldReset = true;
    return;
  }
});
