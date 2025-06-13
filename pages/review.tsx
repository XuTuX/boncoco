import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { quizByCategory } from '../data/questions';
import QuizCard from '../components/QuizCard';

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export default function ReviewPage() {
    const router = useRouter();
    const category = router.query.category as string;

    const quizData = category && quizByCategory[category] ? quizByCategory[category] : [];

    const initialMissedRaw = (router.query.missed as string)
        ?.split(',')
        .map(Number)
        .filter((n) => !isNaN(n) && n >= 0 && n < quizData.length) || [];

    const [missed, setMissed] = useState<number[]>(shuffleArray(initialMissedRaw)); // ✅ 랜덤화
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (!category || !quizData.length) {
            alert('복습할 카테고리 정보를 찾을 수 없습니다.');
            router.push('/');
        }
    }, [category, quizData]);

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
            setMissed(shuffleArray(validMissed)); // ✅ 잘못된 인덱스 제거 후 다시 셔플
            setIndex(0);
        }
    }, [q, missed, quizData]);

    if (!initialMissedRaw.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
                <p className="text-white text-2xl font-bold bg-white/20 p-8 rounded-lg shadow-xl">오답이 없습니다! 🎉</p>
            </div>
        );
    }

    if (missed.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center p-6 space-y-6">
                <p className="text-white text-2xl font-bold bg-white/20 p-8 rounded-lg shadow-xl">복습 완료! 📚</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow hover:bg-blue-100 transition"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

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
                            onClick={handleKnow}
                            className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                        >
                            맞췄다
                        </button>
                        <button
                            onClick={handleDontKnow}
                            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                        >
                            또 틀림
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
