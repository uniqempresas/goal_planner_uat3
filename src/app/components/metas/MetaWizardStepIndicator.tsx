import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface MetaWizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
  totalSteps?: number;
  themeColor: string;
  stepLabels?: string[];
}

export function MetaWizardStepIndicator({
  currentStep,
  totalSteps = 3,
  themeColor,
  stepLabels = ['Essenciais', 'ONE Thing & Foco', 'Framework & Review'],
}: MetaWizardStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={false}
            animate={{
              scale: currentStep === step ? 1.1 : 1,
              backgroundColor: currentStep >= step ? themeColor : '#e2e8f0',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              currentStep >= step ? 'text-white' : 'text-slate-400'
            }`}
          >
            {currentStep > step ? (
              <Check className="w-5 h-5" />
            ) : (
              step
            )}
          </motion.div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-2 rounded-full transition-colors ${
                currentStep > step ? '' : 'bg-slate-200'
              }`}
              style={{ backgroundColor: currentStep > step ? themeColor : undefined }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Labels abaixo dos steps (mobile friendly)
export function MetaWizardStepLabels({
  currentStep,
  stepLabels = ['Essenciais', 'ONE Thing & Foco', 'Framework & Review'],
  themeColor,
}: {
  currentStep: number;
  stepLabels?: string[];
  themeColor: string;
}) {
  return (
    <div className="flex justify-center gap-8 mt-2 mb-6">
      {stepLabels.map((label, index) => {
        const step = index + 1;
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        return (
          <motion.span
            key={step}
            initial={false}
            animate={{
              color: isActive || isCompleted ? themeColor : '#94a3b8',
              fontWeight: isActive ? 600 : 400,
            }}
            className="text-xs sm:text-sm transition-colors"
          >
            {label}
          </motion.span>
        );
      })}
    </div>
  );
}
