import {
  IconAlertCircle,
  IconCheck,
  IconClockHour4,
  IconQuestionMark,
  IconSearch,
} from '@tabler/icons-react';
import { Button, Chip, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { ViewEnum } from '@/app/types';
import { CustomHeader } from '../ui';

export function FollowUpDetails() {
  const { followUpData, setCurrentView } = useAppContext();

  const getStatusInfo = () => {
    switch (followUpData?.status) {
      case 'PENDING':
        return {
          label: 'Pendiente',
          color: 'orange',
          icon: <IconClockHour4 size={15} />,
          description:
            'Tu caso está pendiente de revisión por nuestro equipo. Vuelve a consultarlo más tarde.',
        };
      case 'IN_PROGRESS':
        return {
          label: 'En proceso',
          color: 'blue',
          icon: <IconClockHour4 size={15} />,
          description: 'Tu caso está siendo atendido por nuestro equipo.',
        };
      case 'RESOLVED':
        return {
          label: 'Resuelto',
          color: 'green',
          icon: <IconCheck size={15} />,
          description: 'Tu caso ha sido resuelto exitosamente.',
        };
      case 'REJECTED':
        return {
          label: 'Rechazado',
          color: 'red',
          icon: <IconAlertCircle size={15} />,
          description: 'Tu caso ha sido rechazado.',
        };
      default:
        return {
          label: 'Desconocido',
          color: 'gray',
          icon: <IconQuestionMark size={15} />,
          description: 'No se pudo determinar el estado de tu caso.',
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleBackToSearch = () => {
    setCurrentView(ViewEnum.FOLLOW_UP);
  };

  return (
    <>
      <Stack>
        <CustomHeader
          title={
            <Group gap={5}>
              <Title order={5}>Detalles del Caso:</Title>
              <Title order={5} c="blue">
                {followUpData?.reference_number || '-'}
              </Title>
            </Group>
          }
          subtitle=" A continuación se muestran los detalles y estado actual de tu caso."
        />

        <Stack my="md" gap={2}>
          <Group align="flex-start">
            <Stack>
              <Group gap={6}>
                <Text size="sm" fw={600}>
                  Estado:
                </Text>
                <Chip
                  size="sm"
                  defaultChecked
                  color={statusInfo.color}
                  variant="light"
                  icon={statusInfo.icon}
                >
                  {statusInfo.label}
                </Chip>
              </Group>

              <Text size="xs" c="dimmed">
                {statusInfo.description}
              </Text>
            </Stack>
          </Group>
          {followUpData?.observations && (
            <Stack>
              <Text size="sm" fw={600}>
                Observaciones:
              </Text>
              <Text size="xs" p="xs" bg="gray.0" style={{ borderRadius: '4px' }}>
                {followUpData.observations}
              </Text>
            </Stack>
          )}
        </Stack>

        <Divider my="md" />

        <Group>
          <Button
            leftSection={<IconSearch size={16} />}
            onClick={handleBackToSearch}
            variant="outline"
            size="xs"
          >
            Buscar Otro Caso
          </Button>
        </Group>
      </Stack>
    </>
  );
}
