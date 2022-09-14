exports.compare = function compare (puzzleType, date, obj) {
	return new Promise((resolve, reject) => {
		const solutions = require('./solutions.json');
		if (!solutions.hasOwnProperty(date)) throw reject("No date in the puzzle.");
		const puzzles = solutions[date];
		if (!puzzles.hasOwnProperty(puzzleType)) throw reject("Puzzle without a type... sus");
		if (puzzleType.startsWith('quiz')) return resolve(puzzles[puzzleType][obj.index]);
		resolve(Tools.deepEquals(puzzles[puzzleType], obj));
	});
};
