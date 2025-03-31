import { Stack, Text } from '@mantine/core';
import { MENU_OPTIONS } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { CustomHeader } from '../ui';
import { MenuButton } from '../ui/menu-button';

export function MenuOptions() {
  const { userServerResponse, handleMenuSelection } = useAppContext();

  if (!userServerResponse) {
    return null;
  }

  return (
    <Stack>
      <CustomHeader
        title={
          <>
            <Text size="lg" fw={700}>
              {userServerResponse.first_name} 👋,
            </Text>
            <Text size="lg" fw={700}>
              ¿Cómo puedo ayudarte?
            </Text>
          </>
        }
        subtitle="Elige la opción que deseas realizar"
      />
      {MENU_OPTIONS.map((option) => (
        <MenuButton
          key={option.id}
          option={option}
          onClick={() => handleMenuSelection(option.action)}
        />
      ))}
    </Stack>
  );
}
