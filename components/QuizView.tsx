// src/components/QuizView.tsx (최종 전체 코드)

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import QuizCard from "./QuizCard"
import WrongAnswerList from "./WrongAnswerList"

type QA = { question: string; answer: string; options?: string[] }

interface QuizViewProps {
    quizData: QA[]
    current: number
    showAnswer: boolean
    isMultiAnswerQuestion: boolean
    selectedOption: string | null
    selectedOptions: string[]
    wrongSet: QA[]
    shuffledOptions: string[] | null
    correctAnswers: string[]
    onOptionSelect: (option: string) => void
    onGoToNext: () => void
    onCheckAnswers: () => void
    // 주관식(플래시카드)용 핸들러 추가
    onShowAnswer: () => void
    onKnow: () => void
    onDontKnow: () => void
}

const QuizView = ({
    quizData,
    current,
    showAnswer,
    isMultiAnswerQuestion,
    selectedOption,
    selectedOptions,
    wrongSet,
    shuffledOptions,
    correctAnswers,
    onOptionSelect,
    onGoToNext,
    onCheckAnswers,
    onShowAnswer,
    onKnow,
    onDontKnow,
}: QuizViewProps) => {
    const total = quizData.length
    const progress = Math.round(((current + 1) / total) * 100)
    const qa = quizData[current]

    // 현재 문제가 객관식인지 여부를 여기서 판단
    const isMultipleChoice = !!(qa.options && qa.options.length > 0)

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
                {/* 왼쪽: 퀴즈 영역 */}
                <div className="lg:w-2/3 h-full">
                    <Card className="w-full flex flex-col h-full">
                        <CardContent className="flex flex-col flex-grow p-4 md:p-6">
                            <div className="mb-4">
                                <p className="font-semibold text-gray-700 mb-1">
                                    문제 {current + 1} / {total}
                                </p>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-2 rounded-full bg-blue-500 transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex-grow overflow-auto mb-4">
                                <QuizCard
                                    question={qa.question}
                                    correctAnswers={correctAnswers}
                                    options={shuffledOptions}
                                    showAnswer={showAnswer}
                                    isMultiAnswerQuestion={isMultiAnswerQuestion}
                                    selectedOption={selectedOption}
                                    selectedOptions={selectedOptions}
                                    onOptionSelect={onOptionSelect}
                                    isMultipleChoice={isMultipleChoice} // 객관식 여부 전달
                                />
                            </div>
                        </CardContent>

                        {/* ▼▼▼ 핵심: 문제 유형과 상태에 따라 다른 버튼 그룹 렌더링 ▼▼▼ */}
                        <div className="p-4 border-t bg-white">
                            <div className="flex space-x-4">
                                {showAnswer ? (
                                    // --- 1. 정답이 공개된 후 ---
                                    isMultipleChoice ? (
                                        // 1-1. 객관식 -> "다음 문제"
                                        <Button size="lg" onClick={onGoToNext} className="flex-1">
                                            다음 문제
                                        </Button>
                                    ) : (
                                        // 1-2. 주관식 -> "알아요" / "몰라요"
                                        <>
                                            <Button size="lg" variant="outline" onClick={onDontKnow} className="flex-1">
                                                몰라요 (오답)
                                            </Button>
                                            <Button size="lg" onClick={onKnow} className="flex-1">
                                                알아요 (정답)
                                            </Button>
                                        </>
                                    )
                                ) : (
                                    // --- 2. 정답 공개 전 ---
                                    isMultipleChoice ? (
                                        isMultiAnswerQuestion ? (
                                            // 2-1. 복수 정답 객관식 -> "정답 확인"
                                            <Button size="lg" onClick={onCheckAnswers} disabled={selectedOptions.length === 0} className="flex-1">
                                                정답 확인
                                            </Button>
                                        ) : (
                                            // 2-2. 단일 정답 객관식 -> 선택 유도
                                            <div className="text-center w-full text-gray-500">
                                                선지를 선택해주세요.
                                            </div>
                                        )
                                    ) : (
                                        // 2-3. 주관식 -> "정답 보기"
                                        <Button size="lg" onClick={onShowAnswer} className="flex-1">
                                            정답 보기
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 오른쪽: 오답 노트 영역 */}
                <div className="hidden lg:block lg:w-1/3 h-full">
                    <WrongAnswerList wrongSet={wrongSet} />
                </div>
            </div>
        </main>
    )
}

export default QuizView