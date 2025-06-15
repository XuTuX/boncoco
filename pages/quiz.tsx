import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import QuizCard from "../components/QuizCard";

function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
}

type QA = { question: string; answer: string };
type Phase = "select" | "learn" | "done";

export default function QuizPage() {
    const router = useRouter();
    const { category, sub: rawSub, missedOnly, mode } = router.query;

    /* ── 0. mode 기본값 ── */
    const modeParam: "ordered" | "random" =
        Array.isArray(mode) ? "ordered" : mode === "random" ? "random" : "ordered";

    /* ── 1. 전체 문제 집합 (useMemo로 고정) ── */
    const allData: QA[] = useMemo(() => {
        if (typeof category !== "string" || typeof rawSub !== "string") return [];
        const group = quizByCategory[category];
        if (!group) return [];

        if (rawSub === "all") return Object.values(group).flat();
        return rawSub
            .split(",")
            .filter(Boolean)
            .flatMap((s) => group[s] ?? []);
    }, [category, rawSub]);

    /* ── 2. 상태 ── */
    const [phase, setPhase] = useState<Phase>("select");
    const [quizData, setQuizData] = useState<QA[]>([]);
    const [current, setCurrent] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [wrongSet, setWrongSet] = useState<QA[]>([]);

    /* ── 3. 데이터 없으면 홈 리다이렉트 ── */
    useEffect(() => {
        if (!allData.length && category && rawSub) {
            alert("해당 카테고리에 데이터가 없습니다.");
            router.replace("/");
        }
    }, [allData.length, category, rawSub, router]);

    /* ── 4. 퀴즈 데이터 세팅 (phase === 'select' 한정) ── */
    useEffect(() => {
        if (!allData.length || phase !== "select") return;

        const missedIdxList =
            typeof router.query.missed === "string"
                ? router.query.missed
                    .split(",")
                    .map(Number)
                    .filter((i) => !Number.isNaN(i) && i >= 0 && i < allData.length)
                : [];

        const base =
            missedOnly === "true" && missedIdxList.length
                ? missedIdxList.map((i) => allData[i])
                : allData;

        const final = modeParam === "random" ? shuffle(base) : base;

        setQuizData(final);
        setPhase("learn"); // ✅ 한 번만 실행
    }, [allData, missedOnly, router.query.missed, modeParam, phase]);

    /* ── 5. 학습 로직 ── */
    const know = useCallback(() => {
        setShowAnswer(false);
        setCurrent((prev) => {
            const next = prev + 1;
            if (next >= quizData.length) {
                setPhase("done");
                return prev;
            }
            return next;
        });
    }, [quizData.length]);

    const dont = useCallback(() => {
        const q = quizData[current];
        setWrongSet((prev) =>
            prev.some((x) => x.question === q.question) ? prev : [...prev, q],
        );
        know();
    }, [current, know, quizData]);

    /* ── 6. 키보드 단축키 ── */
    useEffect(() => {
        if (phase !== "learn") return;
        const onKey = (e: KeyboardEvent) => {
            if (!showAnswer) setShowAnswer(true);
            else if (e.key === "ArrowRight") know();
            else if (e.key === "ArrowLeft") dont();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [phase, showAnswer, know, dont]);

    /* ── 7. 오답 재도전 ── */
    const retryWrongSet = () => {
        if (!wrongSet.length) return;
        setQuizData(shuffle(wrongSet));
        setWrongSet([]);
        setCurrent(0);
        setShowAnswer(false);
        setPhase("learn");
    };

    /* ── 8. 홈 이동 ── */
    const goHome = () =>
        router.push(
            typeof category === "string" ? `/${encodeURIComponent(category)}` : "/",
        );

    /* ── 9. 로딩 가드 ── */
    if (phase === "select") {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="animate-pulse text-gray-400">문제를 불러오는 중…</p>
            </main>
        );
    }

    /* ── 10. 완료 화면 ── */
    if (phase === "done") {
        const cleared = wrongSet.length === 0;
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 px-4 text-white space-y-8">
                {cleared ? (
                    <>
                        <h1 className="text-3xl font-bold">🎉 잘했어요!</h1>
                        <p className="text-lg">모든 문제를 완벽하게 풀었습니다.</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">📋 오답 노트</h1>
                        <ul className="max-h-[60vh] w-full max-w-xl overflow-y-auto space-y-2 rounded-xl bg-white/10 p-6 text-left">
                            {wrongSet.map((q, i) => (
                                <li key={i} className="space-y-1 text-white/90">
                                    <div className="font-semibold">Q. {q.question}</div>
                                    <div className="text-green-300">A. {q.answer}</div>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={retryWrongSet}
                            className="rounded-lg bg-red-100 px-6 py-3 font-semibold text-red-700 hover:bg-red-200"
                        >
                            오답만 다시 풀기
                        </button>
                    </>
                )}
                <button
                    onClick={goHome}
                    className="rounded-lg bg-white px-6 py-3 font-bold text-green-700 shadow-md hover:bg-gray-100"
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    /* ── 11. 학습 화면 ── */
    const total = quizData.length;
    const progress = Math.round(((current + 1) / total) * 100);
    const qa = quizData[current];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                {/* 진행바 */}
                <div className="mb-6">
                    <p className="mb-2 text-lg font-semibold text-gray-700">
                        문제 {current + 1} / {total}
                    </p>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                        <div
                            className="h-3 rounded-full bg-green-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* 카드 */}
                <QuizCard
                    question={qa.question}
                    answer={qa.answer}
                    showAnswer={showAnswer}
                />

                {/* 버튼 */}
                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-bold text-white shadow-md hover:bg-indigo-700"
                    >
                        정답 보기
                    </button>
                ) : (
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={dont}
                            className="flex-1 rounded-lg bg-red-500 py-3 font-bold text-white shadow-md hover:bg-red-600"
                        >
                            모른다
                        </button>
                        <button
                            onClick={know}
                            className="flex-1 rounded-lg bg-green-500 py-3 font-bold text-white shadow-md hover:bg-green-600"
                        >
                            안다
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
