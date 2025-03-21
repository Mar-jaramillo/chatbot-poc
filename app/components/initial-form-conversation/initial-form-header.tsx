import { Divider, Group, Stack, Text } from '@mantine/core';

export function InitialFormHeader() {
  return (
    <Stack p="md">
      <Group gap={5}>
        <Text size="xl" fw={700}>
          ¡Hola! Soy
        </Text>
        <Text
          size="xl"
          fw={900}
          variant="gradient"
          gradient={{ from: 'grape', to: 'cyan', deg: 102 }}
        >
          Abby,
        </Text>
        <Text size="xl" fw={700} lh={1}>
          Tu asistente virtual
        </Text>
        <Text size="xs">Antes de comenzar por favor completa tus datos</Text>
      </Group>
      <Divider />
    </Stack>
  );
}
