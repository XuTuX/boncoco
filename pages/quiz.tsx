import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { quizByCategory } from "../data/questions"
import QuizCard from "../components/QuizCard"

function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5)
}

type QA = { question: string; answer: string }
type Phase = "select" | "learn" | "done"

export default function QuizPage() {
    const router = useRouter()
    const { category, sub: rawSub, mode } = router.query

    const modeParam: "ordered" | "random" =
        Array.isArray(mode) ? "ordered" : mode === "random" ? "random" : "ordered"

    const allData: QA[] = useMemo(() => {
        if (typeof category !== "string" || typeof rawSub !== "string") return []
        const group = quizByCategory[category]
        if (!group) return []
        if (rawSub === "all") return Object.values(group).flat()
        return rawSub
            .split(",")
            .filter(Boolean)
            .flatMap((s) => group[s] ?? [])
    }, [category, rawSub])

    const [phase, setPhase] = useState<Phase>("select")
    const [quizData, setQuizData] = useState<QA[]>([])
    const [current, setCurrent] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [wrongSet, setWrongSet] = useState<QA[]>([])

    useEffect(() => {
        if (!allData.length && category && rawSub) {
            alert("해당 카테고리에 데이터가 없습니다.")
            router.replace("/")
        }
    }, [allData.length, category, rawSub, router])

    useEffect(() => {
        if (!allData.length || phase !== "select") return
        const base = allData
        const final = modeParam === "random" ? shuffle(base) : base
        setQuizData(final)
        setPhase("learn")
    }, [allData, modeParam, phase])

    const know = useCallback(() => {
        setShowAnswer(false)
        setCurrent((prev) => {
            const next = prev + 1
            if (next >= quizData.length) {
                setPhase("done")
                return prev
            }
            return next
        })
    }, [quizData.length])

    const dont = useCallback(() => {
        const q = quizData[current]
        setWrongSet((prev) =>
            prev.some((x) => x.question === q.question) ? prev : [...prev, q]
        )
        know()
    }, [current, know, quizData])

    useEffect(() => {
        if (phase !== "learn") return
        const onKey = (e: KeyboardEvent) => {
            if (!showAnswer) setShowAnswer(true)
            else if (e.key === "ArrowRight") know()
            else if (e.key === "ArrowLeft") dont()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [phase, showAnswer, know, dont])

    const retryWrongSet = () => {
        if (!wrongSet.length) return
        setQuizData(shuffle(wrongSet))
        setWrongSet([])
        setCurrent(0)
        setShowAnswer(false)
        setPhase("learn")
    }

    const goHome = () =>
        router.push(
            typeof category === "string" ? `/${encodeURIComponent(category)}` : "/"
        )

    if (phase === "select") {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="animate-pulse text-gray-400">문제를 불러오는 중…</p>
            </main>
        )
    }

    if (phase === "done") {
        const cleared = wrongSet.length === 0
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 p-6">
                <Card className="w-full max-w-md flex flex-col">
                    <CardContent className="flex flex-col flex-grow justify-between">
                        <div className="text-center">
                            {cleared ? (
                                <>
                                    <h1 className="text-3xl font-bold mb-4">🎉 잘했어요!</h1>
                                    <p className="text-lg mb-6">모든 문제를 완벽하게 풀었습니다.</p>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold mb-4">📋 오답 노트</h1>
                                    <ul className="space-y-2 text-left mb-6 max-h-60 overflow-y-auto">
                                        {wrongSet.map((q, i) => (
                                            <li key={i}>
                                                <div className="font-semibold">Q. {q.question}</div>
                                                <div className="text-green-600">A. {q.answer}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="space-y-3">
                            {!cleared && (
                                <Button onClick={retryWrongSet} className="w-full">
                                    오답만 다시 풀기
                                </Button>
                            )}
                            <Button variant="outline" onClick={goHome} className="w-full">
                                홈으로 돌아가기
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const total = quizData.length
    const progress = Math.round(((current + 1) / total) * 100)
    const qa = quizData[current]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
            <Card className="w-full max-w-lg flex flex-col h-[80vh]">
                <CardContent className="flex flex-col flex-grow">
                    {/* 진행바 */}
                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">
                            문제 {current + 1} / {total}
                        </p>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    {/* 카드 (고정 영역) */}
                    <div className="flex-grow overflow-auto mb-4">
                        <QuizCard question={qa.question} answer={qa.answer} showAnswer={showAnswer} />
                    </div>
                </CardContent>
                {/* 버튼 고정 영역 */}
                <div className="p-4 border-t bg-white">
                    <div className="flex space-x-4">
                        {!showAnswer ? (
                            <Button size="lg" onClick={() => setShowAnswer(true)} className="flex-1">
                                정답 보기
                            </Button>
                        ) : (
                            <>
                                <Button size="lg" variant="destructive" onClick={dont} className="flex-1">
                                    모른다
                                </Button>
                                <Button size="lg" variant="default" onClick={know} className="flex-1">
                                    안다
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
