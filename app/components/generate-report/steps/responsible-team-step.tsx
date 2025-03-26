import { Box, Button, Chip, Divider, Group, Stack, Text, Title } from '@mantine/core';
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
  return (
    <Box>
      <Title order={5}>Equipo Responsable</Title>
      <Text mb={15} size="xs">
        Selecciona el equipo al que se debe derivar este caso
      </Text>
      <Divider />
      <Stack py="sm">
        <Text fw={500} size="sm" mt={15} mb={5}>
          Equipo *
        </Text>
        <Chip.Group
          value={formData.referred_to || ''}
          onChange={(value) => updateFormData('referred_to', value as string)}
        >
          <Group gap="md">
            <Chip value="POLICE">POLICE</Chip>
            <Chip value="SOCIAL_SERVICES">SOCIAL_SERVICES</Chip>
            <Chip value="HEALTHCARE">HEALTHCARE</Chip>
            <Chip value="OTHER">OTHER</Chip>
          </Group>
        </Chip.Group>
        <Group justify="space-between" mt="md">
          <Button size="xs" variant="outline" onClick={goToPreviousStep}>
            Anterior
          </Button>
          <Button size="xs" onClick={goToNextStep} disabled={!isResponsibleTeamStepValid()}>
            Finalizar
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
