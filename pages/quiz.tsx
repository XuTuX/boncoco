import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import QuizCard from "../components/QuizCard";

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
    const router = useRouter();
    const { category, missedOnly } = router.query;

    const missedList = (router.query.missed as string)
        ?.split(",")
        .map(Number)
        .filter((n) => !isNaN(n)) || [];

    const allQuizData =
        category === "all"
            ? Object.values(quizByCategory).flat()
            : category && typeof category === "string"
                ? quizByCategory[category] || []
                : [];

    const [quizData, setQuizData] = useState<{ question: string; answer: string }[]>([]);
    const [modeSelected, setModeSelected] = useState(false); // ✅
    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [missed, setMissed] = useState<number[]>([]);

    const total = quizData.length;
    const progressPercent = Math.round(((current + 1) / total) * 100);

    useEffect(() => {
        if (!allQuizData.length && category) {
            alert("해당 카테고리에 데이터가 없습니다.");
            router.push("/");
        }
    }, [category, allQuizData]);

    const handleModeSelect = (mode: "random" | "ordered") => {
        const selectedData =
            missedOnly === "true"
                ? missedList.map((i) => allQuizData[i]).filter(Boolean)
                : allQuizData;

        const finalData = mode === "random" ? shuffleArray(selectedData) : selectedData;
        setQuizData(finalData);
        setModeSelected(true);
    };

    const handleKnow = () => {
        setShowAnswer(false);
        if (current + 1 < total) {
            setCurrent(current + 1);
        } else {
            if (missed.length === 0) {
                router.push("/");
            } else {
                const baseQuery = {
                    category,
                    missed: missed.join(","),
                };
                router.push({ pathname: "/review", query: baseQuery });
            }
        }
    };

    const handleDontKnow = () => {
        setMissed([...missed, current]);
        handleKnow();
    };

    if (!modeSelected) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4">
                <h1 className="text-2xl font-bold mb-8">문제 풀기 모드 선택</h1>
                <div className="space-y-4 w-full max-w-xs">
                    <button
                        onClick={() => handleModeSelect("ordered")}
                        className="w-full py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        순서대로 풀기
                    </button>
                    <button
                        onClick={() => handleModeSelect("random")}
                        className="w-full py-3 bg-pink-500 rounded-lg font-semibold hover:bg-pink-600 transition"
                    >
                        랜덤으로 풀기
                    </button>
                </div>
            </div>
        );
    }

    if (!quizData.length) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                        문제 {current + 1} / {total}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <QuizCard
                    question={quizData[current].question}
                    answer={quizData[current].answer}
                    showAnswer={showAnswer}
                />

                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                        정답 보기
                    </button>
                ) : (
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleKnow}
                            className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                        >
                            안다
                        </button>
                        <button
                            onClick={handleDontKnow}
                            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                        >
                            모른다
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
