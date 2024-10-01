"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ClipLoader from "react-spinners/ClipLoader";
import he from "he";

export default function Home() {
  const [displayName, setDisplayName] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple"
        );
        const data = await response.json();
        const decodedQuestions = data.results.map((question: any) => ({
          ...question,
          question: he.decode(question.question),
          correct_answer: he.decode(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map((answer: string) =>
            he.decode(answer)
          ),
        }));
        setQuestions(decodedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!displayName) {
      fetchQuestions();
    }
  }, [displayName]);

  const handleEnter = async () => {
    if (!name) {
      return;
    }
    setDisplayName(false);
    const welcome = name.charAt(0).toLocaleUpperCase() + name.slice(1);
    setName(welcome);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === questions[currentIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedAnswer("");

    if (currentIndex === questions.length - 1) {
      setShowScore(true);
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-teal-300 to-teal-700">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Quiz App</CardTitle>
        </CardHeader>
        <CardContent>
          {displayName ? (
            <div className="enter-name flex gap-2">
              <Input
                type="string"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Button onClick={handleEnter}>Enter</Button>
            </div>
          ) : loading ? (
            <div className="loading w-full flex items-center justify-center">
              <ClipLoader />
            </div>
          ) : showScore ? (
            <div className="score-container text-center">
              <h1 className="font-bold text-lg">Quiz Completed!</h1>
              <p className="mt-4">
                {name}, your score is: {score} out of {questions.length}
              </p>
            </div>
          ) : questions.length > 0 ? (
            <div className="quiz-container">
              <h1 className=" text-center font-semibold -translate-y-5">Welcome {name}</h1>
              <h1 className="text-center font-bold mb-2">
                Question {currentIndex + 1}
              </h1>
              <p className="mb-4">{questions[currentIndex].question}</p>
              <RadioGroup
                value={selectedAnswer}
                onValueChange={(value) => setSelectedAnswer(value)}
              >
                {[...questions[currentIndex].incorrect_answers, questions[currentIndex].correct_answer]
                  .sort()
                  .map((answer, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 w-full rounded-lg p-2 hover:opacity-70 cursor-pointer"
                    >
                      <RadioGroupItem value={answer} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{answer}</Label>
                    </div>
                  ))}
              </RadioGroup>
              <Button className="mt-6 w-full" onClick={handleNextQuestion}>
                {currentIndex === questions.length - 1 ? "Save & Finish" : "Next"}
              </Button>
            </div>
          ) : (
            <div>No questions available. Please try again later.</div>
          )}
        </CardContent>
        <CardFooter>
          {displayName && !name && (
            <h1 className="text-red-600 font-bold">
              Please enter your name to begin.
            </h1>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}


