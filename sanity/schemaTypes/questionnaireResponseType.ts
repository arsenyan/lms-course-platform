import { defineField, defineType } from "sanity";

export const questionnaireResponseType = defineType({
    name: "questionnaireResponse",
    title: "Questionnaire Response",
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
            name: "responses",
            title: "Responses",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({ name: "fieldName", title: "Field Name", type: "string" }),
                        defineField({ name: "value", title: "Value", type: "string" }),
                    ],
                },
            ],
        }),
    ],
});






