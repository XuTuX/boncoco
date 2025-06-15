import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import QuizCard from "../components/QuizCard";

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

type QA = { question: string; answer: string };

type Phase = "select" | "learn" | "done";

export default function QuizPage() {
    const router = useRouter();
    const { category, sub: rawSub, missedOnly } = router.query;

    // ────────────────────────────────────────────
    // 1️⃣  전체 문제 데이터 계산 (다중 sub 지원)
    // ────────────────────────────────────────────
    const allData: QA[] = (() => {
        if (typeof category !== "string" || typeof rawSub !== "string") return [];
        const group = quizByCategory[category];
        if (!group) return [];

        // "all" 또는 콤마로 연결된 여러 sub("진단,본초") 지원
        if (rawSub === "all") return Object.values(group).flat();

        const subs = rawSub.split(",").filter(Boolean);
        const collected = subs.flatMap((s) => group[s] ?? []);
        return collected;
    })();

    // ────────────────────────────────────────────
    // 2️⃣  상태 선언
    // ────────────────────────────────────────────
    const [phase, setPhase] = useState<Phase>("select");
    const [quizData, setQuizData] = useState<QA[]>([]);
    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [wrongSet, setWrongSet] = useState<QA[]>([]);

    // ────────────────────────────────────────────
    // 3️⃣  데이터 없을 시 홈으로
    // ────────────────────────────────────────────
    useEffect(() => {
        if (!allData.length && category && rawSub) {
            alert("해당 카테고리에 데이터가 없습니다.");
            router.push("/");
        }
    }, [category, rawSub, allData]);

    // ────────────────────────────────────────────
    // 4️⃣  모드(순서/랜덤) 선택
    // ────────────────────────────────────────────
    const handleModeSelect = (mode: "ordered" | "random") => {
        const missedIdxList = (router.query.missed as string | undefined)
            ?.split(",")
            .map(Number)
            .filter((n) => !isNaN(n) && n >= 0 && n < allData.length)


        const base: QA[] = missedOnly === "true" && missedIdxList?.length
            ? missedIdxList.map((i) => allData[i])
            : allData;

        const final = mode === "random" ? shuffleArray(base) : base;
        setQuizData(final);
        setPhase("learn");
    };

    // ↓  existing hooks 근처에 추가
    // ────────────────────────────────────────────
    // 4️⃣  모드(순서/랜덤) 선택 : 키보드 지원 추가
    // ────────────────────────────────────────────
    useEffect(() => {
        if (phase !== "select") return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                // 👉 순서대로 풀기
                handleModeSelect("ordered");
            }
            if (e.key === "ArrowLeft") {
                // 👉 랜덤으로 풀기
                handleModeSelect("random");
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [phase, handleModeSelect]);



    // ────────────────────────────────────────────
    // 5️⃣  학습 로직 (알아요/몰라요)
    // ────────────────────────────────────────────
    // 안전하게 quizData 자체를 의존성에 추가
    const know = useCallback(() => {
        setShowAnswer(false);
        if (current + 1 >= quizData.length) {
            setPhase("done");
        } else {
            setCurrent((i) => i + 1);
        }
    }, [current, quizData]);

    const dont = useCallback(() => {
        const item = quizData[current];
        setWrongSet((prev) =>
            prev.some((q) => q.question === item.question) ? prev : [...prev, item]
        );
        know();
    }, [current, quizData, know]);


    // ────────────────────────────────────────────
    // 6️⃣  키보드 단축키
    // ────────────────────────────────────────────
    useEffect(() => {
        if (phase !== "learn") return;
        const onKey = (e: KeyboardEvent) => {
            if (!showAnswer) {
                setShowAnswer(true);
            } else {
                if (e.key === "ArrowRight") know();
                if (e.key === "ArrowLeft") dont();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [phase, showAnswer, know, dont]);

    // ────────────────────────────────────────────
    // 7️⃣  오답만 재도전
    // ────────────────────────────────────────────
    const retryWrongSet = () => {
        if (!wrongSet.length) return;
        setQuizData(shuffleArray(wrongSet));
        setWrongSet([]);
        setCurrent(0);
        setShowAnswer(false);
        setPhase("learn");
    };

    // ────────────────────────────────────────────
    // 8️⃣  홈으로
    // ────────────────────────────────────────────
    const goHome = () => {
        if (typeof category === "string") router.push(`/${encodeURIComponent(category)}`);
        else router.push("/");
    };

    // ────────────────────────────────────────────
    // 9️⃣  화면 렌더
    // ────────────────────────────────────────────
    if (phase === "select") {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4">
                <h1 className="text-2xl font-bold mb-8">문제 풀기 모드 선택</h1>
                <div className="space-y-4 w-full max-w-xs">
                    <button onClick={() => handleModeSelect("ordered")} className="w-full py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition">순서대로 풀기 / 키보드 왼쪽</button>
                    <button onClick={() => handleModeSelect("random")} className="w-full py-3 bg-pink-500 rounded-lg font-semibold hover:bg-pink-600 transition">랜덤으로 풀기 / 키보드 오른쪽 </button>
                </div>
            </div>
        );
    }

    if (phase === "done") {
        const cleared = wrongSet.length === 0;
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-500 to-teal-600 text-white px-4 space-y-8">
                {cleared ? (
                    <>
                        <h1 className="text-3xl font-bold">🎉 잘했어요! 🎉</h1>
                        <p className="text-lg">모든 문제를 완벽하게 풀었어요!</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">📋 오답 노트</h1>
                        <ul className="bg-white/10 rounded-xl p-6 space-y-2 max-w-xl w-full text-left overflow-y-auto max-h-[60vh]">
                            {wrongSet.map((q, idx) => (<li key={idx} className="text-white/90 space-y-1">
                                <div className="font-semibold">Q. {q.question}</div>
                                <div className="text-green-300">A. {q.answer}</div>
                            </li>))}
                        </ul>
                        <button onClick={retryWrongSet} className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition">오답만 다시 풀기</button>
                    </>
                )}
                <button onClick={goHome} className="px-6 py-3 bg-white text-green-700 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">홈으로 돌아가기</button>
            </div>
        );
    }

    // 학습 단계 UI
    const total = quizData.length;
    const progressPercent = Math.round(((current + 1) / total) * 100);
    const qa = quizData[current];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-2">문제 {current + 1} / {total}</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <QuizCard question={qa.question} answer={qa.answer} showAnswer={showAnswer} />
                {!showAnswer ? (
                    <button onClick={() => setShowAnswer(true)} className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">정답 보기</button>
                ) : (
                    <div className="mt-6 flex gap-4">
                        <button onClick={dont} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300">모른다</button>
                        <button onClick={know} className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300">안다</button>
                    </div>
                )}
            </div>
        </div>
    );
}
