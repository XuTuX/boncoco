// components/Header.tsx
"use client";

import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function Header() {
    const router = useRouter();
    return (
        <header className="w-full py-4 bg-white shadow-md">
            <div className="container mx-auto flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => router.push('/')}

                >
                    <Home className="h-4 w-4 mr-1" />
                    홈으로
                </Button>
            </div>
        </header>
    );
}
