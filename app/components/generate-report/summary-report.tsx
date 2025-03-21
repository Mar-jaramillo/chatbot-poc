import { Box, Button, Card, Group, Text, Title } from '@mantine/core';
import { ReportData } from '@/app/types';

type SummaryReportProps = ReportData & {
  onConfirm: () => void;
  onCancel: () => void;
};

export function SummaryReport({ data, onConfirm, onCancel }: SummaryReportProps) {
  return (
    <Card p="lg" radius="md" withBorder>
      <Title order={5}>Resumen del reporte</Title>
      <Text size="xs">
        Aquí tienes el resumen de tu reporte. Verifica que toda la información esté correcta.
      </Text>
      <Box my="md">
        <Text size="sm">
          <strong>Dirección:</strong> {data.incident_address || '-'}
        </Text>
        <Text size="sm">
          <strong>Comuna:</strong> {data.administrative_area || '-'}
        </Text>
        <Text size="sm">
          <strong>Barrio:</strong> {data.neighborhood || '-'}
        </Text>
        <Text size="sm">
          <strong>Descripción:</strong> {data.description || '-'}
        </Text>
        <Text size="sm">
          <strong>Equipo:</strong> {data.referred_to || '-'}
        </Text>
      </Box>
      <Group>
        <Button size="xs" variant="outline" color="red" onClick={onCancel}>
          Cancelar
        </Button>
        <Button color="green" size="xs" onClick={onConfirm}>
          Confirmar y enviar
        </Button>
      </Group>
    </Card>
  );
}
