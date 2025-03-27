import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { ReportData } from '@/app/types';

type DetailsStepProps = {
  formData: ReportData['data'];
  updateFormData: (field: string, value: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isDetailsStepValid: () => boolean;
};

export function DetailsStep({
  formData,
  updateFormData,
  goToNextStep,
  goToPreviousStep,
  isDetailsStepValid,
}: DetailsStepProps) {
  return (
    <Box>
      <Title order={5}>Detalles del Caso</Title>
      <Text mb={15} size="xs">
        Proporciona detalles adicionales sobre el caso
      </Text>
      <Divider />
      <Stack py="sm">
        <TextInput
          size="xs"
          type="date"
          label="Fecha del Incidente"
          placeholder="Selecciona la fecha"
          value={formData.request_date || ''}
          onChange={(e) => updateFormData('request_date', e.target.value)}
          required
        />

        <Textarea
          size="xs"
          label="Descripción"
          placeholder="Describe la situación detalladamente"
          rows={4}
          minRows={5}
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          required
        />

        <Group justify="space-between" mt="md">
          <Button size="xs" variant="outline" onClick={goToPreviousStep}>
            Anterior
          </Button>
          <Button size="xs" onClick={goToNextStep} disabled={!isDetailsStepValid()}>
            Siguiente
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
