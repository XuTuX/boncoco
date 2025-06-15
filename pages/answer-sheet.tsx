import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import { useMemo, useState } from "react";

type QA = { question: string; answer: string };

export default function AnswerSheet() {
    const router = useRouter();
    const { category, sub: rawSub, mode } = router.query;
    const modeParam: "ordered" | "random" =
        mode === "random" ? "random" : "ordered";

    /* 1. 전체 문제 데이터 */
    const all: QA[] = useMemo(() => {
        if (typeof category !== "string" || typeof rawSub !== "string") return [];
        const group = quizByCategory[category];
        if (!group) return [];
        if (rawSub === "all") return Object.values(group).flat();
        return rawSub
            .split(",")
            .filter(Boolean)
            .flatMap((s) => group[s] ?? []);
    }, [category, rawSub]);

    const data =
        modeParam === "random" ? [...all].sort(() => Math.random() - 0.5) : all;

    /* 2. 토글 상태 */
    const [open, setOpen] = useState<Record<number, boolean>>({});

    if (!data.length) return null;

    /* 3. 테스트 페이지로 이동 */
    const goToQuiz = () => {
        const base =
            `category=${encodeURIComponent(String(category))}` +
            `&sub=${encodeURIComponent(String(rawSub))}` +
            `&mode=${modeParam}`;
        router.push(`/quiz?${base}`);
    };

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto w-full max-w-2xl space-y-6">
                {/* 헤더 + 테스트 버튼 */}
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold text-center">
                        {category} – 답지 ({data.length}문제)
                    </h1>
                </div>
                {/* Q&A 목록 */}
                {data.map((qa, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <button
                            onClick={() => setOpen((o) => ({ ...o, [idx]: !o[idx] }))}
                            className="w-full text-left font-semibold"
                        >
                            {idx + 1}. {qa.question}
                        </button>
                        {open[idx] && (
                            <p className="mt-2 rounded-md bg-green-50 p-3 text-green-800">
                                {qa.answer}
                            </p>
                        )}
                    </div>
                ))}



                <div className="mt-10 flex justify-center">
                    <button
                        onClick={goToQuiz}
                        className="rounded-lg bg-indigo-500 px-8 py-4 font-semibold text-white shadow-md transition hover:bg-indigo-600"
                    >
                        테스트 시작
                    </button>
                </div>


            </div>
        </main>
    );
}
