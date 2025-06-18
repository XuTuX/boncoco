// src/components/QuizCard.tsx (수정된 전체 코드)

import React from 'react'

// <<< Props 타입을 최신 로직에 맞게 정확히 수정
interface QuizCardProps {
    question: string
    correctAnswers: string[]
    options?: string[] | null
    showAnswer: boolean
    isMultiAnswerQuestion: boolean
    selectedOption: string | null
    selectedOptions: string[]
    onOptionSelect: (option: string) => void
}

export default function QuizCard({
    question,
    correctAnswers,
    options,
    showAnswer,
    isMultiAnswerQuestion, // <<< 파라미터로 받기
    selectedOption,
    selectedOptions,
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
                            const isCorrect = correctAnswers.includes(option)

                            // <<< 여기가 핵심! 문제 유형에 따라 isSelected를 다르게 계산
                            const isSelected = isMultiAnswerQuestion
                                ? selectedOptions.includes(option)
                                : selectedOption === option

                            let stateClasses = ''
                            let cursorClass = 'cursor-pointer'

                            if (showAnswer) {
                                // --- 정답 공개 후 스타일링 ---
                                cursorClass = 'cursor-default'
                                if (isCorrect) {
                                    stateClasses = 'bg-green-100 text-green-800 font-semibold border-green-400'
                                } else if (isSelected && !isCorrect) {
                                    stateClasses = 'bg-red-100 text-red-800 font-semibold border-red-400'
                                } else {
                                    stateClasses = 'text-gray-500 border-gray-200'
                                }
                                // 단일 정답 문제에서만, 다음으로 넘어가는 클릭 기능 활성화
                                if (!isMultiAnswerQuestion && isSelected) {
                                    cursorClass = 'cursor-pointer hover:opacity-80'
                                }
                            } else {
                                // --- 정답 공개 전 스타일링 ---
                                if (isSelected) {
                                    stateClasses = 'bg-blue-100 text-blue-800 border-blue-400 font-semibold'
                                } else {
                                    stateClasses = 'text-gray-700 hover:bg-gray-100 hover:border-gray-400 border-gray-200'
                                }
                            }

                            return (
                                <li
                                    key={index}
                                    onClick={() => onOptionSelect(option)}
                                    className={`
                                        text-lg py-3 px-4 rounded-lg transition-all duration-200 border
                                        ${stateClasses}
                                        ${cursorClass}
                                    `}
                                >
                                    <span className="font-medium mr-3">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {option}
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