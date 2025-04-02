import { IconSearch } from '@tabler/icons-react';
import { Button, Chip, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { useFollowUpReportDetails } from '@/app/hooks';
import { CustomHeader } from '../ui';

export function FollowUpDetails() {
  const { followUpData, statusInfo, handleBackToSearch } = useFollowUpReportDetails();
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
                  checked
                  color={statusInfo.color}
                  variant="light"
                  icon={statusInfo.icon}
                >
                  {statusInfo.label}
                </Chip>
              </Group>
            </Stack>
          </Group>
          <Stack gap="xs">
            <Text size="sm" fw={600} pt="md">
              Observación:
            </Text>
            <Text size="xs" p="xs" bg="gray.0" style={{ borderRadius: '4px' }}>
              {followUpData?.observations ||
                'Tu caso está pendiente de revisión por nuestro equipo. Vuelve a consultarlo más tarde.'}
            </Text>
          </Stack>
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
