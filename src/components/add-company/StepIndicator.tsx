import { cn } from '@/lib/cn';
import { FORM_STEPS } from '@/lib/add-company/constants';

type StepIndicatorProps = {
  currentStep: 1 | 2 | 3;
};

const CHEVRON_DEPTH = 16;

function getStepClipPath(index: number, total: number): string {
  const arrow = CHEVRON_DEPTH;

  if (index === 0) {
    return `polygon(0 0, calc(100% - ${arrow}px) 0, 100% 50%, calc(100% - ${arrow}px) 100%, 0 100%)`;
  }

  if (index === total - 1) {
    return `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${arrow}px 50%)`;
  }

  return `polygon(0 0, calc(100% - ${arrow}px) 0, 100% 50%, calc(100% - ${arrow}px) 100%, 0 100%, ${arrow}px 50%)`;
}

function getStepColors(stepId: number, currentStep: number) {
  if (stepId < currentStep) {
    return {
      background: '#333333',
      text: 'text-white',
    };
  }

  if (stepId === currentStep) {
    return {
      background: '#B8B8B8',
      text: 'text-black',
    };
  }

  return {
    background: '#E7E7E7',
    text: 'text-black',
  };
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ol
      className="flex w-full items-stretch overflow-hidden rounded-l-2xl rounded-r-2xl"
      aria-label="Кроки форми"
    >
      {FORM_STEPS.map((step, index) => {
        const colors = getStepColors(step.id, currentStep);
        const isActive = currentStep === step.id;

        return (
          <li
            key={step.id}
            className={cn(
              'relative flex min-h-11 flex-1 items-center justify-center py-2.5 text-center sm:min-h-12',
              'px-3 sm:px-4',
              index > 0 && 'pl-5 sm:pl-6',
              index < FORM_STEPS.length - 1 && 'pr-5 sm:pr-6',
              colors.text,
              index > 0 && '-ml-[16px]',
            )}
            style={{
              backgroundColor: colors.background,
              clipPath: getStepClipPath(index, FORM_STEPS.length),
              zIndex: FORM_STEPS.length - index,
            }}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="font-eUkraine text-[11px] leading-snug font-medium sm:text-[13px]">
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
