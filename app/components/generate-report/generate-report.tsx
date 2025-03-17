import { useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Card, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import type { ReportData } from '@/app/types';

interface ReportFormProps {
  reportData: ReportData;
  onUpdateData: (data: ReportData['data']) => void;
  onComplete: (data: ReportData['data']) => void;
  onCancel: () => void;
}

const REPORT_STEPS = {
  INCIDENT_ADDRESS: 'incident_address',
  ADMINISTRATIVE_AREA: 'administrative_area',
  NEIGHBORHOOD: 'neighborhood',
  PERSON_TYPE: 'personType',
  ID_TYPE: 'idType',
  ID_NUMBER: 'idNumber',
  DESCRIPTION: 'description',
  referred_to: 'referred_to',
} as const;

export function GenerateReport({
  reportData,
  onUpdateData,
  onComplete,
  onCancel,
}: ReportFormProps) {
  const [currentStep, setCurrentStep] = useState<(typeof REPORT_STEPS)[keyof typeof REPORT_STEPS]>(
    REPORT_STEPS.INCIDENT_ADDRESS
  );
  const [formData, setFormData] = useState<ReportData['data']>(reportData.data || {});
  const [inputValue, setInputValue] = useState<string>('');

  const handleOptionSelect = (value: string) => {
    const updatedData = { ...formData, [currentStep]: value };
    setFormData(updatedData);

    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep);
      setInputValue('');
    } else {
      // Si no hay siguiente paso, hemos terminado
      onUpdateData(updatedData);
      onComplete(updatedData);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    handleOptionSelect(inputValue);
  };

  const getNextStep = (
    step: (typeof REPORT_STEPS)[keyof typeof REPORT_STEPS]
  ): (typeof REPORT_STEPS)[keyof typeof REPORT_STEPS] => {
    const steps = [
      REPORT_STEPS.INCIDENT_ADDRESS,
      REPORT_STEPS.ADMINISTRATIVE_AREA,
      REPORT_STEPS.NEIGHBORHOOD,
      REPORT_STEPS.PERSON_TYPE,
      REPORT_STEPS.ID_TYPE,
      REPORT_STEPS.ID_NUMBER,
      REPORT_STEPS.DESCRIPTION,
      REPORT_STEPS.referred_to,
    ];

    const currentIndex = steps.indexOf(step);
    return steps[currentIndex + 1] || '';
  };

  interface StepConfig {
    title: string;
    text: string;
    subtitle?: string;
    type?: 'input';
    options?: string[];
  }

  const renderStepContent = () => {
    const steps: Record<string, StepConfig> = {
      [REPORT_STEPS.INCIDENT_ADDRESS]: {
        title: 'Dirección',
        text: '¿Cuál es la dirección donde se encuentra la persona?',
        subtitle: 'Por favor, escribe la dirección lo más detallada posible.',
        type: 'input',
      },
      [REPORT_STEPS.ADMINISTRATIVE_AREA]: {
        title: 'administrative_area',
        text: 'Comuna:',
        type: 'input',
      },
      [REPORT_STEPS.NEIGHBORHOOD]: {
        title: 'Barrio',
        text: '¿En qué barrio se encuentra?',
        type: 'input',
      },
      [REPORT_STEPS.PERSON_TYPE]: {
        title: 'Tipo de Persona',
        text: 'Selecciona el tipo de persona:',
        options: ['Persona Natural', 'Persona Jurídica'],
      },
      [REPORT_STEPS.ID_TYPE]: {
        title: 'Tipo de Identificación',
        text: 'Tipo de identificación:',
        options: ['CC', 'NIT', 'CE', 'TI', 'RC'],
      },
      [REPORT_STEPS.ID_NUMBER]: {
        title: 'Número de Identificación',
        text: 'Número de identificación:',
        type: 'input',
      },
      [REPORT_STEPS.DESCRIPTION]: {
        title: 'Descripción',
        text: 'Describe la situación:',
        subtitle: 'Proporciona todos los detalles relevantes que puedas.',
        type: 'input',
      },
      [REPORT_STEPS.referred_to]: {
        title: 'Equipo',
        text: 'Selecciona el equipo al que se remitirá:',
        options: ['Equipo en calle', 'Equipo de redes', 'Psicosocial', 'Otros'],
      },
    };

    const currentStepConfig = steps[currentStep];

    if (!currentStepConfig) {
      return <Text>Error: Paso no encontrado</Text>;
    }

    return (
      <Card p="lg" radius="md" withBorder style={{ maxWidth: '100%' }}>
        <Title order={4}>{currentStepConfig.title}</Title>
        <Text mb={10}>{currentStepConfig.text}</Text>

        {currentStepConfig.subtitle && (
          <Text size="sm" c="dimmed" mb={15}>
            {currentStepConfig.subtitle}
          </Text>
        )}

        {currentStepConfig.type === 'input' ? (
          <form onSubmit={handleInputSubmit}>
            <Group>
              <TextInput
                placeholder="Escribe tu respuesta"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit">Siguiente</Button>
            </Group>
          </form>
        ) : (
          <Stack mt="md">
            {currentStepConfig.options?.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => handleOptionSelect(option)}
                fullWidth
              >
                {option}
              </Button>
            ))}
          </Stack>
        )}
      </Card>
    );
  };

  const renderProgressIndicator = () => {
    const steps = Object.values(REPORT_STEPS);
    const currentIndex = steps.indexOf(currentStep);
    const totalSteps = steps.length;

    return (
      <Group mb="md">
        <ActionIcon onClick={onCancel}>
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
