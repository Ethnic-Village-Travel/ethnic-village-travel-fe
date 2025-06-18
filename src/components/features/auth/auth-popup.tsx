'use client';

import { useAuthStore } from '@/store/useAuthStore';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { EnterOtpPopup } from './enter-otp-popup';
import { ForgotPasswordPopup } from './forgot-password-popup';
import { LoginPopup } from './login-popup';
import { SignupPopup } from './signup-popup';

export function AuthPopup() {
  const { isOpen, currentPopup, email, setOpen, setCurrentPopup, setEmail } = useAuthStore();

  const handleSignupClick = () => {
    setCurrentPopup('signup');
  };

  const handleForgotPasswordClick = () => {
    setCurrentPopup('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentPopup('login');
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setEmail(email);
    setCurrentPopup('enter-otp');
  };

  const handleSignupSubmit = (values: { email: string }) => {
    setEmail(values.email);
    setCurrentPopup('enter-otp');
  };

  const handleBackToForgotPassword = () => {
    setCurrentPopup('forgot-password');
  };

  const handleBackToSignup = () => {
    setCurrentPopup('signup');
  };

  const handleOtpSubmit = (otp: string) => {
    // TODO: Implement OTP verification logic
    console.log({ email, otp });
  };

  const renderContent = () => {
    switch (currentPopup) {
      case 'login':
        return <LoginPopup onSignupClick={handleSignupClick} onForgotPasswordClick={handleForgotPasswordClick} />;
      case 'signup':
        return <SignupPopup onBack={handleBackToLogin} onSubmit={handleSignupSubmit} />;
      case 'forgot-password':
        return <ForgotPasswordPopup onBack={handleBackToLogin} onSubmit={handleForgotPasswordSubmit} />;
      case 'enter-otp':
        return (
          <EnterOtpPopup
            onBack={email ? handleBackToSignup : handleBackToForgotPassword}
            onSubmit={handleOtpSubmit}
            email={email}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-[30px] p-8">{renderContent()}</DialogContent>
    </Dialog>
  );
}
