exports.compare = function compare (puzzleType, date, obj) {
	return new Promise((resolve, reject) => {
		const solutions = require('./solutions.json');
		if (!solutions.hasOwnProperty(date)) return reject(new Error('No date in the puzzle.'));
		const puzzles = solutions[date];
		if (!puzzles.hasOwnProperty(puzzleType)) return reject(new Error('Puzzle without a type... sus'));
		if (puzzleType.startsWith('quiz')) return resolve(puzzles[puzzleType][obj.index]);
		resolve(Tools.deepEquals(puzzles[puzzleType], obj));
	});
};

exports.checkLiveQuiz = function check (answer, solutions, questionType, basePoints, timeLeft) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(solutions)) solutions = [solutions];
		else if (solutions.length < 1) throw new Error('Did not have the answer to this...');
		if (typeof solutions[0] === 'number') answer = parseInt(answer);
		if (typeof solutions[0] !== typeof answer) throw new TypeError('Type mismatch between answer and solution');
		const finalPoints = Math.max(...solutions.map(solution => {
			// Unfortunately, we can't use a direct .find here, because
			// that will terminate on a partial correct even if there's a
			// later-occurring perfectly accurate solution.
			let points = 0;
			switch (basePoints) {
				case 10: {
					if (timeLeft >= 27) points = 10;
					else if (timeLeft >= 19) points = timeLeft - 17;
					else points = 1;
					break;
				}
				case 5: {
					if (timeLeft >= 12) points = 5;
					else if (timeLeft >= 5) points = Math.floor(timeLeft / 2) - 1;
					else points = 1;
					break;
				}
				case 3: default: {
					if (timeLeft >= 9) points = 3;
					else if (timeLeft >= 3) points = Math.floor(timeLeft / 3);
					else points = 1;
					break;
				}
			}
			// points based on the accuracy of the answer
			switch (questionType) {
				case 'mcq': {
					if (answer !== solution) points = 0;
					break;
				}
				case 'text': {
					if (Tools.levenshtein(Tools.toID(answer), Tools.toID(solution)) > 5) points = 0;
					break;
				}
				case 'number': {
					if (answer !== solution) points = 0;
					break;
				}
				default: {
					if (answer !== solution) points = 0;
				}
			}
			return points;
		}));
		return resolve({ points: finalPoints, timeLeft });
	});
};
