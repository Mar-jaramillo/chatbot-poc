import { IconX } from '@tabler/icons-react';
import { ActionIcon, Stack } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { ViewEnum } from '@/app/types';

export function CloseButton() {
  const { setCurrentView } = useAppContext();

  const handleClose = () => {
    setCurrentView(ViewEnum.INITIAL);
  };

  return (
    <Stack align="end">
      <ActionIcon color="gray" variant="subtle" onClick={handleClose} radius="xl" size="sm">
        <IconX size={18} />
      </ActionIcon>
    </Stack>
  );
}
