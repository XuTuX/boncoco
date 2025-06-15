// data/questions.ts
import { bonchoQuiz } from "./bonchoQuiz";
import { jindanQuiz } from "./jindanQuiz";
import { modernPhysiology } from "./modernPhysiology";
import { hanbyungrihak } from "./hanbyungrihak";

export const quizByCategory: {
    [major: string]: { [sub: string]: { question: string; answer: string }[] };
} = {
    본초학: bonchoQuiz,
    진단학: jindanQuiz,
    양방생리: modernPhysiology,
    병리학: hanbyungrihak,
};

