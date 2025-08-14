'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function ConsentPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      const consentGiven = Boolean(user?.unsafeMetadata?.democraticConsent);
      if (consentGiven) {
        router.replace('/');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleSubmit = async () => {
    if (!isChecked) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (isSignedIn && user) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            democraticConsent: true,
            democraticConsentAt: new Date().toISOString(),
          },
        });
        router.replace('/');
      } else {
        document.cookie = 'pre_signup_consent=1; Path=/; Max-Age=1800; SameSite=Lax';
        router.replace('/sign-up');
      }
    } catch {
      setError('Не удалось сохранить согласие. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="container mx-auto mt-20 max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Согласие с демократическими принципами</h1>
      <div className="prose dark:prose-invert mb-6">
        <p>
          Перед регистрацией и использованием платформы, пожалуйста, подтвердите, что вы
          поддерживаете и соблюдаете базовые демократические принципы, включая уважение к правам
          человека, верховенство закона, свободу выражения мнений и недопустимость дискриминации.
        </p>
      </div>

      <label className="flex items-start gap-3 mb-6">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={isChecked}
          onChange={e => setIsChecked(e.target.checked)}
        />
        <span>
          Я подтверждаю согласие с демократическими принципами и принимаю обязательства их
          соблюдать.
        </span>
      </label>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <Button onClick={handleSubmit} disabled={!isChecked || isSubmitting}>
        {isSubmitting
          ? 'Сохраняем...'
          : isSignedIn
          ? 'Согласен(на) и продолжить'
          : 'Согласен(на) и перейти к регистрации'}
      </Button>
    </div>
  );
}
