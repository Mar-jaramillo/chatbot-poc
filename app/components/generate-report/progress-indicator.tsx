import { IconArrowLeft } from '@tabler/icons-react';
import { ActionIcon, Group, Text } from '@mantine/core';

type ProgressIndicatorProps = {
  currentStep: string;
  visibleSteps: string[];
  onCancel: () => void;
};

export function ProgressIndicator({ currentStep, visibleSteps, onCancel }: ProgressIndicatorProps) {
  const currentIndex = visibleSteps.indexOf(currentStep);
  const totalSteps = visibleSteps.length;

  return (
    <Group mb="md">
      <ActionIcon onClick={onCancel}>
        <IconArrowLeft size={16} />
      </ActionIcon>
      <Text size="xs">
        Paso {currentIndex + 1} de {totalSteps}
      </Text>
    </Group>
  );
}
