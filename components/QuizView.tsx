// src/components/QuizView.tsx (수정된 전체 코드)

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import QuizCard from "./QuizCard"
import WrongAnswerList from "./WrongAnswerList"

type QA = { question: string; answer: string; options?: string[] }

// <<< Props 타입을 최신 로직에 맞게 정확히 수정
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
}

const QuizView = ({
    quizData,
    current,
    showAnswer,
    isMultiAnswerQuestion, // <<< 파라미터로 받기
    selectedOption,
    selectedOptions,
    wrongSet,
    shuffledOptions,
    correctAnswers,
    onOptionSelect,
    onGoToNext,
    onCheckAnswers,
}: QuizViewProps) => {
    const total = quizData.length
    const progress = Math.round(((current + 1) / total) * 100)
    const qa = quizData[current]

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
                                {/* <<< QuizCard에 필요한 모든 Props를 전달 */}
                                <QuizCard
                                    question={qa.question}
                                    correctAnswers={correctAnswers}
                                    options={shuffledOptions}
                                    showAnswer={showAnswer}
                                    isMultiAnswerQuestion={isMultiAnswerQuestion}
                                    selectedOption={selectedOption}
                                    selectedOptions={selectedOptions}
                                    onOptionSelect={onOptionSelect}
                                />
                            </div>
                        </CardContent>

                        <div className="p-4 border-t bg-white">
                            <div className="flex space-x-4">
                                {showAnswer ? (
                                    // 1. 정답이 공개된 후
                                    <Button size="lg" onClick={onGoToNext} className="flex-1">
                                        다음 문제
                                    </Button>
                                ) : isMultiAnswerQuestion ? (
                                    // 2. 정답 공개 전 & 복수 정답 문제
                                    <Button
                                        size="lg"
                                        onClick={onCheckAnswers}
                                        disabled={selectedOptions.length === 0}
                                        className="flex-1"
                                    >
                                        정답 확인
                                    </Button>
                                ) : (
                                    // 3. 정답 공개 전 & 단일 정답 문제
                                    <div className="text-center w-full text-gray-500">
                                        선지를 선택해주세요.
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 오른쪽: 오답 노트 영역 (데스크톱에서만 보임) */}
                <div className="hidden lg:block lg:w-1/3 h-full">
                    <WrongAnswerList wrongSet={wrongSet} />
                </div>
            </div>
        </main>
    )
}

export default QuizView