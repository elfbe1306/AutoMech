const Chapter2 = require("./ChapterFunction/chap2Function");
const Chapter3 = require("./ChapterFunction/chap3Function");
const Chapter4 = require("./ChapterFunction/chap4Function");
const Chapter5 = require("./ChapterFunction/chap5Function");
class MachineCalculatorFactory {
  static getChapter(chapterId) {
    switch(chapterId) {
      case 'Chapter2': return new Chapter2();
      case 'Chapter3': return new Chapter3();
      case 'Chapter4': return new Chapter4();
      case 'Chapter5': return new Chapter5();
    }
  }
}

module.exports = MachineCalculatorFactory