const chap2Function = require("./ChapterFunction/chap2Function");
const chap3Function = require("./ChapterFunction/chap3Function");

const MachineCalculatorFactory = (type) => {
  if(type === "Chapter2") {
    return chap2Function;
  } else if(type === "Chapter3") {
    return chap3Function
  } else {
    throw new Error("Invalid Calculator Type");
  }
}

module.exports = MachineCalculatorFactory