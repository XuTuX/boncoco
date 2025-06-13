// pages/index.tsx
import Link from "next/link";
import { quizByCategory } from "../data/questions";

export default function Home() {
  const majorCategories = Object.keys(quizByCategory);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10">퀴즈 대분류 선택</h1>
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {majorCategories.map((major) => (
          <Link key={major} href={`/${encodeURIComponent(major)}`}>
            <button className="w-full py-5 bg-indigo-600 text-white text-xl rounded-xl hover:bg-indigo-700 transition">
              {major}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
