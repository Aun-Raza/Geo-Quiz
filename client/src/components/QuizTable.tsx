import * as React from "react";
import { Quiz } from "../interfaces/Quiz";

interface QuizTableProps {
    quizzes: Quiz[];
}

function QuizTable({ quizzes }: QuizTableProps) {
    return (
        <table className="table table-striped table-secondary table-hover">
            <thead>
                <tr>
                    <th scope="col">ObjectId</th>
                    <th scope="col">Title</th>
                    <th scope="col"># of Questions</th>
                    <th scope="col">Owner</th>
                </tr>
            </thead>
            <tbody>
                {quizzes.map((quiz) => {
                    return (
                        <tr key={quiz._id}>
                            <th scope="row">{quiz._id}</th>
                            <td>{quiz.title}</td>
                            <td>{quiz.questions.length}</td>
                            <td>{quiz.owner.username}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default QuizTable;
