exports.compare = function compare (puzzle_type, date, obj) {
	const tools = require('./tools.js');
	const solutions = require('./solutions.json');
	if (!solutions.hasOwnProperty(puzzle_type)) return -1;
	const puzzles = solutions[puzzle_type];
	if (!puzzles.hasOwnProperty(date)) return -1;
	return tools.deepEquals(puzzles[date], obj);
};