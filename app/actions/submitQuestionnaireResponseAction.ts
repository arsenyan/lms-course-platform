"use server";

import { client } from "@/sanity/lib/adminClient";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";

export async function submitQuestionnaireResponseAction(params: {
    lessonId: string;
    clerkId: string;
    responses: Record<string, unknown>;
}) {
    const { lessonId, clerkId, responses } = params;
    const student = await getStudentByClerkId(clerkId);
    if (!student?.data?._id) throw new Error("Student not found");

    const flattened = Object.entries(responses).map(([fieldName, value]) => ({
        fieldName,
        value: typeof value === "string" ? value : JSON.stringify(value),
    }));

    await client.create({
        _type: "questionnaireResponse",
        student: { _type: "reference", _ref: student.data._id },
        lesson: { _type: "reference", _ref: lessonId },
        submittedAt: new Date().toISOString(),
        responses: flattened,
    });

    return { success: true };
}






