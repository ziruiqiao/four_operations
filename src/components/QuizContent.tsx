"use client"

import {useRouter, useSearchParams} from "next/navigation";
import {useState, useEffect} from "react";

interface Question {
    question: string;
    answer: number;
}

export default function QuizContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const numQuestions = Number(searchParams.get("num")) || 10;
    const maxNum = Number(searchParams.get("max")) || 10;
    const minNum = Number(searchParams.get("min")) || -10;
    const numOfNumber = Number(searchParams.get("num_of_num")) || 2;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [result, setResult] = useState<{correct: number; totalTime: number} | null>(null);

    useEffect(() => {
        if (!numQuestions) return;
        setQuestions(generateQuestions(numQuestions, minNum, maxNum, numOfNumber));
        setUserAnswers(new Array(numQuestions).fill(""));
        setStartTime(Date.now());

        const timer = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
          }, 1000);
        return () => clearInterval(timer);
    }, [numQuestions]);

    function generateQuestions(n: number, minNum: number, maxNum: number, numCount: number): Question[] {
        const ops = ["+", "-", "*", '/'];
        
        return Array.from({ length: n}, () => {
            const numbers = Array.from({ length: numCount}, () => 
                Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
            );
            const operators = Array.from({ length: numCount - 1}, () => 
                ops[Math.floor(Math.random() * ops.length)]
            );

            for (let i = 0; i < operators.length; i++) {
                if (operators[i] === "/" && numbers[i + 1] === 0) {
                    numbers[i + 1] = Math.floor(Math.random() * (maxNum - minNum)) + minNum + 1; // Ensure non-zero
                }
            }

            let expression = "";
            const useParentheses = Math.random() < 0.5; // Randomly decide if we use parentheses
            const useBrackets = Math.random() < 0.5; // Randomly decide if we use brackets

            if ((useParentheses || useBrackets) && numbers.length >= 3) {
                const groupStart = Math.floor(Math.random() * (numCount - 1)); // Start of grouping
                const groupEnd = Math.floor(Math.random() * (numCount - groupStart - 1)) + groupStart + 1; // End of grouping
                
                const openingSymbol = useParentheses ? "(" : "[";
                const closingSymbol = useParentheses ? ")" : "]";

                for (let i = 0; i < numbers.length; i++) {
                    if (i === groupStart) expression += openingSymbol; // Open grouping

                    if (numbers[i] < 0) expression += `(${numbers[i]})`;
                    else expression += numbers[i];

                    if (i === groupEnd) expression += closingSymbol; // Close grouping

                    if (i < operators.length) {
                        expression += ` ${operators[i]} `;
                    }
                }
            } else {
                for (let i = 0; i < numbers.length; i++) {
                    if (numbers[i] < 0) expression += `(${numbers[i]})`;
                    else expression += numbers[i];

                    if (i < operators.length) {
                        expression += ` ${operators[i]} `;
                    }
                }
            }

            // Convert square brackets to parentheses for eval()
            const evalExpression = expression.replace(/\[/g, "(").replace(/\]/g, ")");

            let answer: number;
            try {
                answer = eval(evalExpression);
                if (evalExpression.includes("/")) answer = parseFloat(answer.toFixed(2));
            } catch {
                answer = NaN; // Handle any unexpected eval errors
            }
            return {question: expression, answer};
        });
    }

    function submitAnswers() {
        const correct = questions.filter((q, i) => Number(userAnswers[i]) === q.answer).length;
        const totalTime = (Date.now() - startTime) / 1000;
        setResult({ correct, totalTime});
    }

    function handleAnswerChange(index: number, value: string) {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-grey-100 p-4 text-black">
            <h1 className="text-3xl font-bold mb-4">Questions</h1>

            {/* Timer display */}
            <div className="mb-4 bg-blue-200 px-4 py-2 rounded-md text-lg font-semibold">
            ⏳ Time: {elapsedTime} s
            </div>

            {questions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-8xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {questions.map((q, index) => (
                        <div 
                            key={index} 
                            className="p-4 pe-10 bg-gray-100 rounded-lg shadow 
                                        flex items-center justify-between 
                                        text-lg font-medium whitespace-nowrap">
                            {/* Ensure question and input stay on the same line */}
                            <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                                {q.question.split("=")[0]} =
                            </span>
                            <input
                                type="text"
                                value={userAnswers[index]}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                className="border border-gray-300 p-1 rounded w-16 text-center ml-2"
                            />
                        </div>
                        ))}
                    </div>
                    <button
                        onClick={submitAnswers}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >Submit</button>
                </div>
            )}

            {result && (
                <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-md">
                <p className="text-lg">Correct Rate: {result.correct} / {questions.length}</p>
                <p className="text-lg">Total Time: {result.totalTime.toFixed(2)} s</p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                    Go Back
                </button>
                </div>
            )}
        </div>
    )
}