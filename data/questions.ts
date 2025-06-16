// data/questions.ts
import { bonchoQuiz } from "./bonchoQuiz";
import { jindanQuiz } from "./jindanQuiz";
import { modernPhysiology } from "./modernPhysiology";
import { hanbyungrihak } from "./hanbyungrihak";
import { sanghan } from "./sanghan";
import { sanghanQuiz } from "./sanghanQuiz";

export const quizByCategory: {
    [major: string]: { [sub: string]: { question: string; answer: string }[] };
} = {
    본초학: bonchoQuiz,
    진단학: jindanQuiz,
    양방생리: modernPhysiology,
    병리학: hanbyungrihak,
    상한: sanghan,
    상한_객관식_주관식: sanghanQuiz
};

