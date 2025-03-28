const PI = 3.141592653589;

// Factory Pattern
const Chap3Calculator = () => {
  const roundToOdd = (num) => {
    let rounded = Math.round(num);
    return rounded % 2 === 0 ? rounded + 1 : rounded;
  };
  
  const Z1 = (ux) => {
    let result = 29 - 2 * Number(ux);
    return roundToOdd(result);
  };
  
  const Z2 = (ux, z1) => {
    let result = Number(ux) * Number(z1);
    return roundToOdd(result);
  };

  const d1 =(p,d2) => {
    let result = (Number(p)/(Math.sin(PI/d2)));
    return Number(result.toFixed(12));
  }

  //Buoc 1 - Them ham tinh toan


  // Buoc 2 - Tra ham tinh toan để có thể gọi ở route
  return {
    Z1,
    Z2,
    d1,
  }
}

const machineCalculator = Chap3Calculator();
module.exports = machineCalculator;