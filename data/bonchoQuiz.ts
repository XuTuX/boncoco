// data/bonchoQuiz.ts

type QA = { question: string; answer: string };
type RawBonchoQuizSchema = { [key: string]: QA[] };

// 1. 기존 bonchoQuiz 데이터를 rawBonchoQuizData라는 이름으로 정의합니다.
const rawBonchoQuizData: RawBonchoQuizSchema = {
    청열해독약: [
        { "question": "황화지정(黃花地丁) 이명", "answer": "포공영" },
        { "question": "유옹치료에 양호하여 유옹초기에 홍종견경하고 농종이 아직 성숙하지 않은 경우를 치료", "answer": "포공영" },
        { "question": "기원이 민들레", "answer": "포공영" },
        { "question": "기원이 쪽(교람)", "answer": "청대" },
        { "question": "기원이 숭람 2", "answer": "청대" },
        { "question": "기원이 마람", "answer": "청대" },
        { "question": "소아경간 치료", "answer": "청대" },
        { "question": "기원이 뚝갈", "answer": "패장" },
        { "question": "장옹에 농 유무를 막론하고 필용", "answer": "패장" },
        { "question": "기원이 마타리", "answer": "패장" },
        { "question": "열리, 설사, 적백대하, 목적종통, 목생예막 치료", "answer": "진피" },
        { "question": "기원이 물푸레나무", "answer": "진피" },
        { "question": "기원이 인동덩굴", "answer": "금은화" },
        { "question": "양산풍열 효능으로 연교와 함께 사용하여 풍열감모를 치료", "answer": "금은화" },
        { "question": "초탄 후 열독혈리 치료", "answer": "금은화" },
        { "question": "다량의 noradrenaline 함유약물", "answer": "마치현" },
        { "question": "기원이 쇠비름", "answer": "마치현" },
        { "question": "기원이 숭람 1", "answer": "판람근" },
        { "question": "기원이 딱지꽃", "answer": "위릉채" },
        { "question": "오래된 이질 치료, 치창출혈, 옹종창독 치료, 선품을 도란하여 환부에 도부하는 약", "answer": "위릉채" },
        { "question": "기원이 약모밀", "answer": "어성초" },
        { "question": "폐옹토농, 담열천해 치료", "answer": "어성초" },
        { "question": "기원이 할미꽃", "answer": "백두옹" },
        { "question": "아메바성 이질 치료", "answer": "백두옹" },
        { "question": "청구불렴의 요약", "answer": "백렴" },
        { "question": "기원이 가회톱", "answer": "백렴" },
        { "question": "기원이 절굿대", "answer": "누로" },
        { "question": "기원이 뻐꾹채", "answer": "누로" },
        { "question": "유옹종통, 옹저발배, 유즙불통, 습비구련 치료", "answer": "누로" },
        { "question": "기원이 수염가래꽃", "answer": "반변련" },
        { "question": "대복수종, 면목부종, 옹종정창 치료", "answer": "반변련" },
        { "question": "기원이 백운풀", "answer": "백화사설초" },
        { "question": "기원이 범부체", "answer": "사간" },
        { "question": "기원이 삿갓나물", "answer": "조휴" },
        { "question": "기원이 개나리", "answer": "연교" },
        { "question": "기원이 광엽발계", "answer": "토복령" },
        { "question": "매독 및 수은중독으로 인한 습비구련 치료", "answer": "토복령" },
        { "question": "기원이 청미래덩굴", "answer": "토복령" },
        { "question": "경풍, 전간, 추축, 목적종통, 수명 치료", "answer": "웅담" },
        { "question": "기원이 약난초", "answer": "산자고" },
        { "question": "기원이 숭람 3", "answer": "대청엽" },
        { "question": "기원이 월남괴", "answer": "산두근" },
        { "question": "기원이 제비꽃", "answer": "자화지정" },
        { "question": "옹종창독, 파두 및 부자 중독, 서열번갈 치료", "answer": "녹두" },
    ],
    청허열약: [
        { "question": "기원이 대나물", "answer": "은시호" },
        { "question": "제증에 별혈초하는 약물 2", "answer": "은시호" },
        { "question": "제증에 별혈초하는 약물 1", "answer": "청호" },
        { "question": "학질치료 arteannuin 성분", "answer": "청호" },
        { "question": "기원이 개똥쑥", "answer": "청호" },
        { "question": "부인과 산후 혈허발열 치료", "answer": "백미" },
        { "question": "기원이 구기자나무", "answer": "지골피" },
    ],
    공하약: [
        { "question": "기원이 알로에베라", "answer": "노회" },
        { "question": "소아경풍, 감적, 충적 치료약물", "answer": "노회" },
        { "question": "퐁화하여 현명분으로 제조하는 약", "answer": "망초" },
    ],
    윤하약: [
        { "question": "기원이 이스라지 1", "answer": "욱리인" },
        { "question": "윤조활장, 하기, 이수 효능약물", "answer": "욱리인" },
        { "question": "기원이 장병편도", "answer": "욱리인" },
        { "question": "기원이 삼", "answer": "화마인" },
        { "question": "계속해서 장기간 복용하여서는 안되고, 1차 내복에 60~120g 이상이면 중독증상인 토사, 사지마목 증상이 나타나며, 심하면 혼수상태에 이르는 약", "answer": "화마인" },
    ],
    준하축수약: [
        { "question": "준하적체, 파징가, 축수소종, 활담리인, 살충 효능 약물", "answer": "파두" },
        { "question": "pharbitin 성분", "answer": "견우자" },
        { "question": "파두, 파두상과 같이 사용해서는 안되는 약", "answer": "견우자" },
        { "question": "기원이 나팔꽃", "answer": "견우자" },
        { "question": "기원이 팥꽃나무", "answer": "원화" },
        { "question": "감초와 같이 사용해서는 안되는 약", "answer": "감수" },
        { "question": "기원이 자리공", "answer": "상륙" },
    ],
    거풍습지비통약: [
        { "question": "aconitine 성분 약물", "answer": "초오" },
        { "question": "기원이 놋젓가락나물", "answer": "초오" },
        { "question": "기원이 엄나무", "answer": "해동피" },
        { "question": "풍습비통, 개선 치료약물", "answer": "해동피" },
        { "question": "기원이 가는잎사위질빵", "answer": "위령선" },
        { "question": "기원이 으아리", "answer": "위령선" },
        { "question": "통비, 골경인후 치료약물", "answer": "위령선" },
        { "question": "거풍제습, 화위화탁 효능약물", "answer": "잠사" },
        { "question": "기원이 모청등", "answer": "방기" },
        { "question": "거풍지통, 이수소종 효능약물", "answer": "방기" },
        { "question": "기원이 중치모당귀", "answer": "독활" },
        { "question": "거풍습 지비통 청허열 청습열 효능약물", "answer": "진교" },
        { "question": "strychnine 성분 약물", "answer": "마전자" },
    ],
    서근활락약: [
        { "question": "기원이 마삭줄", "answer": "낙석등" },
        { "question": "거풍통락, 양혈소종 효능으로 후비, 인후종통을 치료하느 약", "answer": "낙석등" },
        { "question": "주증후 거풍습, 보간신, 강근골 효능으로 사용하는 약물", "answer": "희렴초" },
        { "question": "기원이 진득찰", "answer": "희렴초" },
        { "question": "전자하면 효능이 감약되기 때문에 희렴초와 함께 환 산제로 복용하는 약물", "answer": "취오동" },
        { "question": "기원이 누리장나무", "answer": "취오동" },
        { "question": "서근활락 화위화습 효능약물", "answer": "모과" },
    ],
    거풍습강근골약: [
        { "question": "안태 효능 약물", "answer": "상기생" },
        { "question": "오가피의 적응증", "answer": "풍습비통, 요슬연약, 소아행지, 수종각기" },
        { "question": "mistletoe라고 불리며 항암, 암재발예방 약물", "answer": "곡기생" },
        { "question": "기원이 겨우살이", "answer": "곡기생" },
    ],
    방향화습약: [
        { "question": "곽향의 화습화중해서 효능과 유사하므로 대개 상수하여 사용하는 약물", "answer": "패란" },
        { "question": "패란 약용부위", "answer": "전초" },
        { "question": "기원이 벌등골나물", "answer": "패란" },
        { "question": "명목효능 약물", "answer": "창출" },
        { "question": "기원이 만주삽주", "answer": "창출" },
        { "question": "기원이 배초향", "answer": "곽향" },
        { "question": "기원이 녹각사", "answer": "사인" },
        { "question": "안태효능 약물", "answer": "사인" },
        { "question": "구토를 진정시키고 학질한열을 치료하는 약물", "answer": "초과" },
        { "question": "기원이 명자꽃", "answer": "모과" },
    ],
    이수퇴종약: [
        { "question": "기원이 율무", "answer": "의이인" },
        { "question": "수종각기 습비구련, 폐옹장옹, 편평우 치료약물", "answer": "의이인" },
        { "question": "기원이 옥수수", "answer": "옥촉서예" },
        { "question": "기원이 동아호박", "answer": "동과피" },
        { "question": "기원이 팥", "answer": "적소두" },
        { "question": "택사 약용부위", "answer": "塊莖(괴경)" },
        { "question": "열림삽통, 설사수종, 치료약물로 육미지황탕 구성약물", "answer": "택사" },
    ],
    이뇨통림약: [
        { "question": "편축 약용부위", "answer": "전초" },
        { "question": "기원이 마디풀", "answer": "편축" },
        { "question": "등심초 약용부위 1", "answer": "경수" },
        { "question": "영아야제에 탄말하여 유두에 발라 복용시키는 약물", "answer": "등심초" },
        { "question": "기원이 골풀", "answer": "등심초" },
        { "question": "기원이 댑싸리", "answer": "지부자" },
        { "question": "기원이 사철쑥 1", "answer": "인진호" },
        { "question": "기원이 비쑥", "answer": "인진호" },
        { "question": "기원이 도꼬로마 1", "answer": "비해" },
        { "question": "고림, 백탁, 대하 치료약물", "answer": "비해" },
        { "question": "비해 약용부위", "answer": "근경" },
        { "question": "수종창만, 열림삽통, 목적종통 치료약물", "answer": "차전자" },
        { "question": "기원이 질경이", "answer": "차전자" },
        { "question": "구맥 약용부위", "answer": "전초" },
        { "question": "기원이 술패랭이꽃", "answer": "구맥" },
        { "question": "기원이 실고사리", "answer": "해금사" },
        { "question": "해금사 약용부위", "answer": "포자" },
        { "question": "통탈목 약용부위", "answer": "경수" },
        { "question": "기원이 통탈목", "answer": "통초" },
        { "question": "혈림, 페열해수 치료약물", "answer": "석위" },
        { "question": "기원이 과로황", "answer": "금전초" },
        { "question": "기원이 아욱", "answer": "동규자" },
        { "question": "기원이 으름덩굴", "answer": "목통" },
        { "question": "목통 약용부위", "answer": "줄기" },
    ],
    온리약: [
        { "question": "정향 약용부위", "answer": "화뢰" },
        { "question": "기원이 석호", "answer": "오수유" },
        { "question": "궐음두통, 한산복통 치료약물", "answer": "오수유" },
        { "question": "기원이 산계초", "answer": "필징가" },
        { "question": "부자의 독성 성분", "answer": "aconitine" },
        { "question": "부자의 강심효능 성분", "answer": "higenamine" },
        { "question": "기원이 오두", "answer": "부자" },
        { "question": "기원이 산초나무", "answer": "촉초" },
        { "question": "촉초 약용부위", "answer": "과피" },
        { "question": "기원이 초피나무", "answer": "촉초" },
    ],
    리기약: [
        { "question": "기원이 빈랑", "answer": "대복피" },
        { "question": "대복피의 약용 부위", "answer": "과피" },
        { "question": "기원이 감나무", "answer": "시체" },
        { "question": "향부자 약용부위", "answer": "근경" },
        { "question": "기원이 운목향", "answer": "목향" },
        { "question": "위통, 흉협창만을 치료하는 마타리과 약물", "answer": "감송향" },
        { "question": "감송향 약용부위", "answer": "근경" },
        { "question": "기원이 쥐방울 덩굴", "answer": "청목향" },
        { "question": "기원이 산달래", "answer": "해백" },
        { "question": "통양산결, 행기도체 효능으로 흉비동통 담음해천 설리후중 치료", "answer": "해백" },
        { "question": "기원이 염부추", "answer": "해백" },
        { "question": "기원이 목향", "answer": "토목향" },
        { "question": "기원이 해당화", "answer": "매괴화" },
        { "question": "기원이 멀구슬나무", "answer": "천련자" },
    ],
};

