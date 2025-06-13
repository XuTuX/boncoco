import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import QuizCard from "../components/QuizCard";

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

    const quizData =
        missedOnly === "true"
            ? missedList.map((i) => allQuizData[i]).filter(Boolean)
            : allQuizData;

    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [missed, setMissed] = useState<number[]>([]);

    const total = quizData.length;
    const progressPercent = Math.round(((current + 1) / total) * 100);

    useEffect(() => {
        if (!quizData.length && category) {
            alert("해당 카테고리에 데이터가 없습니다.");
            router.push("/");
        }
    }, [category, quizData]);

    const handleKnow = () => {
        setShowAnswer(false);
        if (current + 1 < total) {
            setCurrent(current + 1);
        } else {
            // 모든 문제를 푼 경우
            if (missed.length === 0) {
                router.push("/"); // 오답 없으면 홈으로
            } else {
                const baseQuery: { category: string | string[] | undefined; missed: string } = {
                    category,
                    missed: missed.join(","),
                };

                router.push({
                    pathname: "/review",
                    query: baseQuery,
                });
            }
        }
    };

    const handleDontKnow = () => {
        setMissed([...missed, current]);
        handleKnow();
    };

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
