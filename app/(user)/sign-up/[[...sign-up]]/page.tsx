'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <SignUp afterSignUpUrl="/" routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
