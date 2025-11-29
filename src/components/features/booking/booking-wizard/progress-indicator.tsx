'use client';

import { cn } from '@/utils/classnames';
import { Check } from 'lucide-react';

export interface StepConfig {
  id: number;
  label: string;
  icon?: React.ReactNode;
}

export interface ProgressIndicatorProps {
  steps: StepConfig[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: ProgressIndicatorProps) {
  const handleStepClick = (stepId: number) => {
    if (completedSteps.has(stepId) || stepId < currentStep) {
      onStepClick(stepId);
    }
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.id);
        const isCurrent = step.id === currentStep;
        const isClickable = isCompleted || step.id < currentStep;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => handleStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-2',
                isClickable && 'cursor-pointer',
                !isClickable && 'cursor-default',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted && 'border-primary bg-primary text-white',
                  isCurrent && !isCompleted && 'border-primary bg-white text-primary',
                  !isCurrent && !isCompleted && 'border-gray-300 bg-white text-gray-400',
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" data-testid={`step-${step.id}-checkmark`} />
                ) : (
                  <span className="text-sm font-medium">{step.id + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isCurrent && 'text-primary',
                  isCompleted && 'text-primary',
                  !isCurrent && !isCompleted && 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className={cn('mx-2 h-0.5 flex-1', completedSteps.has(step.id) ? 'bg-primary' : 'bg-gray-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MobileProgressIndicator({
  steps,
  currentStep,
  completedSteps,
}: Omit<ProgressIndicatorProps, 'onStepClick'>) {
  const currentStepConfig = steps.find(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
          {currentStep + 1}
        </div>
        <span className="text-sm font-medium text-gray-700">{currentStepConfig?.label}</span>
      </div>
      <span className="text-sm text-gray-500">
        {completedSteps.size + (completedSteps.has(currentStep) ? 0 : 1)}/{steps.length}
      </span>
    </div>
  );
}
