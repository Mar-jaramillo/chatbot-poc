import { useEffect, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Chip,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useAppContext } from '@/app/context';
import type { ReportData } from '@/app/types';

// Definición de pasos simplificada
const REPORT_STEPS = {
  LOCATION: 'location',
  DETAILS: 'details',
} as const;

export function GenerateReport() {
  const { reportData, handleReportUpdate, handleReportComplete, handleReportCancel } =
    useAppContext();

  const [currentStep, setCurrentStep] = useState<keyof typeof REPORT_STEPS>('LOCATION');
  const [formData, setFormData] = useState<ReportData['data']>(reportData.data || {});

  // Efecto para actualizar formData si cambia reportData
  useEffect(() => {
    if (reportData.data) {
      setFormData(reportData.data);
    }
  }, [reportData]);

  // Función para actualizar formData
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para manejar la navegación entre pasos
  const goToNextStep = () => {
    if (currentStep === 'LOCATION') {
      setCurrentStep('DETAILS');
    } else if (currentStep === 'DETAILS') {
      // Actualizar y completar el formulario
      handleReportUpdate(formData);
      handleReportComplete(formData);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'DETAILS') {
      setCurrentStep('LOCATION');
    }
  };

  // Validación de campos por paso
  const isLocationStepValid = () => {
    return (
      (formData.incident_address || '').trim() !== '' &&
      (formData.administrative_area || '').trim() !== '' &&
      (formData.neighborhood || '').trim() !== ''
    );
  };

  const isDetailsStepValid = () => {
    return (
      (formData.request_date || '').trim() !== '' &&
      (formData.description || '').trim() !== '' &&
      (formData.referred_to || '').trim() !== ''
    );
  };

  // Renderizar el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 'LOCATION':
        return (
          <Card p="lg" radius="md" withBorder>
            <Title order={4}>Localización</Title>
            <Text mb={15}>Por favor, proporciona la información de ubicación</Text>

            <Stack>
              <TextInput
                label="Dirección"
                placeholder="Ingresa la dirección completa"
                value={formData.incident_address || ''}
                onChange={(e) => updateFormData('incident_address', e.target.value)}
                required
              />

              <TextInput
                label="Comuna"
                placeholder="Ingresa la comuna"
                value={formData.administrative_area || ''}
                onChange={(e) => updateFormData('administrative_area', e.target.value)}
                required
              />

              <TextInput
                label="Barrio"
                placeholder="Ingresa el barrio"
                value={formData.neighborhood || ''}
                onChange={(e) => updateFormData('neighborhood', e.target.value)}
                required
              />

              <Group mt="md">
                <Button onClick={goToNextStep} disabled={!isLocationStepValid()}>
                  Siguiente
                </Button>
              </Group>
            </Stack>
          </Card>
        );

      case 'DETAILS':
        return (
          <Card p="lg" radius="md" withBorder>
            <Title order={4}>Detalles del Caso</Title>
            <Text mb={15}>Proporciona detalles adicionales sobre el caso</Text>

            <Stack>
              <TextInput
                type="date"
                label="Fecha del Incidente"
                placeholder="Selecciona la fecha"
                value={formData.request_date || ''}
                onChange={(e) => updateFormData('request_date', e.target.value)}
                required
              />

              <Textarea
                label="Descripción"
                placeholder="Describe la situación detalladamente"
                minRows={3}
                value={formData.description || ''}
                onChange={(e) => updateFormData('description', e.target.value)}
                required
              />

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
                <Button variant="outline" onClick={goToPreviousStep}>
                  Anterior
                </Button>
                <Button onClick={goToNextStep} disabled={!isDetailsStepValid()}>
                  Finalizar
                </Button>
              </Group>
            </Stack>
          </Card>
        );

      default:
        return <Text>Error: Paso no encontrado</Text>;
    }
  };

  const renderProgressIndicator = () => {
    const steps = Object.keys(REPORT_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    const totalSteps = steps.length;

    return (
      <Group mb="md">
        <ActionIcon onClick={handleReportCancel}>
          <IconArrowLeft size={16} />
        </ActionIcon>
        <Text size="sm">
          Paso {currentIndex + 1} de {totalSteps}
        </Text>
      </Group>
    );
  };

  return (
    <Box>
      {renderProgressIndicator()}
      {renderStepContent()}
    </Box>
  );
}
