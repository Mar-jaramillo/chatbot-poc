import { Stack, Text } from '@mantine/core';

export function HeaderMenu({ firstName }: { firstName: string }) {
  return (
    <Stack gap={1}>
      <Text size="lg" fw={700}>
        {firstName} 👋,
      </Text>
      <Text size="lg" fw={700}>
        ¿Cómo puedo ayudarte?
      </Text>
      <Text size="xs" c="dimmed">
        Para empezar elige una de las siguientes opciones:
      </Text>
    </Stack>
  );
}
