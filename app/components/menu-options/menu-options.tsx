import { IconMessageCircle } from '@tabler/icons-react';
import { Button, Paper, Stack, Text } from '@mantine/core';
import { useAppContext } from '@/app/context';

export function MenuOptions() {
  const { userServerResponse, handleMenuSelection } = useAppContext();

  if (!userServerResponse) {
    return null;
  }

  return (
    <Paper shadow="sm" radius="md">
      <Stack p="md">
        <Text size="lg" c="blue" fw={700}>
          {userServerResponse.first_name}
        </Text>
        <Text size="lg" fw={700}>
          ¿Cómo puedo ayudarte?
        </Text>
        <Text size="sm" ta="center">
          Para empezar elige una de las siguientes opciones:
        </Text>

        <Button size="xs" variant="outline" onClick={() => handleMenuSelection('chat')} my={5}>
          Hacer una pregunta
        </Button>

        <Button
          variant="filled"
          size="xs"
          onClick={() => handleMenuSelection('report')}
          color="blue"
        >
          Crear nuevo reporte
        </Button>
        <Button size="xs" variant="outline" onClick={() => handleMenuSelection('chat')} my={5}>
          Hacer seguimiento
        </Button>

        <Button size="xs" variant="outline" onClick={() => handleMenuSelection('chat')} my={5}>
          Califica tu experiencia
        </Button>
      </Stack>
    </Paper>
  );
}
