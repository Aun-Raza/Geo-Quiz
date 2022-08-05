import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import QuizTable from "./components/QuizTable";
import QuizService from "./services/quizzes";
import { Quiz } from "./interfaces/Quiz";
import "./App.css";

function App() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        getQuizzes();
    }, []);

    async function getQuizzes() {
        const quizzesRes = await QuizService.getQuizzes();
        setQuizzes(quizzesRes);
    }

    return (
        <div className="container">
            <NavBar />
            <h2 className="m-2">Quiz Table</h2>
            <QuizTable quizzes={quizzes} />
        </div>
    );
}

export default App;
