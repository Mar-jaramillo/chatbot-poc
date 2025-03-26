import { IconArrowLeft } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Chip,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { REPORT_STEPS } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { useGenerateReport } from '@/app/hooks';

export function GenerateReport() {
  const { handleReportCancel, userServerResponse } = useAppContext();

  const {
    currentStep,
    formData,
    personalData,
    isUpdatingPersonalInfo,
    updateFormData,
    updatePersonalData,
    goToNextStep,
    goToPreviousStep,
    isPersonalInfoStepValid,
    isLocationStepValid,
    isDetailsStepValid,
    isResponsibleTeamStepValid,
  } = useGenerateReport();

  // Renderizar el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 'PERSONAL_INFO':
        return (
          <Box>
            <Title order={5}>Información Personal</Title>
            <Text mb={15} size="xs">
              Por favor completa tu información personal para continuar con el reporte
            </Text>
            <Divider />
            <Stack py="sm">
              <Select
                size="xs"
                label="Tipo de Persona"
                placeholder="Selecciona un tipo"
                value={personalData.person_type}
                onChange={(value) => updatePersonalData('person_type', value || '')}
                data={[
                  { value: 'NATURAL', label: 'Persona Natural' },
                  { value: 'JURIDICA', label: 'Persona Jurídica' },
                ]}
                required
              />

              <Select
                size="xs"
                label="Tipo de Documento"
                placeholder="Selecciona un tipo de documento"
                value={personalData.document_type}
                onChange={(value) => updatePersonalData('document_type', value || '')}
                data={[
                  { value: 'CC', label: 'Cédula de Ciudadanía' },
                  { value: 'CE', label: 'Cédula de Extranjería' },
                  { value: 'TI', label: 'Tarjeta de Identidad' },
                  { value: 'PASAPORTE', label: 'Pasaporte' },
                  { value: 'NIT', label: 'NIT' },
                ]}
                required
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
                  disabled={!isPersonalInfoStepValid() || isUpdatingPersonalInfo}
                  loading={isUpdatingPersonalInfo}
                >
                  {isUpdatingPersonalInfo ? 'Guardando...' : 'Guardar y Continuar'}
                </Button>
              </Group>
            </Stack>
          </Box>
        );

      case 'LOCATION':
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
                <Button
                  size="xs"
                  variant="outline"
                  onClick={goToPreviousStep}
                  style={{
                    display:
                      !userServerResponse?.person_type ||
                      !userServerResponse?.document_type ||
                      !userServerResponse?.document_number
                        ? 'block'
                        : 'none',
                  }}
                >
                  Anterior
                </Button>
                <Button size="xs" onClick={goToNextStep} disabled={!isLocationStepValid()}>
                  Siguiente
                </Button>
              </Group>
            </Stack>
          </Box>
        );

      case 'DETAILS':
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
      case 'RESPONSIBLE_TEAM':
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
      default:
        return <Text>Error: Paso no encontrado</Text>;
    }
  };

  const renderProgressIndicator = () => {
    const visibleSteps = Object.keys(REPORT_STEPS).filter(
      (step) =>
        step !== 'PERSONAL_INFO' ||
        currentStep === 'PERSONAL_INFO' ||
        !userServerResponse?.person_type ||
        !userServerResponse?.document_type ||
        !userServerResponse?.document_number
    );

    const currentIndex = visibleSteps.indexOf(currentStep);
    const totalSteps = visibleSteps.length;

    return (
      <Group mb="md">
        <ActionIcon onClick={handleReportCancel}>
          <IconArrowLeft size={16} />
        </ActionIcon>
        <Text size="xs">
          Paso {currentIndex + 1} de {totalSteps}
        </Text>
      </Group>
    );
  };

  return (
    <Paper p="lg" radius="lg" shadow="sm">
      {renderProgressIndicator()}
      {renderStepContent()}
    </Paper>
  );
}
