import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { quizByCategory } from '../data/questions';
import QuizCard from '../components/QuizCard';

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function ReviewPage() {
    const router = useRouter();

    // ✅ 수정 1: sub도 받아오기
    const { category, sub } = router.query;

    // ✅ 수정 2: 2단계 구조 반영
    let quizData: { question: string; answer: string }[] = [];

    if (
        typeof category === "string" &&
        typeof sub === "string" &&
        quizByCategory[category]
    ) {
        quizData =
            sub === "all"
                ? Object.values(quizByCategory[category]).flat()
                : quizByCategory[category][sub] || [];
    }

    // ✅ 그대로 유지
    const initialMissedRaw = (router.query.missed as string)
        ?.split(',')
        .map(Number)
        .filter((n) => !isNaN(n) && n >= 0 && n < quizData.length) || [];

    const [missed, setMissed] = useState<number[]>(shuffleArray(initialMissedRaw)); // ✅ 랜덤화
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    // ✅ 수정 3: 오류 문구 개선
    useEffect(() => {
        if (!category || !sub || !quizData.length) {
            alert('복습할 카테고리 정보를 찾을 수 없습니다.');
            router.push('/');
        }
    }, [category, sub, quizData]);

    // ✅ 키보드 단축키
    useEffect(() => {
        const handleKeyDown = () => {
            if (!showAnswer) {
                setShowAnswer(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showAnswer]);

    useEffect(() => {
        if (index >= missed.length && missed.length > 0) {
            setIndex(0);
        }
    }, [index, missed]);

    const currentIndex = missed[index];
    const q = quizData[currentIndex];

    useEffect(() => {
        if (q === undefined && missed.length > 0) {
            const validMissed = missed.filter((i) => i >= 0 && i < quizData.length);
            setMissed(shuffleArray(validMissed));
            setIndex(0);
        }
    }, [q, missed, quizData]);

    // --- 수정된 부분 시작 ---
    const handleGoHome = () => {
        // category가 문자열인지 확인 후 해당 카테고리 페이지로 이동
        if (typeof category === 'string') {
            router.push(`/${encodeURIComponent(category)}`);
        } else {
            // category가 없는 경우의 폴백
            router.push("/");
        }
    };
    // --- 수정된 부분 끝 ---

    if (!initialMissedRaw.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
                <p className="text-white text-2xl font-bold bg-white/20 p-8 rounded-lg shadow-xl">오답이 없습니다! 🎉</p>
            </div>
        );
    }

    // --- 수정된 부분 시작 ---
    if (missed.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-500 to-teal-600 text-white px-4">
                <h1 className="text-3xl font-bold mb-6">✅ 복습 완료! ✅</h1>
                <p className="text-lg mb-8 text-center">모든 오답을 완벽하게 복습했어요!</p>
                <button
                    onClick={handleGoHome} // 수정: handleGoHome 함수 사용
                    className="w-full max-w-xs py-3 bg-white text-green-700 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }
    // --- 수정된 부분 끝 ---

    if (!q) {
        return (
            <div className="min-h-screen bg-orange-100 flex items-center justify-center p-6">
                <p className="text-red-600 text-xl font-bold">문제를 불러올 수 없습니다. 다시 시도해주세요.</p>
            </div>
        );
    }

    const handleKnow = () => {
        const updated = missed.filter((_, i) => i !== index);
        setMissed(updated);
        setShowAnswer(false);
        if (index >= updated.length) {
            setIndex(0);
        }
    };

    const handleDontKnow = () => {
        setShowAnswer(false);
        setIndex(index + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">오답 복습 🧠</h2>
                <QuizCard question={q.question} answer={q.answer} showAnswer={showAnswer} />

                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="mt-6 w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
                    >
                        정답 보기
                    </button>
                ) : (
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleDontKnow}
                            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                        >
                            또 틀림
                        </button>
                        <button
                            onClick={handleKnow}
                            className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                        >
                            맞췄다
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}