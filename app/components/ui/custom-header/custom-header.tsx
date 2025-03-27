import { ReactNode } from 'react';
import { Box, Divider, Text, Title } from '@mantine/core';

type CustomHeaderProps = {
  title: string | ReactNode;
  subtitle: string;
};

export function CustomHeader(props: CustomHeaderProps) {
  const { title, subtitle } = props;
  return (
    <>
      <Box pb="sm">
        <Title order={4} mb="sm">
          {title}
        </Title>
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      </Box>

      <Divider mb="md" />
    </>
  );
}
