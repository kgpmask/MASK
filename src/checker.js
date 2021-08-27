exports.compare = function compare (puzzle_type, date, obj) {
    const tools = require('./tools.js');
    const solutions = require('./solutions.json');
    
    if (!solutions.hasOwnProperty(puzzle_type)) return -1;
    console.log("Puzzle found");
    const puzzles = solutions[puzzle_type];
    if (!puzzles.hasOwnProperty(date)) return -1;
    console.log("Date found");

    console.log(puzzles[date]);
    console.log(obj);

    return tools.deepEquals(puzzles[date], obj);
};