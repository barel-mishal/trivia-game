import axios from "axios"
import { QuizQuestionReady, QuizResponse } from "../types/types"

export default async function getQuiz() {
    const res = await axios.get<QuizResponse>("https://opentdb.com/api.php?amount=10&category=18");
    return res.status === 200 ? res.data.results.map(getQuestion) : []
}

function getQuestion(question: QuizResponse['results'][number]): QuizQuestionReady {
    return {
        ...question,
        answers: shuffleArray(getAnswers(question)),
        answered: "",
        questionTime: getQuestionTime(question.difficulty),
    }
}
function shuffleArray<T>(array: T[]) {
    return [...array].sort(() => Math.random() - 0.5);
}
function getAnswers(question: QuizResponse['results'][number]) {
    return shuffleArray([...question.incorrect_answers, question.correct_answer])
}
function getQuestionTime(difficulty: string) {
    switch (difficulty) {
        case "easy":
            return 60;
        case "medium":
            return 90;
        case "hard":
            return 120;
        default:
            return 30;
    }
}