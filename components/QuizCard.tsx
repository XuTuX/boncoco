import React from 'react';

interface QuizCardProps {
    question: string;
    answer: string;
    showAnswer: boolean;
}

export default function QuizCard({ question, answer, showAnswer }: QuizCardProps) {
    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-inner mb-4 flex flex-col min-h-48">
            {/* Question Area */}
            <div className="mb-4">
                <p className="text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
                    {question}
                </p>
            </div>

            {/* Separator */}
            {showAnswer && <hr className="border-t border-gray-300 my-4" />}

            {/* Answer Area */}
            {showAnswer && (
                <div className="mt-auto">
                    <p className="text-gray-800 font-semibold text-xl tracking-wide">
                        정답: <span className="text-green-600 text-2xl tracking-wider">{answer}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
