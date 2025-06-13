import React from 'react';

interface QuizCardProps {
    question: string;
    answer: string;
    showAnswer: boolean;
}

export default function QuizCard({ question, answer, showAnswer }: QuizCardProps) {
    return (
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-inner mb-4 flex flex-col justify-between min-h-48">
            {/* Question Area */}
            <div className="mb-4">
                <p className="text-xl font-bold text-gray-800 leading-relaxed">{question}</p>
            </div>

            {/* Separator and Answer Area (conditionally rendered) */}
            {showAnswer && (
                <>
                    <hr className="border-t-2 border-gray-300 my-4" /> {/* Visual separator */}
                    <div className="mt-auto"> {/* Pushes the answer to the bottom if content is short */}
                        <p className="text-blue-700 font-extrabold bg-blue-50 p-3 rounded-md border border-blue-200 animate-fadeIn">
                            정답: {answer}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

