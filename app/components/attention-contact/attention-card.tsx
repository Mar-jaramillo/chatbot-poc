import { IconClockHour4, IconPhone } from '@tabler/icons-react';
import { Box, Button, Chip, Divider, Stack, Text } from '@mantine/core';

type ContactCardProps = {
  title: string;
  number: string;
  description: string;
  available: string;
};

export function ContactCard({ title, number, description, available }: ContactCardProps) {
  return (
    <Box>
      <Stack mb={8} gap="xs">
        <Text fw={600}>{title}</Text>
        <Button
          justify="start"
          leftSection={<IconPhone size={14} />}
          component="a"
          variant="subtle"
          href={`tel:${number}`}
          fw={700}
          size="md"
        >
          {number}
        </Button>
      </Stack>
      <Chip
        mb={8}
        size="xs"
        checked
        color="blue"
        variant="light"
        icon={<IconClockHour4 size={12} />}
      >
        {available}
      </Chip>
      <Text c="dimmed" size="xs">
        {description}
      </Text>
      <Divider my="sm" />
    </Box>
  );
}
