// src/components/QuizCard.tsx (최종 전체 코드)

import React from 'react'

interface QuizCardProps {
    question: string
    correctAnswers: string[]
    options?: string[] | null
    showAnswer: boolean
    isMultiAnswerQuestion: boolean
    selectedOption: string | null
    selectedOptions: string[]
    onOptionSelect: (option: string) => void
    isMultipleChoice: boolean // 객관식 여부를 판단하는 prop
}

export default function QuizCard({
    question,
    correctAnswers,
    options,
    showAnswer,
    isMultiAnswerQuestion,
    selectedOption,
    selectedOptions,
    onOptionSelect,
    isMultipleChoice, // prop 받기
}: QuizCardProps) {

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-inner flex flex-col flex-grow">
            {/* 질문 표시 영역 */}
            <div className="mb-4">
                <p className="text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
                    Q. {question}
                </p>
            </div>

            {/* 객관식일 때만 선지 목록 렌더링 */}
            {isMultipleChoice && options && (
                <div className="mb-6">
                    <ul className="space-y-3">
                        {options.map((option, index) => {
                            const isCorrect = correctAnswers.includes(option)
                            const isSelected = isMultiAnswerQuestion
                                ? selectedOptions.includes(option)
                                : selectedOption === option

                            let stateClasses = ''
                            let cursorClass = 'cursor-pointer'

                            if (showAnswer) {
                                cursorClass = 'cursor-default'
                                if (isCorrect) {
                                    stateClasses = 'bg-green-100 text-green-800 font-semibold border-green-400'
                                } else if (isSelected && !isCorrect) {
                                    stateClasses = 'bg-red-100 text-red-800 font-semibold border-red-400'
                                } else {
                                    stateClasses = 'text-gray-500 border-gray-200'
                                }
                                if (!isMultiAnswerQuestion && isSelected) {
                                    cursorClass = 'cursor-pointer hover:opacity-80'
                                }
                            } else {
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
                                    className={`text-lg py-3 px-4 rounded-lg transition-all duration-200 border ${stateClasses} ${cursorClass}`}
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

            {/* 정답 공개 시 구분선 및 정답 표시 */}
            {showAnswer && <hr className="border-t border-gray-300 my-4" />}

            {showAnswer && (
                <div className="mt-auto">
                    <p className="text-gray-800 font-semibold text-xl tracking-wide">
                        정답: <span className="text-green-600 text-xl tracking-wider">{correctAnswers.join(' / ')}</span>
                    </p>
                </div>
            )}
        </div>
    )
}