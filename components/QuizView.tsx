// src/components/QuizView.tsx

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import QuizCard from "./QuizCard"
import WrongAnswerList from "./WrongAnswerList"

type QA = { question: string; answer: string; options?: string[] }

interface QuizViewProps {
    quizData: QA[]
    current: number
    showAnswer: boolean
    selectedOption: string | null
    wrongSet: QA[]
    shuffledOptions: string[] | null
    onOptionSelect: (option: string) => void
    onShowAnswer: () => void
    onGoToNext: () => void
    onMarkAsWrong: () => void
}

const QuizView = ({
    quizData,
    current,
    showAnswer,
    selectedOption,
    wrongSet,
    shuffledOptions,
    onOptionSelect,
    onShowAnswer,
    onGoToNext,
    onMarkAsWrong,
}: QuizViewProps) => {
    const total = quizData.length
    const progress = Math.round(((current + 1) / total) * 100)
    const qa = quizData[current]
    // ▼▼▼ 이 부분을 수정했습니다 ▼▼▼
    const isMultipleChoice = !!shuffledOptions

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
                                    answer={qa.answer}
                                    options={shuffledOptions}
                                    showAnswer={showAnswer}
                                    selectedOption={selectedOption}
                                    onOptionSelect={onOptionSelect}
                                />
                            </div>
                        </CardContent>
                        <div className="p-4 border-t bg-white">
                            <div className="flex space-x-4">
                                {isMultipleChoice ? (
                                    showAnswer ? (
                                        <>
                                            <Button
                                                size="lg"
                                                variant="destructive"
                                                onClick={onMarkAsWrong}
                                                className="flex-1"
                                            >
                                                몰랐던 문제로 저장
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="default"
                                                onClick={onGoToNext}
                                                className="flex-1"
                                            >
                                                다음 문제
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-center w-full text-gray-500">
                                            선지를 선택해주세요.
                                        </div>
                                    )
                                ) : !showAnswer ? (
                                    <Button size="lg" onClick={onShowAnswer} className="flex-1">
                                        정답 보기
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="lg"
                                            variant="destructive"
                                            onClick={onMarkAsWrong}
                                            className="flex-1"
                                        >
                                            모른다
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="default"
                                            onClick={onGoToNext}
                                            className="flex-1"
                                        >
                                            안다
                                        </Button>
                                    </>
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