import { Box, Button, Card, Group, Text, Title } from '@mantine/core';
import { ReportData } from '@/app/types';

type SummaryReportProps = ReportData & {
  onConfirm: () => void;
  onCancel: () => void;
};

export function SummaryReport({ data, onConfirm, onCancel }: SummaryReportProps) {
  return (
    <Card p="lg" radius="md" withBorder>
      <Title order={4}>Resumen del reporte</Title>
      <Box my="md">
        <Text>
          <strong>Dirección:</strong> {data.incident_address || '-'}
        </Text>
        <Text>
          <strong>administrative_area:</strong> {data.administrative_area || '-'}
        </Text>
        <Text>
          <strong>Barrio:</strong> {data.neighborhood || '-'}
        </Text>
        <Text>
          <strong>Tipo de persona:</strong> {data.personType || '-'}
        </Text>
        <Text>
          <strong>Tipo de ID:</strong> {data.idType || '-'}
        </Text>
        <Text>
          <strong>Número de ID:</strong> {data.idNumber || '-'}
        </Text>
        <Text>
          <strong>Descripción:</strong> {data.description || '-'}
        </Text>
        <Text>
          <strong>Equipo:</strong> {data.referred_to || '-'}
        </Text>
      </Box>
      <Group>
        <Button variant="outline" color="red" onClick={onCancel}>
          Cancelar
        </Button>
        <Button color="green" onClick={onConfirm}>
          Confirmar y enviar
        </Button>
      </Group>
    </Card>
  );
}
