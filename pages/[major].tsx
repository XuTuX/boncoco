import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { quizByCategory } from "../data/questions";

export default function SubCategoryPage() {
    const router = useRouter();
    const { major } = router.query;

    /* ─── 1. 예외 처리 ─────────────────────── */
    if (typeof major !== "string" || !quizByCategory[major])
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">존재하지 않는 카테고리입니다.</p>
            </main>
        );

    /* ─── 2. 상태 ───────────────────────────── */
    const subCategories = Object.keys(quizByCategory[major]);
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (sub: string) =>
        setSelected((prev) =>
            prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
        );

    const startQuiz = () => {
        if (!selected.length) return;
        router.push(
            `/quiz?category=${encodeURIComponent(major)}&sub=${selected.length === 1 ? selected[0] : selected.join(",")
            }`
        );
    };

    /* ─── 3. UI ─────────────────────────────── */
    return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
            {/* 헤더 */}
            <header className="w-full max-w-md text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    {major} 세부 카테고리
                </h1>
            </header>

            {/* 카드 컨테이너 */}
            <section className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-8">
                {/* (1) 전체 학습 */}
                <Link
                    href={`/quiz?category=${encodeURIComponent(major)}&sub=all`}
                    className="block w-full text-center py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors"
                >
                    전체 학습
                </Link>

                {/* 구분선 */}
                <div className="h-px bg-gray-200" />

                {/* (2) 세부 카테고리 선택 */}
                <div
                    className="grid [grid-template-columns:repeat(auto-fit,minmax(5rem,1fr))] gap-3"
                >
                    {subCategories.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => toggle(sub)}
                            className={`min-w-[5rem] py-3 px-2 rounded-2xl text-sm font-semibold leading-none break-keep text-center transition
                ${selected.includes(sub)
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-blue-100 hover:bg-blue-200 text-gray-800"
                                }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>

                {/* (3) 하단 액션 */}
                <button
                    onClick={startQuiz}
                    disabled={!selected.length}
                    className={`w-full py-4 rounded-xl font-bold transition-colors duration-150 ${selected.length
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                >
                    {selected.length ? `선택한 ${selected.length}개 학습 시작` : "카테고리 선택"}
                </button>
            </section>
        </main>
    );
}
