import { defineField, defineType } from "sanity";

export const quizAttemptType = defineType({
    name: "quizAttempt",
    title: "Quiz Attempt",
    type: "document",
    fields: [
        defineField({
            name: "student",
            title: "Student",
            type: "reference",
            to: [{ type: "student" }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "lesson",
            title: "Lesson",
            type: "reference",
            to: [{ type: "lesson" }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "submittedAt",
            title: "Submitted At",
            type: "datetime",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "answers",
            title: "Answers",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({ name: "questionIndex", title: "Question Index", type: "number" }),
                        defineField({ name: "selectedOptionIndex", title: "Selected Option Index", type: "number" }),
                        defineField({ name: "isCorrect", title: "Is Correct", type: "boolean" }),
                    ],
                },
            ],
        }),
        defineField({
            name: "scorePercent",
            title: "Score (%)",
            type: "number",
        }),
        defineField({
            name: "scorePoints",
            title: "Score (points)",
            type: "number",
        }),
        defineField({
            name: "totalPoints",
            title: "Total Points",
            type: "number",
        }),
    ],
});






