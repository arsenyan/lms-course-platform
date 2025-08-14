"use server";

import { client } from "@/sanity/lib/adminClient";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";

type Answer = {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
};

export async function submitQuizAttemptAction(params: {
    lessonId: string;
    clerkId: string;
    answers: Answer[];
    scorePercent: number;
    scorePoints: number;
    totalPoints: number;
}) {
    const { lessonId, clerkId, answers, scorePercent, scorePoints, totalPoints } = params;
    const student = await getStudentByClerkId(clerkId);
    if (!student?.data?._id) throw new Error("Student not found");

    await client.create({
        _type: "quizAttempt",
        student: { _type: "reference", _ref: student.data._id },
        lesson: { _type: "reference", _ref: lessonId },
        submittedAt: new Date().toISOString(),
        answers,
        scorePercent,
        scorePoints,
        totalPoints,
    });

    return { success: true };
}






