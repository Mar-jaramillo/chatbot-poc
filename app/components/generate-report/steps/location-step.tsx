import { Box, Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useLocationStep } from '@/app/hooks';
import { ReportData } from '@/app/types';
import { CustomHeader } from '../../ui';

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
  const {
    handleCommuneChange,
    getCommuneOptions,
    loadingCommunes,
    getNeighborhoodOptions,
    loadingNeighborhoods,
  } = useLocationStep(formData, updateFormData);

  return (
    <Box>
      <CustomHeader
        title="Localización del Caso"
        subtitle="Nos gustaría saber la ubicación del caso para poder gestionar tu reporte de manera más
        efectiva."
      />

      <Stack py="sm">
        <TextInput
          size="xs"
          label="Dirección"
          placeholder="Ingresa la dirección completa"
          value={formData.incident_address || ''}
          onChange={(e) => updateFormData('incident_address', e.target.value)}
          required
        />

        <Select
          size="xs"
          label="Comuna"
          placeholder="Ingresa la comuna"
          value={formData.administrative_area_id || ''}
          onChange={handleCommuneChange}
          data={getCommuneOptions()}
          required
          disabled={loadingCommunes}
        />

        <Select
          size="xs"
          label="Barrio"
          placeholder="Selecciona un barrio"
          value={formData.neighborhood_id || ''}
          onChange={(value) => updateFormData('neighborhood_id', value || '')}
          data={getNeighborhoodOptions() || []}
          required
          disabled={loadingNeighborhoods || !formData.administrative_area_id}
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
