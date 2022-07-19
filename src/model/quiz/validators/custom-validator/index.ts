import { isIncluded } from '../schema-validator';

export function isMCValid(
	array: { answers: string[]; correctAnswer: string }[]
) {
	let bool = true;
	array.forEach((question: { answers: string[]; correctAnswer: string }) => {
		if (!isIncluded(question.correctAnswer, question.answers)) {
			bool = false;
		}
	});

	return bool;
}
