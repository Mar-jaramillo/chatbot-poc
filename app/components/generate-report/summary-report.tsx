import {
  IconCalendar,
  IconHome2,
  IconMap,
  IconMapPin,
  IconNotes,
  IconUsers,
} from '@tabler/icons-react';
import {
  Button,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ResponsibleTeam, useResponsibleTeams } from '@/app/hooks/use-responsible-teams';
import { ReportData } from '@/app/types';

type SummaryReportProps = ReportData & {
  onConfirm: () => void;
  onCancel: () => void;
};

type ReportField = {
  label: string;
  key: keyof ReportData['data'];
  icon: React.ReactNode;
  format?: (value: string, teams?: ResponsibleTeam[]) => React.ReactNode;
};

export function SummaryReport({ data, onConfirm, onCancel }: SummaryReportProps) {
  const { teams, isLoading } = useResponsibleTeams();

  const formatTeamName = (teamId: string, teams?: ResponsibleTeam[]) => {
    if (!teams || teams.length === 0 || !teamId) {
      return teamId || '-';
    }

    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : teamId;
  };

  const reportFields: ReportField[] = [
    {
      label: 'Dirección',
      key: 'incident_address',
      icon: <IconHome2 size={16} />,
    },
    {
      label: 'Comuna',
      key: 'administrative_area',
      icon: <IconMap size={16} />,
    },
    {
      label: 'Barrio',
      key: 'neighborhood',
      icon: <IconMapPin size={16} />,
    },
    {
      label: 'Fecha',
      key: 'request_date',
      icon: <IconCalendar size={16} />,
    },
    {
      label: 'Descripción',
      key: 'description',
      icon: <IconNotes size={16} />,
    },
    {
      label: 'Equipo asignado',
      key: 'referred_to',
      icon: <IconUsers size={16} />,
      format: (value) =>
        isLoading ? <Skeleton height={16} width="70%" /> : formatTeamName(value, teams),
    },
  ];

  return (
    <Card p="lg" radius="md" withBorder shadow="sm">
      <Stack>
        <Group mb="xs">
          <Title order={5}>Resumen del reporte</Title>
          <Text size="xs" c="dimmed" mt={5}>
            Verifica que toda la información esté correcta antes de enviar.
          </Text>
        </Group>
        <Divider />

        <Stack>
          {reportFields.map((field) =>
            data[field.key] ? (
              <Group key={field.key} wrap="nowrap" align="flex-start">
                <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
                  {field.icon}
                </ThemeIcon>
                <Group>
                  <Text size="xs" fw={600} c="dimmed">
                    {field.label}
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
    </Card>
  );
}
