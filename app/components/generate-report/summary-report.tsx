import { Button, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { useSummaryReport } from '@/app/hooks';
import type { ReportData } from '@/app/types';
import { CustomHeader } from '../ui';

type SummaryReportProps = ReportData & {
  onConfirm: () => void;
  onCancel: () => void;
};

export function SummaryReport({ data, onConfirm, onCancel }: SummaryReportProps) {
  const { reportFields, teams } = useSummaryReport(data);
  return (
    <Stack>
      <CustomHeader
        title="Resumen del reporte"
        subtitle=" Verifica que toda la información esté correcta antes de enviar."
      />

      <Stack gap="xs">
        {reportFields.map((field) =>
          data[field.key] ? (
            <Group key={field.key} wrap="nowrap" align="flex-start">
              <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
                {field.icon}
              </ThemeIcon>
              <Group gap={3}>
                <Text size="xs" fw={600} c="dimmed">
                  {field.label}:
                </Text>
                <Text size="xs" lineClamp={4} component="div">
                  {field.format
                    ? field.format(data[field.key] as string, teams)
                    : data[field.key] || '-'}
                </Text>
              </Group>
            </Group>
          ) : null
        )}
      </Stack>
      <Divider />
      <Group mt="md" justify="space-between">
        <Button variant="outline" color="red" size="xs" onClick={onCancel} radius="md">
          Cancelar
        </Button>
        <Button color="green" size="xs" onClick={onConfirm} radius="md">
          Confirmar y enviar
        </Button>
      </Group>
    </Stack>
  );
}
