import { defineField, defineType } from "sanity";

export const quizAnswerOptionType = defineType({
    name: "quizAnswerOption",
    title: "Answer Option",
    type: "object",
    fields: [
        defineField({
            name: "text",
            title: "Text",
            type: "string",
            validation: (rule) => rule.required().min(1),
        }),
        defineField({
            name: "isCorrect",
            title: "Is Correct",
            type: "boolean",
            initialValue: false,
        }),
    ],
    preview: {
        select: { title: "text", isCorrect: "isCorrect" },
        prepare({ title, isCorrect }) {
            return {
                title: title || "Option",
                subtitle: isCorrect ? "Correct" : "",
            };
        },
    },
});

export const quizQuestionType = defineType({
    name: "quizQuestion",
    title: "Quiz Question",
    type: "object",
    fields: [
        defineField({
            name: "question",
            title: "Question",
            type: "string",
            validation: (rule) => rule.required().min(5),
        }),
        defineField({
            name: "answerOptions",
            title: "Answer Options",
            type: "array",
            of: [{ type: "quizAnswerOption" }],
            validation: (rule) => rule.min(2),
        }),
        defineField({
            name: "explanation",
            title: "Explanation (optional)",
            type: "text",
            description: "Shown after answering to explain the correct answer.",
        }),
        defineField({
            name: "points",
            title: "Points",
            type: "number",
            initialValue: 1,
            validation: (rule) => rule.min(0),
        }),
        defineField({
            name: "required",
            title: "Required",
            type: "boolean",
            initialValue: true,
        }),
    ],
    preview: {
        select: { title: "question", options: "answerOptions" },
        prepare({ title, options }) {
            return {
                title: title || "Question",
                subtitle: `${options?.length || 0} option(s)`,
            };
        },
    },
});

export const quizType = defineType({
    name: "quiz",
    title: "Quiz",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "shuffleQuestions",
            title: "Shuffle Questions",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "passScore",
            title: "Passing Score (%)",
            type: "number",
            description: "Minimum percentage needed to pass this quiz.",
            validation: (rule) => rule.min(0).max(100),
        }),
        defineField({
            name: "questions",
            title: "Questions",
            type: "array",
            of: [{ type: "quizQuestion" }],
            validation: (rule) => rule.min(1),
        }),
    ],
    preview: {
        select: { title: "title", questions: "questions" },
        prepare({ title, questions }) {
            return {
                title: title || "Quiz",
                subtitle: `${questions?.length || 0} question(s)`,
            };
        },
    },
});






