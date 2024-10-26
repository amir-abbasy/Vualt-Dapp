
export function isNumeric(value) {
    // Allow empty string as valid input
    if (value === "") return true;
  
    // Regex for numbers and floating-point numbers
    const regex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
    return regex.test(value);
  }


  