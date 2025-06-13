// data/questions.ts
import { bonchoQuiz } from "./bonchoQuiz";
import { jindanQuiz } from "./jindanQuiz";

export const quizByCategory: {
    [major: string]: { [sub: string]: { question: string; answer: string }[] };
} = {
    본초학: bonchoQuiz,
    진단학: jindanQuiz,
};