// QuizDataEntry는 이 파일에서만 사용되므로 여기에 두는 것이 좋습니다.
type QuizDataEntry = { [subCategory: string]: QA[] }; // { "전체": QA[] } 와 같은 형태

// 3. 원시 데이터를 가공하여 최종 export할 객체
// processedBonchoCategories의 타입도 명시적으로 지정하여 예상치 못한 타입 추론을 방지합니다.
const processedBonchoCategories: QuizDataEntry = {}; // <--- 여기를 수정합니다.

// 3-1. 기존 카테고리들을 서브 카테고리로 직접 배치합니다.
for (const categoryName in rawBonchoQuizData) {
    if (Object.prototype.hasOwnProperty.call(rawBonchoQuizData, categoryName)) {
        processedBonchoCategories[categoryName] = rawBonchoQuizData[categoryName]; // <--- 여기를 수정합니다.
    }
}

// 3-2. "약용부위" 질문들을 추출하고 중복을 방지하여 새로운 서브 카테고리로 추가합니다.
const medicinalPartQuestions: QA[] = [];
const seenMedicinalPartQuestions = new Set<string>(); // 중복 방지를 위한 Set

for (const categoryName in rawBonchoQuizData) {
    if (Object.prototype.hasOwnProperty.call(rawBonchoQuizData, categoryName)) {
        const questions = rawBonchoQuizData[categoryName];
        for (const qa of questions) {
            if (qa.question.includes("약용부위")) {
                if (!seenMedicinalPartQuestions.has(qa.question)) {
                    medicinalPartQuestions.push(qa);
                    seenMedicinalPartQuestions.add(qa.question);
                }
            }
        }
    }
}

// 추출된 "약용부위" 질문들을 "약용부위"라는 새로운 서브 카테고리에 추가합니다.
processedBonchoCategories["약용부위"] = medicinalPartQuestions; // <--- 여기를 수정합니다.

// 4. 가공된 본초학 카테고리 데이터를 export 합니다.
export const bonchoProcessedCategories = processedBonchoCategories;