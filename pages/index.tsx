// pages/index.tsx
import Link from "next/link";
import { quizByCategory } from "../data/questions";

export default function Home() {
  const categories = Object.keys(quizByCategory);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10">퀴즈 카테고리 선택</h1>
      <div className="w-full max-w-md">
        {/* ✅ 전체 학습 버튼 */}
        <Link href="/quiz?category=all">
          <button className="w-full px-8 py-4 bg-purple-700 text-white text-xl font-bold rounded-full shadow-md hover:bg-purple-800 transition transform hover:scale-105 mb-10">
            전체 학습
          </button>
        </Link>

        {/* ✅ 5열 정사각형 카테고리 버튼 */}
        <div className="grid grid-cols-5 gap-3 justify-center">
          {categories.map((category) => (
            <Link key={category} href={`/quiz?category=${encodeURIComponent(category)}`}>
              <button className="aspect-square w-full bg-blue-600 text-white text-xs font-medium rounded-2xl shadow hover:bg-blue-700 transition flex items-center justify-center text-center px-2">
                {category}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
