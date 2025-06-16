import { useRouter } from "next/router";
import { quizByCategory } from "../data/questions";
import { useMemo, useState } from "react";

type QA = { question: string; answer: string };



// ─── 메인 컴포넌트 ───────────────────────────
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

    /* 2. 랜덤 모드 */
    const data = modeParam === "random" ? [...all].sort(() => Math.random() - 0.5) : all;

    /* 3. 상태 */
    const [open, setOpen] = useState<Record<number, boolean>>({});
    const [unknown, setUnknown] = useState<Record<number, boolean>>({});

    const unknownCount = useMemo(
        () => Object.values(unknown).filter(Boolean).length,
        [unknown]
    );

    if (!data.length) return null;

    /* 4. 라우팅 */
    const goToQuiz = () => {
        const base =
            `category=${encodeURIComponent(String(category))}` +
            `&sub=${encodeURIComponent(String(rawSub))}` +
            `&mode=random`;
        router.push(`/quiz?${base}`);
    };

    const goToQuizUnknown = () => {
        const unknownIdxs = Object.entries(unknown)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join(",");
        if (!unknownIdxs) {
            alert("먼저 모르는 문제를 체크하세요.");
            return;
        }
        const base =
            `category=${encodeURIComponent(String(category))}` +
            `&sub=${encodeURIComponent(String(rawSub))}` +
            `&mode=${modeParam}` +
            `&onlyUnknown=${unknownIdxs}`;
        router.push(`/quiz?${base}`);
    };

    /* 5. 전체 토글 */
    const handleToggleAllAnswers = (shouldOpen: boolean) => {
        const newState = Object.fromEntries(
            [...data.keys()].map((idx) => [idx, shouldOpen] as const)
        );
        setOpen(newState);
    };

    const handleToggleAllUnknown = (shouldCheck: boolean) => {
        const newState = Object.fromEntries(
            [...data.keys()].map((idx) => [idx, shouldCheck] as const)
        );
        setUnknown(newState);
    };

    /* 6. 렌더링 */
    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
                {/* ── 문제 리스트 ────────────────── */}
                <div className="flex-[4] lg:pr-8">
                    <h1 className="mb-4 text-3xl font-bold">
                        {category} – 답지 ({data.length}문제)
                    </h1>

                    {/* 컨트롤 패널 */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
                        <div className="text-sm font-medium text-gray-600">
                            <span className="font-bold text-red-500">{unknownCount}</span> / {data.length}개 모름
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                            <button onClick={() => handleToggleAllAnswers(true)} className="rounded-md bg-gray-100 px-3 py-1.5 transition-colors hover:bg-gray-200">전체 정답 보기</button>
                            <button onClick={() => handleToggleAllAnswers(false)} className="rounded-md bg-gray-100 px-3 py-1.5 transition-colors hover:bg-gray-200">전체 숨기기</button>
                            <button onClick={() => handleToggleAllUnknown(true)} className="rounded-md bg-gray-100 px-3 py-1.5 transition-colors hover:bg-gray-200">모두 모름</button>
                            <button onClick={() => handleToggleAllUnknown(false)} className="rounded-md bg-gray-100 px-3 py-1.5 transition-colors hover:bg-gray-200">모두 해제</button>
                        </div>
                    </div>

                    {/* 문제 목록 */}
                    <div className="space-y-4">
                        {data.map((qa, idx) => (
                            <div
                                key={idx}
                                className={`
                                    flex items-start gap-4 rounded-xl p-4 sm:p-6 shadow-sm
                                    border-l-4 transition-all duration-300
                                    ${unknown[idx]
                                        ? "border-red-400 bg-red-50/60"
                                        : "border-transparent bg-white"
                                    }
                                `}
                            >
                                {/* 질문/답변 */}
                                <div className="flex-1">
                                    {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
                                    {/* button에 hover 효과, 패딩, 음수 마진을 추가하여 클릭 영역을 시각화 */}
                                    <button
                                        onClick={() => setOpen((o) => ({ ...o, [idx]: !o[idx] }))}
                                        className="
                                            -m-2 flex w-full items-center justify-between
                                            rounded-lg p-2 text-left
                                            transition-colors hover:bg-gray-100/70
                                        "
                                    >
                                        <span className="pr-4 text-lg font-semibold text-gray-800">
                                            {idx + 1}. {qa.question}
                                        </span>

                                    </button>
                                    {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

                                    {(open[idx] || unknown[idx]) && (
                                        <p className="mt-4 animate-[fadeIn_0.3s_ease-out] rounded-lg bg-slate-100 p-4 font-medium text-green-800">
                                            {qa.answer}
                                        </p>
                                    )}
                                </div>

                                {/* 모름 체크 */}
                                <label className="flex cursor-pointer flex-col items-center gap-2 pt-1">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={!!unknown[idx]}
                                            onChange={() =>
                                                setUnknown((u) => ({ ...u, [idx]: !u[idx] }))
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-red-500"></div>
                                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-full"></div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">모름</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 사이드바 ──────────────────── */}
                <div className="mt-8 lg:ml-8 lg:mt-0 lg:flex-[1]">
                    <div className="sticky top-6 space-y-4 rounded-xl bg-white p-4 shadow-lg">
                        <button
                            onClick={goToQuiz}
                            className="w-full rounded-lg bg-indigo-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            전체 테스트 시작
                        </button>
                        <button
                            onClick={goToQuizUnknown}
                            disabled={unknownCount === 0}
                            className="w-full rounded-lg bg-red-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            모르는 것만 테스트
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}