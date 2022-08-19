exports.compare = function compare (puzzleType, date, obj) {
	const solutions = require('./solutions.json');
	if (!solutions.hasOwnProperty(date)) return -1;
	const puzzles = solutions[date];
	if (!puzzles.hasOwnProperty(puzzle_type)) return -1; // use Promises!
	if (puzzleType.startsWith('quiz')) return puzzles[puzzleType][obj.index];
	return Tools.deepEquals(puzzles[puzzleType], obj);
};
