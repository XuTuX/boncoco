import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { quizByCategory } from "../data/questions";

export default function SubCategoryPage() {
    const router = useRouter();
    const { major } = router.query;
    const [selected, setSelected] = useState<string[]>([]);
    const [mode, setMode] = useState<"ordered" | "random">("ordered");

    /* 1. 예외 처리 */
    if (typeof major !== "string" || !quizByCategory[major]) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">존재하지 않는 카테고리입니다.</p>
            </main>
        );
    }

    /* 2. 상태 */
    const subCategories = Object.keys(quizByCategory[major]);
    const toggle = (sub: string) =>
        setSelected((prev) =>
            prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
        );

    /* 3. 라우팅 함수  (type: quiz | sheet) */
    const start = (type: "quiz" | "sheet") => {
        if (!selected.length) return;
        const subParam =
            selected.length === 1 ? selected[0] : selected.join(",");
        const base = `category=${encodeURIComponent(
            major,
        )}&sub=${subParam}&mode=${mode}`;

        router.push(type === "quiz" ? `/quiz?${base}` : `/answer-sheet?${base}`);
    };

    /* 4. UI */
    return (
        <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
            {/* 헤더 */}
            <header className="mb-10 w-full max-w-md text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
                    {major} 세부 카테고리
                </h1>
            </header>

            {/* 카드 컨테이너 */}
            <section className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl">
                {/* (1) 전체 학습 */}
                <Link
                    href={`/answer-sheet?category=${encodeURIComponent(
                        major,
                    )}&sub=all&mode=${mode}`}
                    className="block w-full rounded-xl bg-purple-600 py-4 text-center font-bold text-white transition-colors hover:bg-purple-700"
                >
                    전체 답지 보기
                </Link>

                {/* 모드(순서/랜덤) 선택 */}
                <div className="flex justify-center gap-4 text-sm font-semibold text-yellow-800">
                    {(["ordered", "random"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`rounded-full border px-4 py-2 transition ${mode === m
                                    ? "bg-yellow-300 border-yellow-500"
                                    : "border-yellow-300"
                                }`}
                        >
                            {m === "ordered" ? "순서대로" : "랜덤으로"}
                        </button>
                    ))}
                </div>

                {/* 구분선 */}
                <div className="h-px bg-gray-200" />

                {/* (2) 세부 카테고리 선택 */}
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(5rem,1fr))] gap-3">
                    {subCategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => toggle(sub)}
                            className={`min-w-[5rem] break-keep rounded-2xl px-2 py-3 text-center text-sm font-semibold leading-none transition ${selected.includes(sub)
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-blue-100 text-gray-800 hover:bg-blue-200"
                                }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>

                {/* (3) 하단 액션 : 테스트 / 학습하기 */}
                <div className="flex gap-4">
                    <button
                        onClick={() => start("quiz")}
                        disabled={!selected.length}
                        className={`flex-1 rounded-xl py-4 font-bold transition-colors duration-150 ${selected.length
                                ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                                : "cursor-not-allowed bg-gray-300 text-gray-600"
                            }`}
                    >
                        테스트 시작
                    </button>
                    <button
                        onClick={() => start("sheet")}
                        disabled={!selected.length}
                        className={`flex-1 rounded-xl py-4 font-bold transition-colors duration-150 ${selected.length
                                ? "bg-indigo-500 text-white shadow-md hover:bg-indigo-600"
                                : "cursor-not-allowed bg-gray-300 text-gray-600"
                            }`}
                    >
                        학습하기
                    </button>
                </div>
            </section>
        </main>
    );
}
