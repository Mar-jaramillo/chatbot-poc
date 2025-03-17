import { IconMessageCircle } from '@tabler/icons-react';
import { Button, Stack, Text } from '@mantine/core';
import { useAppContext } from '@/app/context';

export function MenuOptions() {
  const { userServerResponse, handleMenuSelection } = useAppContext();

  if (!userServerResponse) {
    return null;
  }

  return (
    <Stack p="md">
      <Text size="lg" fw={500} ta="center">
        ¡Hola {userServerResponse.first_name}!
      </Text>
      <Text size="md" ta="center">
        ¿Qué deseas hacer?
      </Text>

      <Button
        variant="outline"
        onClick={() => handleMenuSelection('chat')}
        my={5}
        leftSection={<IconMessageCircle size={16} />}
      >
        Hacer una pregunta
      </Button>

      <Button variant="filled" onClick={() => handleMenuSelection('report')} color="blue">
        📝 Crear nuevo reporte
      </Button>
    </Stack>
  );
}
