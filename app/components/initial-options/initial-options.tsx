import { INITIAL_MENU_OPTIONS } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { MenuButton, CustomHeader } from '../ui';
import { Stack } from '@mantine/core';

export function InitialOptions() {
  const { handleMenuSelection } = useAppContext();

  return (
    <Stack>
      <CustomHeader
        title="¡Te damos la bienvenida! 👋"
        subtitle="Para empezar elige una de las siguientes opciones:"
      />
      {INITIAL_MENU_OPTIONS.map((option) => (
        <MenuButton
          key={option.id}
          option={option}
          onClick={() => handleMenuSelection(option.action)}
        />
      ))}
    </Stack>
  );
}
