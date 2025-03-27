import { useState } from 'react';
import { IconArrowLeft, IconCheck, IconClockHour4, IconCopy } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useAppContext } from '@/app/context';
import { ViewEnum } from '@/app/types';

interface ReferenceNumberProps {
  referenceNumber: string;
  status: string;
}

export function ReferenceNumber({ referenceNumber, status }: ReferenceNumberProps) {
  const [copied, setCopied] = useState(false);
  const { setCurrentView } = useAppContext();

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToMenu = () => {
    setCurrentView(ViewEnum.MENU);
  };

  return (
    <Card p="lg" radius="md" withBorder shadow="sm">
      <Stack>
        <Group mb="xs">
          <Title order={5}>¡Reporte enviado con éxito! 👍 </Title>
          <Text size="xs" c="dimmed" mt={5}>
            Tu reporte ha sido enviado correctamente. Guarda este número de referencia para dar
            seguimiento a tu caso.
          </Text>
        </Group>
        <Divider />

        <Stack align="center" my="lg">
          <Text size="sm" fw={500} c="dimmed">
            Número de radicado:
          </Text>

          <Group>
            <Title order={3} c="blue">
              {referenceNumber}
            </Title>
            <ActionIcon color={copied ? 'green' : 'blue'} onClick={handleCopy} variant="light">
              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
            </ActionIcon>
          </Group>
          <Group gap={6}>
            <Text size="sm" fw={600}>
              Estado:
            </Text>
            <Chip
              size="sm"
              defaultChecked
              color="orange"
              variant="light"
              icon={<IconClockHour4 size={15} />}
            >
              {status === 'PENDING' ? 'Pendiente' : status}
            </Chip>
          </Group>
        </Stack>

        <Text size="xs" c="dimmed" ta="center">
          Puedes usar este número de referencia para hacer seguimiento a tu reporte en cualquier
          momento.
        </Text>

        <Button
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleGoToMenu}
          variant="light"
          color="blue"
          size="xs"
          mt="md"
        >
          Volver al menú principal
        </Button>
      </Stack>
    </Card>
  );
}
