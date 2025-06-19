// pages/quiz.tsx (최종 전체 코드)

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { quizByCategory } from "../data/questions"
import QuizView from "../components/QuizView"

// 유틸리티 함수
function shuffle<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5)
}

// 타입 정의
type QA = { question: string; answer: string; options?: string[] }
type Phase = "select" | "learn" | "done"

export default function QuizPage() {
    const router = useRouter()
    const { category, sub: rawSub, mode, onlyUnknown } = router.query

    const modeParam: "ordered" | "random" =
        Array.isArray(mode) ? "ordered" : mode === "random" ? "random" : "ordered"

    // --- 데이터 처리 로직 ---
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

    // --- 상태 관리 ---
    const [phase, setPhase] = useState<Phase>("select")
    const [quizData, setQuizData] = useState<QA[]>([])
    const [current, setCurrent] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [wrongSet, setWrongSet] = useState<QA[]>([])
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])

    // --- 데이터 준비 및 라우팅 관련 useEffect ---
    useEffect(() => {
        if (!allData.length && category && rawSub) {
            alert("해당 카테고리에 데이터가 없습니다.")
            router.replace("/")
        }
    }, [allData.length, category, rawSub, router])

    useEffect(() => {
        if (!allData.length || phase !== "select") return
        const base = filteredData.length > 0 ? filteredData : allData
        const final = modeParam === "random" ? shuffle(base) : base
        setQuizData(final)
        setPhase("learn")
    }, [allData, modeParam, phase, filteredData])

    // --- 현재 문제 관련 데이터 정의 ---
    const currentQA = quizData.length > 0 ? quizData[current] : null

    const correctAnswersArray = useMemo(() => {
        if (!currentQA) return []
        return currentQA.answer.split(" / ").map((a) => a.trim())
    }, [currentQA])

    const shuffledOptions = useMemo(() => {
        if (!currentQA || !currentQA.options) return null
        const allOptions = [...correctAnswersArray, ...currentQA.options]
        return shuffle(Array.from(new Set(allOptions)))
    }, [currentQA, correctAnswersArray])

    const isMultiAnswerQuestion = correctAnswersArray.length > 1

    // --- 핵심 로직 함수들 ---
    const goToNextQuestion = useCallback(() => {
        setShowAnswer(false)
        setSelectedOption(null)
        setSelectedOptions([])
        setCurrent((prev) => {
            const next = prev + 1
            if (next >= quizData.length) {
                setPhase("done")
                return prev
            }
            return next
        })
    }, [quizData.length])

    // [수정] 주관식용 핸들러 추가
    const handleShowAnswer = () => {
        setShowAnswer(true)
    }

    const handleKnow = () => {
        goToNextQuestion()
    }

    const handleDontKnow = useCallback(() => {
        const q = quizData[current]
        if (q) {
            setWrongSet((prev) =>
                prev.some((x) => x.question === q.question) ? prev : [...prev, q]
            )
        }
        goToNextQuestion()
    }, [current, goToNextQuestion, quizData])

    // 객관식용 핸들러
    const handleOptionSelect = useCallback(
        (option: string) => {
            if (showAnswer) {
                if (!isMultiAnswerQuestion && option === selectedOption) {
                    goToNextQuestion()
                }
                return
            }

            if (isMultiAnswerQuestion) {
                setSelectedOptions((prev) =>
                    prev.includes(option)
                        ? prev.filter((item) => item !== option)
                        : [...prev, option]
                )
            } else {
                setSelectedOption(option)
                setShowAnswer(true)
                const isCorrect = correctAnswersArray.includes(option)
                if (!isCorrect) {
                    const q = quizData[current]
                    setWrongSet((prev) =>
                        prev.some((x) => x.question === q.question) ? prev : [...prev, q]
                    )
                }
            }
        },
        [showAnswer, isMultiAnswerQuestion, selectedOption, correctAnswersArray, quizData, current, goToNextQuestion]
    )

    const handleCheckAnswers = useCallback(() => {
        if (!isMultiAnswerQuestion || selectedOptions.length === 0) return

        const isCorrect =
            selectedOptions.length === correctAnswersArray.length &&
            selectedOptions.every((opt) => correctAnswersArray.includes(opt))

        setShowAnswer(true)

        if (!isCorrect) {
            const q = quizData[current]
            setWrongSet((prev) =>
                prev.some((x) => x.question === q.question) ? prev : [...prev, q]
            )
        }
    }, [isMultiAnswerQuestion, selectedOptions, correctAnswersArray, quizData, current])

    // [수정] 키보드 이벤트 핸들러 (주관식용 로직 추가)
    useEffect(() => {
        if (phase !== "learn" || !currentQA) return

        const isMultipleChoice = !!currentQA.options

        const onKey = (e: KeyboardEvent) => {
            if (isMultipleChoice) return // 객관식일때는 키보드 이벤트 무시

            if (!showAnswer) {
                if (e.key === " " || e.key === "Enter") { // 스페이스바나 엔터로 정답 보기
                    e.preventDefault()
                    setShowAnswer(true)
                }
            } else {
                if (e.key === "ArrowRight") handleKnow() // 오른쪽 화살표: 알아요
                else if (e.key === "ArrowLeft") handleDontKnow() // 왼쪽 화살표: 몰라요
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [phase, showAnswer, currentQA, handleKnow, handleDontKnow])

    // --- 결과 처리 함수 ---
    const retryWrongSet = () => {
        if (!wrongSet.length) return
        setQuizData(shuffle(wrongSet))
        setWrongSet([])
        setCurrent(0)
        setShowAnswer(false)
        setSelectedOption(null)
        setSelectedOptions([])
        setPhase("learn")
    }

    const goHome = () =>
        router.replace(typeof category === "string" ? `/${encodeURIComponent(category)}` : "/")

    // --- 렌더링 로직 ---
    if (phase === "select" || !currentQA) {
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
                isMultiAnswerQuestion={isMultiAnswerQuestion}
                selectedOption={selectedOption}
                selectedOptions={selectedOptions}
                wrongSet={wrongSet}
                shuffledOptions={shuffledOptions}
                correctAnswers={correctAnswersArray}
                onOptionSelect={handleOptionSelect}
                onGoToNext={goToNextQuestion}
                onCheckAnswers={handleCheckAnswers}
                // 주관식용 핸들러 전달
                onShowAnswer={handleShowAnswer}
                onKnow={handleKnow}
                onDontKnow={handleDontKnow}
            />
        )
    }

    if (phase === "done") {
        const cleared = wrongSet.length === 0
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

    return null
}