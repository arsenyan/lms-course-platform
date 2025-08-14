'use client';

import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { submitQuizAttemptAction } from '@/app/actions/submitQuizAttemptAction';

type QuizAnswerOption = {
  text: string;
  isCorrect?: boolean;
};

type QuizQuestion = {
  question: string;
  answerOptions: QuizAnswerOption[];
  explanation?: string;
  points?: number;
  required?: boolean;
};

type QuizProps = {
  quiz: {
    title?: string;
    description?: string;
    shuffleQuestions?: boolean;
    passScore?: number; // percent
    questions: QuizQuestion[];
  };
  lessonId?: string;
  clerkId?: string;
};

export function Quiz({ quiz, lessonId, clerkId }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const questions = useMemo(() => {
    if (!quiz?.questions) return [] as QuizQuestion[];
    if (!quiz.shuffleQuestions) return quiz.questions;
    // simple shuffle copy
    const arr = [...quiz.questions];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [quiz]);

  const scoreInfo = useMemo(() => {
    if (!submitted) return null as null | { correct: number; total: number; percent: number };
    let correct = 0;
    let total = 0;
    questions.forEach((q, qIndex) => {
      const answerIndex = selectedAnswers[qIndex];
      const hasAnswer = typeof answerIndex === 'number';
      const isCorrect = hasAnswer ? Boolean(q.answerOptions?.[answerIndex || 0]?.isCorrect) : false;
      const points = q.points ?? 1;
      total += points;
      if (isCorrect) correct += points;
    });
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  }, [submitted, questions, selectedAnswers]);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    // simple required check
    const missingRequired = questions.some(
      (q, i) => (q.required ?? true) && typeof selectedAnswers[i] !== 'number'
    );
    if (missingRequired) {
      alert('Please answer all required questions.');
      return;
    }
    // If we have identities, persist attempt
    if (lessonId && clerkId) {
      try {
        setPending(true);
        let correctPoints = 0;
        let totalPoints = 0;
        const answers = questions.map((q, qIndex) => {
          const optIndex = (selectedAnswers[qIndex] as number) ?? -1;
          const isCorrect = Boolean(q.answerOptions?.[optIndex]?.isCorrect);
          const points = q.points ?? 1;
          totalPoints += points;
          if (isCorrect) correctPoints += points;
          return { questionIndex: qIndex, selectedOptionIndex: optIndex, isCorrect };
        });
        const scorePercent = totalPoints > 0 ? Math.round((correctPoints / totalPoints) * 100) : 0;
        await submitQuizAttemptAction({
          lessonId,
          clerkId,
          answers,
          scorePercent,
          scorePoints: correctPoints,
          totalPoints,
        });
      } finally {
        setPending(false);
      }
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedAnswers({});
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        {quiz.title && <h2 className="text-xl font-semibold">{quiz.title}</h2>}
        {quiz.description && (
          <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedIndex = selectedAnswers[qIndex] ?? null;
          const hasSelected = typeof selectedIndex === 'number';
          const isCorrect = hasSelected
            ? Boolean(q.answerOptions?.[selectedIndex || 0]?.isCorrect)
            : false;
          return (
            <div key={`${q.question}-${qIndex}`} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium">
                  {qIndex + 1}. {q.question}
                  {(q.required ?? true) && <span className="text-red-500"> *</span>}
                </p>
                {submitted && (
                  <span className={isCorrect ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {q.answerOptions?.map((opt, optionIndex) => {
                  const checked = selectedIndex === optionIndex;
                  const showCorrectness = submitted && optionIndex === selectedIndex;
                  return (
                    <label
                      key={`${qIndex}-${optionIndex}-${opt.text}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        checked={checked}
                        onChange={() => handleSelect(qIndex, optionIndex)}
                        disabled={submitted}
                        className="accent-blue-600"
                      />
                      <span>{opt.text}</span>
                      {showCorrectness && (
                        <span className="text-xs text-muted-foreground">
                          {opt.isCorrect ? '(correct)' : '(your answer)'}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <p className="text-sm text-muted-foreground">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-6">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleReset}>
              Try Again
            </Button>
            {scoreInfo && (
              <p className="text-sm text-muted-foreground">
                Score: {scoreInfo.correct}/{scoreInfo.total} ({scoreInfo.percent}%)
                {typeof quiz.passScore === 'number' && (
                  <> {scoreInfo.percent >= quiz.passScore ? '- Passed' : '- Not passed'}</>
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
