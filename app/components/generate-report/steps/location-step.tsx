import { Button, Box, Divider, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { ReportData } from '@/app/types';

type LocationStepProps = {
  formData: ReportData['data'];
  updateFormData: (field: string, value: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isLocationStepValid: () => boolean;
  showPreviousButton: boolean;
};

export function LocationStep({
  formData,
  updateFormData,
  goToNextStep,
  goToPreviousStep,
  isLocationStepValid,
  showPreviousButton,
}: LocationStepProps) {
  return (
    <Box>
      <Title order={5}>Localización</Title>
      <Text mb={15} size="xs">
        Nos gustaría saber la ubicación del caso para poder gestionar tu reporte de manera más
        efectiva.
      </Text>
      <Divider />
      <Stack py="sm">
        <TextInput
          size="xs"
          label="Dirección"
          placeholder="Ingresa la dirección completa"
          value={formData.incident_address || ''}
          onChange={(e) => updateFormData('incident_address', e.target.value)}
          required
        />

        <TextInput
          size="xs"
          label="Comuna"
          placeholder="Ingresa la comuna"
          value={formData.administrative_area || ''}
          onChange={(e) => updateFormData('administrative_area', e.target.value)}
          required
        />

        <TextInput
          size="xs"
          label="Barrio"
          placeholder="Ingresa el barrio"
          value={formData.neighborhood || ''}
          onChange={(e) => updateFormData('neighborhood', e.target.value)}
          required
        />

        <Group mt="md">
          {showPreviousButton && (
            <Button size="xs" variant="outline" onClick={goToPreviousStep}>
              Anterior
            </Button>
          )}
          <Button size="xs" onClick={goToNextStep} disabled={!isLocationStepValid()}>
            Siguiente
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}