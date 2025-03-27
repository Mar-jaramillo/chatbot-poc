import { IconArrowLeft } from '@tabler/icons-react';
import { Button, Group, Text } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { ViewEnum } from '@/app/types';

export function BackToMenuButton() {
  const { handleGoToMenu, currentView } = useAppContext();
  if (
    currentView === ViewEnum.INITIAL ||
    currentView === ViewEnum.LOGIN ||
    currentView === ViewEnum.MENU
  ) {
    return null;
  }

  return (
    <Group justify="flex-start" mb="md">
      <Button size="xs" variant="subtle" onClick={handleGoToMenu}>
        <Group>
          <IconArrowLeft size={16} />
          <Text size="xs">Volver al menú</Text>
        </Group>
      </Button>
    </Group>
  );
}
