"use client"

import QuizContent from "@/components/QuizContent";
import {Suspense} from "react";

export default function Quiz() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QuizContent />
        </Suspense>
    )
}