import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useFormOptions } from '@/app/hooks';

type PersonalInfoStepProps = {
  personalData: {
    person_type: string;
    document_type: string;
    organization_name?: string;
    document_number: string;
  };
  updatePersonalData: (field: string, value: string) => void;
  isUpdatingPersonalInfo: boolean;
  isPersonalInfoStepValid: () => boolean;
  goToNextStep: () => void;
};

export function PersonalInfoStep({
  personalData,
  updatePersonalData,
  isUpdatingPersonalInfo,
  isPersonalInfoStepValid,
  goToNextStep,
}: PersonalInfoStepProps) {
  const { personTypeOptions, documentTypeOptions, isLoading, error } = useFormOptions();

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

      <Title order={5}>Información Personal</Title>
      <Text mb={15} size="xs">
        Por favor completa tu información personal para continuar con el reporte
      </Text>
      <Divider />

      {error && (
        <Text c="red" size="xs" mt="xs">
          Error al cargar los datos: {error}. Por favor, intenta de nuevo más tarde.
        </Text>
      )}

      <Stack py="sm">
        <Select
          size="xs"
          label="Tipo de Persona"
          placeholder="Selecciona un tipo"
          value={personalData.person_type}
          onChange={(value) => updatePersonalData('person_type', value || '')}
          data={personTypeOptions}
          required
          disabled={isLoading}
        />

        <TextInput
          size="xs"
          label="Razón Social"
          placeholder="Ingresa la razón social"
          value={personalData.organization_name}
          onChange={(e) => updatePersonalData('organization_name', e.target.value)}
        />
        <Select
          size="xs"
          label="Tipo de Documento"
          placeholder="Selecciona un tipo de documento"
          value={personalData.document_type}
          onChange={(value) => updatePersonalData('document_type', value || '')}
          data={documentTypeOptions}
          required
          disabled={isLoading}
        />

        <TextInput
          size="xs"
          label="Número de Documento"
          placeholder="Ingresa tu número de documento"
          value={personalData.document_number}
          onChange={(e) => updatePersonalData('document_number', e.target.value)}
          required
        />

        <Group mt="md">
          <Button
            size="xs"
            onClick={goToNextStep}
            disabled={!isPersonalInfoStepValid() || isUpdatingPersonalInfo || isLoading}
            loading={isUpdatingPersonalInfo}
          >
            {isUpdatingPersonalInfo ? 'Guardando...' : 'Guardar y Continuar'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
