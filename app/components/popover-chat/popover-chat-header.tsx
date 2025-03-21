import Image from 'next/image';
import { Avatar, Box, Button, Group, Indicator, Stack, Text } from '@mantine/core';

export function PopoverChatHeader({ toggle }: { toggle: () => void }) {
  return (
    <Box bg="#292EFF" py="xs" px="lg" style={{ flexShrink: 0 }}>
      <Group>
        <Indicator inline processing color="green" size={12} offset={5} withBorder>
          <Avatar src="/images/abbi-avatar.png" size="md" radius="xl" />
        </Indicator>
        <Stack gap={0}>
          <Group gap={3}>
            <Text size="lg" fw={700} c="white" style={{ lineHeight: 1.2 }}>
              Abby
            </Text>
            <Image src="icons/icon-ai.svg" alt="Icon AI" width={20} height={20} />
          </Group>
          <Text c="white" opacity={0.9} size="xs" style={{ lineHeight: 1.2 }}>
            Online chatbot
          </Text>
        </Stack>

        {/* Close Popover */}
        <Button
          variant="transparent"
          c="white"
          style={{ marginLeft: 'auto', padding: 0 }}
          onClick={toggle}
          radius="xl"
          size="sm"
        >
          ✕
        </Button>
      </Group>
    </Box>
  );
}
