
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

  return {
    Z1,
    Z2,
  }
}

const machineCalculator = Chap3Calculator();
module.exports = machineCalculator;