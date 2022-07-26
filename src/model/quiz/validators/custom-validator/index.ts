import { ObjectId } from "mongoose";
import { UserModel } from "../../../user/model.user";
import { isIncluded } from "../schema-validator";

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

export async function isUser(id: ObjectId) {
    const user = await UserModel.findById(id);
    if (!user) return Promise.reject();
    else return Promise.resolve();
}
