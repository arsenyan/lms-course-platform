import { defineField, defineType } from "sanity";

export const questionnaireFieldType = defineType({
    name: "questionnaireField",
    title: "Questionnaire Field",
    type: "object",
    fields: [
        defineField({
            name: "label",
            title: "Label",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "name",
            title: "Field Name",
            type: "string",
            description: "Unique identifier for this field",
            validation: (rule) => rule.required().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
        }),
        defineField({
            name: "type",
            title: "Type",
            type: "string",
            options: {
                list: [
                    { title: "Short Text", value: "shortText" },
                    { title: "Long Text", value: "longText" },
                    { title: "Single Choice", value: "singleChoice" },
                    { title: "Multiple Choice", value: "multipleChoice" },
                    { title: "Number", value: "number" },
                    { title: "Date", value: "date" },
                    { title: "Boolean", value: "boolean" },
                ],
                layout: "dropdown",
            },
            initialValue: "shortText",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "options",
            title: "Options",
            type: "array",
            of: [{ type: "string" }],
            hidden: ({ parent }) =>
                !parent || (parent.type !== "singleChoice" && parent.type !== "multipleChoice"),
        }),
        defineField({
            name: "required",
            title: "Required",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "placeholder",
            title: "Placeholder",
            type: "string",
            hidden: ({ parent }) => !parent || parent.type !== "shortText",
        }),
        defineField({
            name: "helpText",
            title: "Help Text",
            type: "string",
        }),
    ],
    preview: {
        select: { title: "label", type: "type" },
        prepare({ title, type }) {
            return { title, subtitle: type };
        },
    },
});

export const questionnaireType = defineType({
    name: "questionnaire",
    title: "Questionnaire",
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
            name: "fields",
            title: "Fields",
            type: "array",
            of: [{ type: "questionnaireField" }],
            validation: (rule) => rule.min(1),
        }),
    ],
    preview: {
        select: { title: "title", fields: "fields" },
        prepare({ title, fields }) {
            return {
                title: title || "Questionnaire",
                subtitle: `${fields?.length || 0} field(s)`,
            };
        },
    },
});






