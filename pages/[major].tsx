import { useRouter } from "next/router";
import Link from "next/link";
import { quizByCategory } from "../data/questions";

export default function SubCategoryPage() {
    const router = useRouter();
    const { major } = router.query;

    // 타입 가드: major가 string일 때만 처리
    if (typeof major !== "string" || !quizByCategory[major]) {
        return <p className="p-10 text-center">존재하지 않는 카테고리입니다.</p>;
    }

    const subCategories = Object.keys(quizByCategory[major]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-10">{major} 카테고리 선택</h1>

            <div className="w-full max-w-md">
                {/* ✅ 전체 학습 버튼 */}
                <Link href={`/quiz?category=${encodeURIComponent(major)}&sub=all`}>
                    <button className="w-full px-8 py-4 bg-purple-700 text-white text-xl font-bold rounded-full shadow-md hover:bg-purple-800 transition transform hover:scale-105 mb-10">
                        전체 학습
                    </button>
                </Link>

                {/* ✅ 세부 카테고리 버튼 */}
                <div className="grid grid-cols-5 gap-3 justify-center">
                    {subCategories.map((sub) => (
                        <Link
                            key={sub}
                            href={`/quiz?category=${encodeURIComponent(major)}&sub=${encodeURIComponent(sub)}`}
                        >
                            <button className="aspect-square w-full bg-blue-600 text-white text-xs font-medium rounded-2xl shadow hover:bg-blue-700 transition flex items-center justify-center text-center px-2">
                                {sub}
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
