import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import QuizCard from "../components/QuizCard";

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
    const router = useRouter();
    const { category, sub, missedOnly } = router.query;

    const missedList = (router.query.missed as string)
        ?.split(",")
        .map(Number)
        .filter((n) => !isNaN(n)) || [];

    // ✅ 문제 데이터 구성 (2단계 구조 처리)
    let allQuizData: { question: string; answer: string }[] = [];

    if (
        typeof category === "string" &&
        typeof sub === "string" &&
        quizByCategory[category]
    ) {
        allQuizData =
            sub === "all"
                ? Object.values(quizByCategory[category]).flat()
                : quizByCategory[category][sub] || [];
    }

    const [quizData, setQuizData] = useState<{ question: string; answer: string }[]>([]);
    const [modeSelected, setModeSelected] = useState(false);
    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [missed, setMissed] = useState<number[]>([]);
    const [quizCompleted, setQuizCompleted] = useState(false); // New state for quiz completion

    const total = quizData.length;
    const progressPercent = Math.round(((current + 1) / total) * 100);

    // ✅ 정답 보기 - 키보드 단축키
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showAnswer) {
                // 정답 보기 먼저
                setShowAnswer(true);
            } else {
                if (e.key === "ArrowRight") {
                    handleKnow();      // 오른쪽 → 키는 "안다"
                } else if (e.key === "ArrowLeft") {
                    handleDontKnow();  // 왼쪽 ← 키는 "모른다"
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showAnswer, current, quizData, missed]); // 필요한 state들을 의존성에 넣어줌


    // ✅ 에러 시 리디렉션
    useEffect(() => {
        if (!allQuizData.length && category && sub) {
            alert("해당 카테고리에 데이터가 없습니다.");
            router.push("/");
        }
    }, [category, sub, allQuizData]);

    // ✅ 모드 선택 (순서대로 / 랜덤)
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
            // Quiz completed
            if (missed.length === 0) {
                setQuizCompleted(true); // Set quizCompleted to true
            } else {
                router.push({
                    pathname: "/review",
                    query: {
                        category,
                        sub,
                        missed: missed.join(","),
                    },
                });
            }
        }
    };

    const handleDontKnow = () => {
        setMissed([...missed, current]);
        handleKnow();
    };

    // --- MODIFIED handleGoHome function ---
    const handleGoHome = () => {
        // Ensure category is a string before encoding
        if (typeof category === 'string') {
            router.push(`/${encodeURIComponent(category)}`);
        } else {
            // Fallback if category is not available, though it should be
            router.push("/");
        }
    };
    // --- END MODIFIED handleGoHome function ---

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

    // Display "Well Done!" message when quiz is completed with no missed questions
    if (quizCompleted) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-500 to-teal-600 text-white px-4">
                <h1 className="text-3xl font-bold mb-6">🎉 잘했어요! 🎉</h1>
                <p className="text-lg mb-8 text-center">모든 문제를 완벽하게 풀었어요!</p>
                <button
                    onClick={handleGoHome}
                    className="w-full max-w-xs py-3 bg-white text-green-700 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                    홈으로 돌아가기
                </button>
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
                            onClick={handleDontKnow}
                            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                        >
                            모른다
                        </button>
                        <button
                            onClick={handleKnow}
                            className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                        >
                            안다
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}