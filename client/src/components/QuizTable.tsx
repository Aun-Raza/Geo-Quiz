import * as React from "react";
import { Quiz } from "../interfaces/Quiz";
import Table from "./common/Table";

interface QuizTableProps {
    quizzes: Quiz[];
}

function QuizTable({ quizzes }: QuizTableProps) {
    const data = {
        columns: ["_id", "title", "# of questions", "owner"],
        rows: quizzes.map(({ _id, title, questions, owner }) => {
            return {
                _id,
                title,
                questions: questions.length,
                owner: owner.username,
            };
        }),
    };

    return <Table data={data} />;
}

export default QuizTable;
