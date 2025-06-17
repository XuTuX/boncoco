// src/components/WrongAnswerList.tsx

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

// QA 타입을 외부에서 import 하거나, 여기서 다시 정의할 수 있습니다.
// 여기서는 간단하게 인라인으로 정의하겠습니다.
type QA = { question: string; answer: string; options?: string[] }

interface WrongAnswerListProps {
    wrongSet: QA[]
}

const WrongAnswerList = ({ wrongSet }: WrongAnswerListProps) => {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>오답 노트</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
                {wrongSet.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        아직 틀린 문제가 없습니다.
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {wrongSet.map((q, i) => (
                            <li key={i} className="text-sm border-b pb-2">
                                <p className="font-semibold text-gray-800">Q. {q.question}</p>
                                <p className="text-green-600 font-medium">A. {q.answer}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

export default WrongAnswerList