import { type SchemaTypeDefinition } from "sanity";
import { courseType } from "./courseType";
import { moduleType } from "./moduleType";
import { lessonType } from "./lessonType";
import { instructorType } from "./instructorType";
import { blockContent } from "./blockContent";
import { studentType } from "./studentType";
import { enrollmentType } from "./enrollmentType";
import { categoryType } from "./categoryType";
import { lessonCompletionType } from "./lessonCompletionType";
import {
  quizType,
  quizQuestionType,
  quizAnswerOptionType,
} from "./quizType";
import {
  questionnaireType,
  questionnaireFieldType,
} from "./questionnaireType";
import { quizAttemptType } from "./quizAttemptType";
import { questionnaireResponseType } from "./questionnaireResponseType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    blockContent,
    studentType,
    enrollmentType,
    categoryType,
    lessonCompletionType,
    // Assessments
    quizType,
    quizQuestionType,
    quizAnswerOptionType,
    questionnaireType,
    questionnaireFieldType,
    quizAttemptType,
    questionnaireResponseType,
  ],
};

export * from "./courseType";
export * from "./moduleType";
export * from "./lessonType";
export * from "./instructorType";
export * from "./studentType";
export * from "./enrollmentType";
export * from "./categoryType";
export * from "./lessonCompletionType";
