import { IconArrowLeft } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import { ViewType } from '@/app/types';

type BackToMenuButtonProps = {
  currentView: string;
  setCurrentView: (view: ViewType) => void;
};

export function BackToMenuButton(props: BackToMenuButtonProps) {
  const { currentView, setCurrentView } = props;
  if (currentView !== 'chat') {
    return null;
  }

  return (
    <Group justify="flex-start" mb="md">
      <Button size="xs" variant="subtle" onClick={() => setCurrentView('menu')}>
        <Group>
          <IconArrowLeft size={16} />
          <span>Volver al menú</span>
        </Group>
      </Button>
    </Group>
  );
}
