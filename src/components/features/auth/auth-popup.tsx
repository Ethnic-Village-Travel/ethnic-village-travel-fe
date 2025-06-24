'use client';

import { EnterOtpPopup } from './enter-otp-popup';
import { ForgotPasswordPopup } from './forgot-password-popup';
import { LoginPopup } from './login-popup';
import { SignupPopup } from './signup-popup';

export function AuthPopup() {
  return (
    <>
      <LoginPopup />
      <SignupPopup />
      <ForgotPasswordPopup />
      <EnterOtpPopup />
    </>
  );
}
