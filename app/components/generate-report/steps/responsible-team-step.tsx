import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useResponsibleTeams } from '@/app/hooks/use-responsible-teams';
import { ReportData } from '@/app/types';

type ResponsibleTeamStepProps = {
  formData: ReportData['data'];
  updateFormData: (field: string, value: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isResponsibleTeamStepValid: () => boolean;
};

export function ResponsibleTeamStep({
  formData,
  updateFormData,
  goToNextStep,
  goToPreviousStep,
  isResponsibleTeamStepValid,
}: ResponsibleTeamStepProps) {
  const { teams, isLoading, error } = useResponsibleTeams();

  const handleTeamSelect = (teamId: string) => {
    updateFormData('referred_to', teamId);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

      <Title order={5}>Elige el equipo de atención</Title>
      <Text mb={15} size="xs">
        Elige el equipo que mejor pueda ayudar con el caso que estás reportando.
      </Text>
      <Divider mb="md" />

      {error && (
        <Text c="red" size="xs" my="md">
          Error al cargar los equipos: {error}. Por favor, intenta de nuevo más tarde.
        </Text>
      )}

      <Stack>
        {teams.map((team) => (
          <Paper
            key={team.id}
            p="md"
            radius="md"
            withBorder
            onClick={() => handleTeamSelect(team.id)}
            style={(theme) => ({
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderColor:
                formData.referred_to === team.id ? theme.colors.blue[6] : theme.colors.gray[3],
              backgroundColor: formData.referred_to === team.id ? theme.colors.blue[0] : 'white',
              '&:hover': {
                borderColor: theme.colors.blue[4],
                backgroundColor: theme.colors.gray[0],
              },
            })}
          >
            <Title order={6} mb="xs">
              {team.name}
            </Title>
            <Text size="xs" c="dimmed">
              {team.description}
            </Text>
          </Paper>
        ))}
      </Stack>

      <Divider my="md" />

      <Group justify="space-between" mt="md">
        <Button size="xs" variant="outline" onClick={goToPreviousStep}>
          Anterior
        </Button>
        <Button size="xs" onClick={goToNextStep} disabled={!isResponsibleTeamStepValid()}>
          Finalizar
        </Button>
      </Group>
    </Box>
  );
}
