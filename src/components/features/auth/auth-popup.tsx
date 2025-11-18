'use client';

import { useAuthStore } from '@/store/useAuthStore';

import { EnterOtpPopup } from './enter-otp-popup';
import { ForgotPasswordPopup } from './forgot-password-popup';
import { LoginPopup } from './login-popup';
import { SignupPopup } from './signup-popup';

export function AuthPopup() {
  const { loginOpen, signupOpen, forgotPasswordOpen, enterOtpOpen } = useAuthStore();

  return (
    <>
      {loginOpen && <LoginPopup />}
      {signupOpen && <SignupPopup />}
      {forgotPasswordOpen && <ForgotPasswordPopup />}
      {enterOtpOpen && <EnterOtpPopup />}
    </>
  );
}
