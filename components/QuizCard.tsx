// src/components/QuizCard.tsx (수정된 전체 코드)

import React from 'react'
import { Button } from './ui/button' // shadcn/ui Button을 사용한다고 가정

interface QuizCardProps {
    question: string
    correctAnswers: string[] // 1. 타입을 string[]로 명시
    options?: string[] | null
    showAnswer: boolean
    selectedOption: string | null
    onOptionSelect: (option: string) => void
}

export default function QuizCard({
    question,
    correctAnswers, // 2. 불필요한 쉼표 제거
    options,
    showAnswer,
    selectedOption,
    onOptionSelect,
}: QuizCardProps) {
    const isMultipleChoice = options && options.length > 0

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-inner flex flex-col flex-grow">
            <div className="mb-4">
                <p className="text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
                    Q. {question}
                </p>
            </div>

            {isMultipleChoice && (
                <div className="mb-6">
                    <ul className="space-y-3">
                        {options.map((option, index) => {
                            // --- 3. 정답 확인 및 스타일링 로직 수정 ---
                            const isCorrect = correctAnswers.includes(option)
                            const isSelected = option === selectedOption

                            let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'outline'
                            let cursorClass = 'cursor-pointer'

                            if (showAnswer) {
                                cursorClass = 'cursor-default' // 정답 공개 후엔 기본적으로 클릭 비활성화
                                if (isCorrect) {
                                    variant = 'secondary' // 정답인 모든 보기는 초록색 계열로
                                }
                                if (isSelected && !isCorrect) {
                                    variant = 'destructive' // 내가 선택한 오답은 빨간색 계열로
                                }
                                // 내가 선택한 옵션만 다시 클릭(다음으로 넘어가기) 가능하도록 커서 변경
                                if (isSelected) {
                                    cursorClass = 'cursor-pointer hover:opacity-80'
                                }
                            }

                            return (
                                // shadcn/ui의 Button 컴포넌트를 사용하면 스타일링이 더 일관됩니다.
                                <li key={index}>
                                    <Button
                                        variant={variant}
                                        onClick={() => onOptionSelect(option)}
                                        className={`w-full h-auto text-lg justify-start py-3 px-4 ${cursorClass}`}
                                        disabled={showAnswer && !isSelected} // 정답 공개 후 선택한 것 외엔 비활성화
                                    >
                                        <span className="font-medium mr-3 text-left">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        <span className="text-left whitespace-normal">{option}</span>
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

            {showAnswer && !isMultipleChoice && <hr className="border-t border-gray-300 my-4" />}

            {showAnswer && !isMultipleChoice && (
                <div className="mt-auto">
                    <p className="text-gray-800 font-semibold text-xl tracking-wide">
                        정답: <span className="text-green-600 text-xl tracking-wider">{correctAnswers.join(' / ')}</span>
                    </p>
                </div>
            )}
        </div>
    )
}