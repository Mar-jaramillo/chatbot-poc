import { Group, Stepper } from '@mantine/core';
import { REPORT_STEPS } from '@/app/consts';

type FormStepperProps = {
  currentStep: keyof typeof REPORT_STEPS;
  visibleSteps: string[];
};

export function FormStepper({ currentStep, visibleSteps }: FormStepperProps) {
  const getCurrentStepIndex = () => {
    return visibleSteps.indexOf(currentStep);
  };

  return (
    <>
      <Group mb="md" align="center" wrap="nowrap" style={{ width: '100%' }}>
        <Stepper
          pt="xl"
          active={getCurrentStepIndex()}
          size="xs"
          style={{ flex: 1 }}
          color="blue"
          iconSize={20}
        >
          {visibleSteps.map((_, index) => (
            <Stepper.Step key={index} />
          ))}
        </Stepper>
      </Group>
    </>
  );
}
