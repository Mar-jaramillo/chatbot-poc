import { Paper, Stack } from '@mantine/core';
import { INITIAL_MENU_OPTIONS } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { MenuButton } from '../ui';

export function InitialOptions() {
  const { handleMenuSelection } = useAppContext();

  return (
    <Paper shadow="sm" radius="md">
      <Stack p="md">
        {INITIAL_MENU_OPTIONS.map((option) => (
          <MenuButton
            key={option.id}
            option={option}
            onClick={() => handleMenuSelection(option.action)}
          />
        ))}
      </Stack>
    </Paper>
  );
}
