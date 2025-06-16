"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { List, Shuffle, Play, BookOpen } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

import { quizByCategory } from "../data/questions"

export default function SubCategoryPage() {
    const router = useRouter()
    const { major } = router.query as { major?: string }

    const [selected, setSelected] = useState<string[]>([])
    const [mode, setMode] = useState<"ordered" | "random">("ordered")

    /* ─── 1. 예외 처리 ───────────────────────── */
    if (typeof major !== "string" || !quizByCategory[major]) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-gray-500">존재하지 않는 카테고리입니다.</p>
            </main>
        )
    }

    /* ─── 2. 데이터 및 상태 ───────────────────── */
    const subCategories = Object.keys(quizByCategory[major])

    const toggle = (sub: string) =>
        setSelected(prev =>
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub],
        )

    const start = (type: "quiz" | "sheet") => {
        if (!selected.length) return
        const subParam =
            selected.length === 1 ? selected[0] : selected.join(",")
        const base = `category=${encodeURIComponent(
            major,
        )}&sub=${subParam}&mode=${mode}`
        router.replace(type === "quiz" ? `/quiz?${base}` : `/answer-sheet?${base}`)
    }

    const isActive = !!selected.length

    /* ─── 3. UI ──────────────────────────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="container mx-auto px-4 py-8 max-w-4xl">

                {/* 헤더 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#202A36] mb-2">
                        {major} 세부 카테고리
                    </h1>
                </div>

                {/* 메인 카드 */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">

                        {/* 3-1. 상단 액션 */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Link
                                href={`/answer-sheet?category=${encodeURIComponent(
                                    major,
                                )}&sub=all&mode=${mode}`}
                                passHref
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full h-14 text-lg bg-[#9B00FF] hover:bg-[#8500E6] text-white shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                >
                                    <a className="flex items-center justify-center">
                                        <List className="mr-2 h-5 w-5" />
                                        전체 목록 보기
                                    </a>
                                </Button>
                            </Link>


                            <Link
                                href={`/quiz?category=${encodeURIComponent(
                                    major,
                                )}&sub=all&mode=${mode}`}
                                passHref
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full h-14 text-lg bg-[#FF3B30] hover:bg-[#E6342A] text-white shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                >
                                    <a className="flex items-center justify-center">
                                        <Play className="mr-2 h-5 w-5" />
                                        전체 시험 보기
                                    </a>
                                </Button>
                            </Link>
                        </div>

                        {/* 3-2. 모드 선택 */}
                        <div className="flex gap-6">
                            {(["ordered", "random"] as const).map(m => (
                                <Button
                                    key={m}
                                    size="lg"
                                    onClick={() => setMode(m)}
                                    className={`flex-1 h-12 text-lg font-medium rounded-lg transition transform duration-200 ${mode === m
                                        ? "bg-amber-400 hover:bg-amber-300 text-amber-900 shadow-md"
                                        : "bg-white border-2 border-amber-400 text-amber-500 hover:bg-amber-50"
                                        }`}
                                >
                                    {m === "ordered" ? (
                                        <>
                                            <List className="mr-2 h-4 w-4" /> 순서대로
                                        </>
                                    ) : (
                                        <>
                                            <Shuffle className="mr-2 h-4 w-4" /> 랜덤
                                        </>
                                    )}
                                </Button>
                            ))}
                        </div>


                        {/* 3-3. 카테고리 선택 */}
                        <div className="mt-8 mb-8">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4 gap-6">
                                카테고리 선택
                                <span className="text-sm font-normal text-slate-500 ml-2 gap-6">
                                    ({selected.length}/{subCategories.length})
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {subCategories.map(sub => (
                                    <Badge
                                        key={sub}
                                        onClick={() => toggle(sub)}
                                        className={`
        cursor-pointer 
        w-32 h-16               /* 고정 너비, 최소 높이 */
        py-2 px-3               /* 텍스트와 여백 조정 */
        text-base               /* font-size 약간 축소 */
        rounded-lg 
        text-center 
        transition transform duration-200 hover:scale-105 
        overflow-hidden 
        whitespace-normal 
        break-words             /* 줄바꿈 허용 */
        ${selected.includes(sub)
                                                ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md"
                                                : "bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 hover:border-sky-300"
                                            }
      `}
                                    >
                                        {sub}
                                    </Badge>
                                ))}
                            </div>

                        </div>

                        {/* 3-4. 하단 버튼 */}
                        <div className="flex gap-6">

                            <Button
                                disabled={!isActive}
                                size="lg"
                                onClick={() => start("sheet")}
                                className={`flex-1 h-14 text-lg font-semibold transition transform duration-200 ${isActive
                                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                <BookOpen className="mr-2 h-5 w-5" />
                                학습하기
                            </Button>
                            <Button
                                disabled={!isActive}
                                size="lg"
                                onClick={() => start("quiz")}
                                className={`flex-1 h-14 text-lg font-semibold transition transform duration-200 ${isActive
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                <Play className="mr-2 h-5 w-5" />
                                테스트 시작
                            </Button>


                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
