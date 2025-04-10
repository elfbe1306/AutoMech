const Chapter2 = require("./ChapterFunction/chap2Function");
const Chapter3 = require("./ChapterFunction/chap3Function");

class MachineCalculatorFactory {
  static getChapter(chapterId) {
    switch(chapterId) {
      case 'Chapter2': return new Chapter2();
      case 'Chapter3': return new Chapter3();
    }
  }
}

module.exports = MachineCalculatorFactory