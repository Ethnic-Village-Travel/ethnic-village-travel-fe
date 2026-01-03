'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/classnames';
import { AlertCircle, Mail, Phone, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { validateContactInfo } from '@/libs/schemas/booking.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { BOOKING_STEPS, useBookingWizard } from '../booking-wizard-context';
import { WizardNavigation } from '../wizard-navigation';

export type ContactInfoStepProps = {
  onNext?: () => void;
  onBack?: () => void;
}

type FormFieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

function FormField({ id, label, icon, value, onChange, error, type = 'text', placeholder, disabled }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
      />
      {error && (
        <p className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactInfoStep({ onNext, onBack }: ContactInfoStepProps) {
  const t = useTranslations('booking.wizard.contact_info');
  const { state, actions } = useBookingWizard();
  const { bookingData, isLoading } = state;
  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    name: bookingData.contactInfo?.name || '',
    email: bookingData.contactInfo?.email || '',
    phone: bookingData.contactInfo?.phone || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthenticated && user && !bookingData.contactInfo) {
      const fullName = user.personal ? `${user.personal.firstName || ''} ${user.personal.lastName || ''}`.trim() : '';
      setFormData(prev => ({
        name: prev.name || fullName,
        email: prev.email || user.email || '',
        phone: prev.phone || '',
      }));
    }
  }, [isAuthenticated, user, bookingData.contactInfo]);

  const validation = useMemo(() => validateContactInfo(formData), [formData]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleFieldBlur = useCallback(
    (field: string) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const { errors } = validateContactInfo(formData);
      if (errors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: errors[field] }));
      }
    },
    [formData],
  );

  const handleBack = useCallback(() => {
    actions.updateBookingData({
      contactInfo: formData.name || formData.email || formData.phone ? formData : null,
    });
    if (onBack) {
      onBack();
    } else {
      actions.prevStep();
    }
  }, [actions, formData, onBack]);

  const handleContinue = useCallback(() => {
    const { isValid, errors } = validateContactInfo(formData);

    if (!isValid) {
      setFieldErrors(errors);
      setTouched({ name: true, email: true, phone: true });
      return;
    }

    actions.updateBookingData({ contactInfo: formData });
    actions.markStepCompleted(BOOKING_STEPS.CONTACT_INFO);

    if (onNext) {
      onNext();
    } else {
      actions.nextStep();
    }
  }, [formData, actions, onNext]);

  const getTranslatedError = (errorKey: string) => {
    return t(
      `errors.${errorKey}` as
        | 'errors.name_required'
        | 'errors.email_required'
        | 'errors.email_invalid'
        | 'errors.phone_required'
        | 'errors.phone_invalid',
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <FormField
            id="contact-name"
            label={t('name')}
            icon={<User className="h-4 w-4 text-gray-500" />}
            value={formData.name}
            onChange={value => handleFieldChange('name', value)}
            error={touched.name && fieldErrors.name ? getTranslatedError(fieldErrors.name) : undefined}
            placeholder={t('name_placeholder')}
            disabled={isLoading}
          />

          <FormField
            id="contact-email"
            label={t('email')}
            icon={<Mail className="h-4 w-4 text-gray-500" />}
            value={formData.email}
            onChange={value => handleFieldChange('email', value)}
            error={touched.email && fieldErrors.email ? getTranslatedError(fieldErrors.email) : undefined}
            type="email"
            placeholder={t('email_placeholder')}
            disabled={isLoading}
          />

          <FormField
            id="contact-phone"
            label={t('phone')}
            icon={<Phone className="h-4 w-4 text-gray-500" />}
            value={formData.phone}
            onChange={value => handleFieldChange('phone', value)}
            error={touched.phone && fieldErrors.phone ? getTranslatedError(fieldErrors.phone) : undefined}
            type="tel"
            placeholder={t('phone_placeholder')}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      <WizardNavigation
        showBack={true}
        onBack={handleBack}
        onContinue={handleContinue}
        isContinueDisabled={!validation.isValid}
        isLoading={isLoading}
      />
    </div>
  );
}
