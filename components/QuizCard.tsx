
// QuizCard.tsx

import React from 'react';

interface QuizCardProps {
    question: string;
    answer: string;
    options?: string[];
    showAnswer: boolean;
    selectedOption: string | null;
    onOptionSelect: (option: string) => void;
}

export default function QuizCard({ question, answer, options, showAnswer, selectedOption, onOptionSelect }: QuizCardProps) {
    const isMultipleChoice = options && options.length > 0;

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
                            let optionClass = 'text-gray-700';

                            // --- 여기부터 스타일 로직 변경 ---
                            let cursorClass = 'cursor-default'; // 기본적으로는 클릭 비활성화

                            if (showAnswer) {
                                if (option === answer) {
                                    optionClass = 'bg-green-100 text-green-800 font-semibold border-green-400';
                                } else if (option === selectedOption) {
                                    optionClass = 'bg-red-100 text-red-800 font-semibold border-red-400';
                                } else {
                                    optionClass = 'text-gray-500 border-gray-200';
                                }

                                // 답이 공개된 후, 내가 선택했던 옵션에만 포인터 커서를 표시
                                if (option === selectedOption) {
                                    cursorClass = 'cursor-pointer hover:opacity-80';
                                }

                            } else {
                                // 답을 보기 전에는 모든 옵션이 클릭 가능
                                optionClass = 'text-gray-700 hover:bg-gray-100 hover:border-gray-400 border-gray-200';
                                cursorClass = 'cursor-pointer';
                            }
                            // --- 여기까지 스타일 로직 변경 ---

                            return (
                                <li
                                    key={index}
                                    // onClick에서 !showAnswer 조건 제거
                                    onClick={() => onOptionSelect(option)}
                                    className={`
                                        text-lg py-3 px-4 rounded-lg transition-all duration-200 border
                                        ${optionClass}
                                        ${cursorClass}
                                    `}
                                >
                                    <span className="font-medium mr-3">
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {option}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {showAnswer && !isMultipleChoice && <hr className="border-t border-gray-300 my-4" />}

            {showAnswer && !isMultipleChoice && (
                <div className="mt-auto">
                    <p className="text-gray-800 font-semibold text-xl tracking-wide">
                        정답: <span className="text-green-600 text-xl tracking-wider">{answer}</span>
                    </p>
                </div>
            )}
        </div>

    );
}