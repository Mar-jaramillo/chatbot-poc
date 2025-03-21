import { Box, Button, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { ReportData } from '@/app/types';

type SummaryReportProps = ReportData & {
  onConfirm: () => void;
  onCancel: () => void;
};

type ReportField = {
  label: string;
  key: keyof ReportData['data'];
};
export function SummaryReport({ data, onConfirm, onCancel }: SummaryReportProps) {
  const reportFields: ReportField[] = [
    { label: 'Dirección', key: 'incident_address' },
    { label: 'Comuna', key: 'administrative_area' },
    { label: 'Barrio', key: 'neighborhood' },
    { label: 'Descripción', key: 'description' },
    { label: 'Equipo', key: 'referred_to' },
  ];

  return (
    <Card p="lg" radius="md" withBorder shadow="sm">
      <Stack>
        <Title order={5}>Resumen del reporte</Title>

        <Text size="xs" c="dimmed">
          Aquí tienes el resumen de tu reporte. Verifica que toda la información esté correcta.
        </Text>

        <Divider my="sm" />

        <Box>
          <Stack>
            {reportFields.map((field) => (
              <Group key={field.key} gap={4}>
                <Text size="sm" fw={600}>
                  {field.label}:
                </Text>
                <Text size="sm" lineClamp={2}>
                  {data[field.key] || '-'}
                </Text>
              </Group>
            ))}
          </Stack>
        </Box>

        <Divider my="sm" />

        <Group>
          <Button size="xs" variant="outline" color="red" onClick={onCancel}>
            Cancelar
          </Button>
          <Button color="green" size="xs" onClick={onConfirm}>
            Confirmar y enviar
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
