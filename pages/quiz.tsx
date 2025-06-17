// pages/quiz.tsx (혹은 해당 파일 경로)

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { quizByCategory } from "../data/questions"
import QuizView from "../components/QuizView" // 새로 만든 컴포넌트 import

function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5)
}

type QA = { question: string; answer: string; options?: string[] }
type Phase = "select" | "learn" | "done"

export default function QuizPage() {
    const router = useRouter()
    const { category, sub: rawSub, mode, onlyUnknown } = router.query

    const modeParam: "ordered" | "random" =
        Array.isArray(mode) ? "ordered" : mode === "random" ? "random" : "ordered"

    const allData: QA[] = useMemo(() => {
        if (typeof category !== "string" || typeof rawSub !== "string") return []
        const group = quizByCategory[category]
        if (!group) return []
        if (rawSub === "all") return Object.values(group).flat() as QA[]
        return rawSub
            .split(",")
            .filter(Boolean)
            .flatMap((s) => group[s] ?? []) as QA[]
    }, [category, rawSub])

    const filteredData: QA[] = useMemo(() => {
        if (typeof onlyUnknown !== "string" || !onlyUnknown) {
            return allData
        }
        const idxs = onlyUnknown
            .split(",")
            .map((n) => parseInt(n, 10))
            .filter((n) => !isNaN(n) && n >= 0 && n < allData.length)
        return idxs.map((i) => allData[i])
    }, [allData, onlyUnknown])

    // --- 상태 관리 로직은 그대로 유지 ---
    const [phase, setPhase] = useState<Phase>("select")
    const [quizData, setQuizData] = useState<QA[]>([])
    const [current, setCurrent] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [wrongSet, setWrongSet] = useState<QA[]>([])
    const [selectedOption, setSelectedOption] = useState<string | null>(null)

    // --- 데이터 준비 및 라우팅 관련 useEffect 들도 그대로 유지 ---
    useEffect(() => {
        if (!allData.length && category && rawSub) {
            alert("해당 카테고리에 데이터가 없습니다.")
            router.replace("/")
        }
    }, [allData.length, category, rawSub, router])

    useEffect(() => {
        if (!allData.length || phase !== "select") return
        const base = filteredData
        const final = modeParam === "random" ? shuffle(base) : base
        setQuizData(final)
        setPhase("learn")
    }, [allData, modeParam, phase, filteredData])

    // --- 핵심 로직 함수들도 그대로 유지 ---
    const goToNextQuestion = useCallback(() => {
        setShowAnswer(false)
        setSelectedOption(null)
        setCurrent((prev) => {
            const next = prev + 1
            if (next >= quizData.length) {
                setPhase("done")
                return prev
            }
            return next
        })
    }, [quizData.length])

    const handleDontKnow = useCallback(() => {
        const q = quizData[current]
        setWrongSet((prev) =>
            prev.some((x) => x.question === q.question) ? prev : [...prev, q]
        )
        goToNextQuestion()
    }, [current, goToNextQuestion, quizData])

    const handleOptionSelect = useCallback((option: string) => {
        if (showAnswer) {
            if (option === selectedOption) {
                goToNextQuestion();
            }
            return;
        }

        const isCorrect = option === quizData[current].answer;
        setSelectedOption(option);
        setShowAnswer(true);

        if (!isCorrect) {
            const q = quizData[current];
            setWrongSet((prev) =>
                prev.some((x) => x.question === q.question) ? prev : [...prev, q]
            );
        }
    }, [showAnswer, selectedOption, quizData, current, goToNextQuestion]);

    useEffect(() => {
        if (phase !== "learn") return

        const onKey = (e: KeyboardEvent) => {
            const qa = quizData[current];
            const isMultipleChoice = qa.options && qa.options.length > 0;

            if (isMultipleChoice) return;

            if (!showAnswer) {
                setShowAnswer(true)
            } else {
                if (e.key === "ArrowRight") goToNextQuestion()
                else if (e.key === "ArrowLeft") handleDontKnow()
            }
        }

        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [phase, showAnswer, goToNextQuestion, handleDontKnow, quizData, current])

    const retryWrongSet = () => {
        if (!wrongSet.length) return
        setQuizData(shuffle(wrongSet))
        setWrongSet([])
        setCurrent(0)
        setShowAnswer(false)
        setSelectedOption(null)
        setPhase("learn")
    }

    const goHome = () =>
        router.replace(
            typeof category === "string" ? `/${encodeURIComponent(category)}` : "/"
        )

    // --- 렌더링 로직: phase에 따라 적절한 UI를 렌더링 ---

    if (phase === "select" || quizData.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="animate-pulse text-gray-400">문제를 불러오는 중…</p>
            </main>
        )
    }

    if (phase === "learn") {
        return (
            <QuizView
                quizData={quizData}
                current={current}
                showAnswer={showAnswer}
                selectedOption={selectedOption}
                wrongSet={wrongSet}
                onOptionSelect={handleOptionSelect}
                onShowAnswer={() => setShowAnswer(true)}
                onGoToNext={goToNextQuestion}
                onMarkAsWrong={handleDontKnow}
            />
        )
    }

    if (phase === "done") {
        const cleared = wrongSet.length === 0
        // 'done' 단계 UI도 별도 컴포넌트로 분리하면 더 좋습니다.
        // 여기서는 기존 코드를 그대로 사용합니다.
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 p-6">
                <Card className="w-full max-w-lg flex flex-col">
                    <CardContent className="flex flex-col flex-grow justify-between p-6">
                        <div className="text-center">
                            {cleared ? (
                                <>
                                    <h1 className="text-3xl font-bold mb-4">🎉 잘했어요!</h1>
                                    <p className="text-lg mb-6">모든 문제를 완벽하게 풀었습니다.</p>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-4">📋 오답 노트</h1>
                                    <ul className="space-y-4 text-left mb-6 max-h-80 md:max-h-96 overflow-y-auto ">
                                        {wrongSet.map((q, i) => (
                                            <li key={i} className="text-lg md:text-xl">
                                                <div className="font-semibold mb-1">Q. {q.question}</div>
                                                {q.options && q.options.length > 0 && (
                                                    <div className="text-base text-gray-600">
                                                        <p className="font-medium">선지:</p>
                                                        <ul className="list-disc list-inside ml-2">
                                                            {q.options.map((opt, optIdx) => (
                                                                <li key={optIdx}>{opt}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className="text-green-600">A. {q.answer}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="space-y-3 mt-4">
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

    return null; // 모든 phase에 해당하지 않는 경우
}