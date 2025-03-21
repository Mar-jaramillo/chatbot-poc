import Image from 'next/image';
import { Box, Group, Text } from '@mantine/core';

export function PopOverCharFooter() {
  return (
    <Box py="xs" px="md" style={{ flexShrink: 0 }}>
      <Group align="center" justify="space-between">
        <Text size="xs" style={{ lineHeight: 1.2 }}>
          © 2025 Qubilo.
        </Text>

        <Image src="/icons/icon-gob247.svg" alt="Icon gob247" width={55} height={20} />
      </Group>
    </Box>
  );
}
