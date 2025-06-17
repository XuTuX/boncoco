import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/router"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { quizByCategory } from "../data/questions"
import QuizCard from "../components/QuizCard"

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

    const [phase, setPhase] = useState<Phase>("select")
    const [quizData, setQuizData] = useState<QA[]>([])
    const [current, setCurrent] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [wrongSet, setWrongSet] = useState<QA[]>([])
    const [selectedOption, setSelectedOption] = useState<string | null>(null)

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
        // 이미 답이 공개된 상태 (두 번째 클릭)
        if (showAnswer) {
            // 이전에 선택했던 옵션을 다시 클릭했을 때만 다음 문제로 넘어감
            if (option === selectedOption) {
                goToNextQuestion();
            }
            return; // 다른 옵션을 클릭하면 아무것도 하지 않음
        }

        // 첫 번째 클릭: 답을 확인하는 로직
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

    if (phase === "select" || quizData.length === 0) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="animate-pulse text-gray-400">문제를 불러오는 중…</p>
            </main>
        )
    }

    // --- 요청하신 'done' 단계 UI 코드 복원 ---
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
    // --- 'done' UI 코드 끝 ---

    const total = quizData.length
    const progress = Math.round(((current + 1) / total) * 100)
    const qa = quizData[current]
    const isMultipleChoice = qa.options && qa.options.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
            <Card className="w-full max-w-lg flex flex-col h-[80vh]">
                <CardContent className="flex flex-col flex-grow p-4 md:p-6">
                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">
                            문제 {current + 1} / {total}
                        </p>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    <div className="flex-grow overflow-auto mb-4">
                        <QuizCard
                            question={qa.question}
                            answer={qa.answer}
                            options={qa.options}
                            showAnswer={showAnswer}
                            selectedOption={selectedOption}
                            onOptionSelect={handleOptionSelect}
                        />
                    </div>
                </CardContent>
                <div className="p-4 border-t bg-white">
                    <div className="flex space-x-4">
                        {isMultipleChoice ? (
                            showAnswer ? (
                                <>
                                    <Button size="lg" variant="destructive" onClick={handleDontKnow} className="flex-1">
                                        몰랐던 문제로 저장
                                    </Button>
                                    <Button size="lg" variant="default" onClick={goToNextQuestion} className="flex-1">
                                        다음 문제
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center w-full text-gray-500">
                                    선지를 선택해주세요.
                                </div>
                            )
                        ) : (
                            !showAnswer ? (
                                <Button size="lg" onClick={() => setShowAnswer(true)} className="flex-1">
                                    정답 보기
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" variant="destructive" onClick={handleDontKnow} className="flex-1">
                                        모른다
                                    </Button>
                                    <Button size="lg" variant="default" onClick={goToNextQuestion} className="flex-1">
                                        안다
                                    </Button>
                                </>
                            )
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}