// data/questions.ts
// bonchoQuiz 대신 bonchoProcessedCategories를 import 합니다.
import { bonchoProcessedCategories } from "./bonchoQuiz"; // 이 줄은 그대로 둡니다.
// import { bonchoQuiz } from "./bonchoQuiz";  <-- 이 줄은 이제 필요 없으니 삭제합니다.

import { jindanQuiz } from "./jindanQuiz";
import { modernPhysiology } from "./modernPhysiology";
import { hanbyungrihak } from "./hanbyungrihak";
import { sanghan } from "./sanghan";
import { sanghanQuiz } from "./sanghanQuiz";
import { moderntest } from "./moderntest";
import { bonconum } from "./bonconum";
import { anatomtest } from "./anatomtest";
import { acupunctureQuiz } from "./acupunctureQuiz";
import { immunologyFinals } from "./immunologyFinals";




export const quizByCategory: {
    [major: string]: { [sub: string]: { question: string; answer: string }[] };
} = {
    // 여기가 중요합니다!
    // '본초학' 이라는 키 아래에 bonchoProcessedCategories 전체를 값으로 할당합니다.
    본초학: bonchoProcessedCategories, // <--- 이 부분이 수정됨!

    진단학: jindanQuiz,
    양방생리: modernPhysiology,
    병리학: hanbyungrihak,
    상한: sanghan,
    상한_객관식_주관식: sanghanQuiz,
    양방생리_기출만: moderntest,
    본초_객관식: bonconum,
    해부_단답: anatomtest,
    경혈: acupunctureQuiz,
    면역: immunologyFinals

};