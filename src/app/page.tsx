"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
    const [numQuestions, setNumQuestions] = useState(10);
    const [maxNum, setMaxNum] = useState(30);
    const [minNum, setMinNum] = useState(0);
    const [numOfNumber, setNumOfNumber] = useState(2);
    const router = useRouter();

    const startQuiz = () => {
        router.push(`/quiz?num=${numQuestions}&max=${maxNum}&min=${minNum}&num_of_num=${numOfNumber}`)
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-grey-100 p-4">
            <h1 className="text-3xl font-bold mb-4">
                The Four Operations Practices
            </h1>
            <div className="bg-white p-6 rounded-lg shadow-md text-black">
                <label className="block text-lg font-medium mb-2">
                    Number of Quesitons: 
                </label>
                <input 
                    type="number" min="1" max="50" value={numQuestions === null ? "" : numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="border border-gray-300 p-2 rounded w-full"
                />
                <label className="block text-lg font-medium mb-2">
                    Range of Number: 
                </label>
                <div className="flex-row">
                    <input 
                        type="number" value={minNum === null ? "" : minNum}
                        onChange={(e) => setMinNum(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded w-1/5"
                    />
                    &nbsp;&nbsp;-&nbsp;&nbsp;
                    <input 
                        type="number" value={maxNum === null ? "" : maxNum}
                        onChange={(e) => setMaxNum(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded w-1/5"
                    />
                </div>
                <label className="block text-lg font-medium mb-2">
                    Number of Numbers: 
                </label>
                <input 
                    type="number" min="2" max="10" value={numOfNumber === null ? "" : numOfNumber}
                    onChange={(e) => setNumOfNumber(Number(e.target.value))}
                    className="border border-gray-300 p-2 rounded w-full"
                />
                <button onClick={startQuiz} className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Start Practice
                </button>
            </div>
        </div>
    )
}