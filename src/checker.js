exports.compare = function compare (puzzle_type, date, obj) {
	const solutions = require('./solutions.json');
	if (!solutions.hasOwnProperty(date)) return -1;
	const puzzles = solutions[date];
	if (!puzzles.hasOwnProperty(puzzle_type)) return -1; // use Promises!
	if (puzzle_type.startsWith('quiz')) return puzzles[puzzle_type][obj.index];
	return Tools.deepEquals(puzzles[puzzle_type], obj);
};