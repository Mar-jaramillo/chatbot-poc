import { Stack, Text } from '@mantine/core';

export function HeaderMenu({ firstName }: { firstName: string }) {
  return (
    <Stack gap={1}>
      <Text size="lg" fw={700}>
        {firstName}, 👋
      </Text>
      <Text size="lg" fw={700}>
        Estoy lista para ayudarte
      </Text>
      <Text size="xs" c="dimmed">
        Elige una opción para comenzar
      </Text>
    </Stack>
  );
}
