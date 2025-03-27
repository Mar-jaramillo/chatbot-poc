import { useState } from 'react';
import { IconCheck, IconClockHour4, IconCopy } from '@tabler/icons-react';
import { ActionIcon, Chip, Group, Stack, Text, Title } from '@mantine/core';
import { CustomHeader } from '../ui';

interface ReferenceNumberProps {
  referenceNumber: string;
  status: string;
}

export function ReferenceNumber({ referenceNumber, status }: ReferenceNumberProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Stack>
      <CustomHeader
        title="¡Reporte enviado con éxito 👍! "
        subtitle="Tu reporte ha sido enviado correctamente. Para consultar el estado de tu caso, puedes acceder al botón Hacer seguimiento  en el menú principal."
      />

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
        Este es tu <strong>identificador único</strong>. Guárdalo para que puedas consultar el
        estado de tu caso en cualquier momento.
      </Text>
    </Stack>
  );
}
