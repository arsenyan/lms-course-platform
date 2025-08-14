'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { submitQuestionnaireResponseAction } from '@/app/actions/submitQuestionnaireResponseAction';

type QuestionnaireField = {
  label: string;
  name: string;
  type:
    | 'shortText'
    | 'longText'
    | 'singleChoice'
    | 'multipleChoice'
    | 'number'
    | 'date'
    | 'boolean';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  helpText?: string;
};

type QuestionnaireProps = {
  questionnaire: {
    title?: string;
    description?: string;
    fields: QuestionnaireField[];
  };
  lessonId?: string;
  clerkId?: string;
};

export function Questionnaire({ questionnaire, lessonId, clerkId }: QuestionnaireProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const updateValue = (name: string, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // required validation
    const missing = questionnaire.fields?.some(
      f => f.required && (values[f.name] === undefined || values[f.name] === '')
    );
    if (missing) {
      alert('Please complete all required fields.');
      return;
    }
    try {
      setPending(true);
      if (lessonId && clerkId) {
        await submitQuestionnaireResponseAction({ lessonId, clerkId, responses: values });
      }
      setSubmitted(true);
    } finally {
      setPending(false);
    }
  };

  if (!questionnaire?.fields?.length) return null;

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        {questionnaire.title && <h2 className="text-xl font-semibold">{questionnaire.title}</h2>}
        {questionnaire.description && (
          <p className="text-sm text-muted-foreground mt-1">{questionnaire.description}</p>
        )}
      </div>

      <div className="space-y-5">
        {questionnaire.fields.map(field => {
          const value = values[field.name];
          return (
            <div key={field.name} className="space-y-1">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
              {field.type === 'shortText' && (
                <input
                  type="text"
                  value={(value as string) || ''}
                  onChange={e => updateValue(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border rounded px-3 py-2 bg-background"
                  disabled={submitted}
                />
              )}
              {field.type === 'longText' && (
                <textarea
                  value={(value as string) || ''}
                  onChange={e => updateValue(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border rounded px-3 py-2 bg-background min-h-28"
                  disabled={submitted}
                />
              )}
              {field.type === 'number' && (
                <input
                  type="number"
                  value={value as number | undefined}
                  onChange={e =>
                    updateValue(
                      field.name,
                      e.target.value === '' ? undefined : Number(e.target.value)
                    )
                  }
                  className="w-full border rounded px-3 py-2 bg-background"
                  disabled={submitted}
                />
              )}
              {field.type === 'date' && (
                <input
                  type="date"
                  value={(value as string) || ''}
                  onChange={e => updateValue(field.name, e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-background"
                  disabled={submitted}
                />
              )}
              {field.type === 'boolean' && (
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={e => updateValue(field.name, e.target.checked)}
                    disabled={submitted}
                    className="accent-blue-600"
                  />
                  <span>Yes</span>
                </label>
              )}
              {field.type === 'singleChoice' && (
                <div className="space-y-1">
                  {field.options?.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        checked={value === opt}
                        onChange={() => updateValue(field.name, opt)}
                        disabled={submitted}
                        className="accent-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'multipleChoice' && (
                <div className="space-y-1">
                  {field.options?.map(opt => {
                    const selected = Array.isArray(value)
                      ? (value as string[]).includes(opt)
                      : false;
                    const toggle = () => {
                      const current = Array.isArray(value) ? (value as string[]) : [];
                      if (current.includes(opt)) {
                        updateValue(
                          field.name,
                          current.filter(v => v !== opt)
                        );
                      } else {
                        updateValue(field.name, [...current, opt]);
                      }
                    };
                    return (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={toggle}
                          disabled={submitted}
                          className="accent-blue-600"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-6">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
          </Button>
        ) : (
          <p className="text-sm text-green-700">Thanks! Your response has been submitted.</p>
        )}
      </div>
    </div>
  );
}
