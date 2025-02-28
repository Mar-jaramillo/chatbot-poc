'use client';

import React, { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconArrowLeft, IconMessageCircle } from '@tabler/icons-react';
import { DeepChat } from 'deep-chat-react';
import { IntroMessage } from 'deep-chat/dist/types/messages';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Popover,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Definir el esquema de validación
const schema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
});

type FormData = z.infer<typeof schema>;

interface UserInfo {
  name: string;
  email: string;
}

interface MessageContent {
  text: string;
  role?: string;
}

interface ReportData {
  currentStep: string;
  data: {
    address?: string;
    comuna?: string;
    neighborhood?: string;
    personType?: string;
    idType?: string;
    idNumber?: string;
    description?: string;
    team?: string;
  };
  isComplete: boolean;
}

const REPORT_STEPS = {
  ADDRESS: 'address',
  COMUNA: 'comuna',
  NEIGHBORHOOD: 'neighborhood',
  PERSON_TYPE: 'personType',
  ID_TYPE: 'idType',
  ID_NUMBER: 'idNumber',
  DESCRIPTION: 'description',
  TEAM: 'team',
} as const;

type ReportStep = keyof typeof REPORT_STEPS;

interface ReportFormProps {
  reportData: ReportData;
  onUpdateData: (data: ReportData['data']) => void;
  onComplete: (data: ReportData['data']) => void;
  onCancel: () => void;
}

interface ReportSummaryProps {
  data: ReportData['data'];
  onConfirm: () => void;
  onCancel: () => void;
}

interface IntermediateMenuProps {
  userInfo: UserInfo;
  onSelectOption: (option: 'chat' | 'report') => void;
}

type ViewType = 'login' | 'menu' | 'chat' | 'report' | 'summary';

// Componente para el reporte paso a paso
const ReportForm: React.FC<ReportFormProps> = ({
  reportData,
  onUpdateData,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<(typeof REPORT_STEPS)[keyof typeof REPORT_STEPS]>(
    REPORT_STEPS.ADDRESS
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
      REPORT_STEPS.ADDRESS,
      REPORT_STEPS.COMUNA,
      REPORT_STEPS.NEIGHBORHOOD,
      REPORT_STEPS.PERSON_TYPE,
      REPORT_STEPS.ID_TYPE,
      REPORT_STEPS.ID_NUMBER,
      REPORT_STEPS.DESCRIPTION,
      REPORT_STEPS.TEAM,
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
      [REPORT_STEPS.ADDRESS]: {
        title: 'Dirección',
        text: '¿Cuál es la dirección donde se encuentra la persona?',
        subtitle: 'Por favor, escribe la dirección lo más detallada posible.',
        type: 'input',
      },
      [REPORT_STEPS.COMUNA]: {
        title: 'Comuna',
        text: 'Selecciona la comuna:',
        options: ['Comuna 1', 'Comuna 2', 'Comuna 3', 'Comuna 4'],
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
      [REPORT_STEPS.TEAM]: {
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
};

// Componente de resumen del reporte
const ReportSummary: React.FC<ReportSummaryProps> = ({ data, onConfirm, onCancel }) => {
  return (
    <Card p="lg" radius="md" withBorder>
      <Title order={4}>Resumen del reporte</Title>
      <Box my="md">
        <Text>
          <strong>Dirección:</strong> {data.address || '-'}
        </Text>
        <Text>
          <strong>Comuna:</strong> {data.comuna || '-'}
        </Text>
        <Text>
          <strong>Barrio:</strong> {data.neighborhood || '-'}
        </Text>
        <Text>
          <strong>Tipo de persona:</strong> {data.personType || '-'}
        </Text>
        <Text>
          <strong>Tipo de ID:</strong> {data.idType || '-'}
        </Text>
        <Text>
          <strong>Número de ID:</strong> {data.idNumber || '-'}
        </Text>
        <Text>
          <strong>Descripción:</strong> {data.description || '-'}
        </Text>
        <Text>
          <strong>Equipo:</strong> {data.team || '-'}
        </Text>
      </Box>
      <Group >
        <Button variant="outline" color="red" onClick={onCancel}>
          Cancelar
        </Button>
        <Button color="green" onClick={onConfirm}>
          Confirmar y enviar
        </Button>
      </Group>
    </Card>
  );
};

// Menú intermedio con opciones
const IntermediateMenu: React.FC<IntermediateMenuProps> = ({ userInfo, onSelectOption }) => {
  return (
    <Stack p="md">
      <Text size="lg" fw={500} ta="center">
        ¡Hola {userInfo.name}!
      </Text>
      <Text size="md" ta="center">
        ¿Qué deseas hacer?
      </Text>

      <Button
        variant="outline"
        onClick={() => onSelectOption('chat')}
        my={5}
        leftSection={<IconMessageCircle size={16} />}
      >
        Hacer una pregunta
      </Button>

      <Button variant="filled" onClick={() => onSelectOption('report')} color="blue">
        📝 Crear nuevo reporte
      </Button>
    </Stack>
  );
};

export function Welcome() {
  const [opened, { toggle }] = useDisclosure(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [reportData, setReportData] = useState<ReportData>({
    currentStep: '',
    data: {},
    isComplete: false,
  });

  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setUserInfo(data);
    setCurrentView('menu'); // Ir al menú intermedio después del login
  };

  const handleMenuSelection = (option: 'chat' | 'report') => {
    setCurrentView(option);
  };

  const handleReportUpdate = (data: ReportData['data']) => {
    setReportData((prev) => ({
      ...prev,
      data,
    }));
  };

  const handleReportComplete = (data: ReportData['data']) => {
    setReportData({
      currentStep: '',
      data,
      isComplete: true,
    });
    setCurrentView('summary');
  };

  const handleReportCancel = () => {
    setReportData({
      currentStep: '',
      data: {},
      isComplete: false,
    });
    setCurrentView('menu');
  };

  const handleReportConfirm = async () => {
    try {
      console.log('Enviando reporte:', reportData.data);

      const response = await fetch('http://127.0.0.1:8000/report/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reportData.data,
          user_id: userInfo?.email,
        }),
      });

      if (response.ok) {
        alert('Reporte enviado exitosamente');
        setReportData({
          currentStep: '',
          data: {},
          isComplete: false,
        });
        setCurrentView('menu');
      } else {
        throw new Error('Error al crear el reporte');
      }
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      alert('Error al enviar el reporte. Por favor, intenta nuevamente.');
    }
  };

  const getMainMenuHtml = useCallback(
    (name: string): string => `
    <div class="deep-chat-temporary-message" style="display: flex; flex-direction: column; gap: 10px;">
      <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; text-align: left; color: #495057; font-size: 12px;">
        ¡Hola ${name}! ¿Cómo podemos ayudarte?
      </div>
      <button
        class="deep-chat-button deep-chat-suggestion-button"
        onclick="window.postMessage({type: 'customOption', value: '¿Cómo actuar si un habitante de calle tiene convulsiones?'}, '*')"
        style="margin-top: 6px; width: 100%; text-align: left;"
      >
        ¿Cómo actuar si un habitante de calle tiene convulsiones?
      </button>
      <button
        class="deep-chat-button deep-chat-suggestion-button"
        onclick="window.postMessage({type: 'customOption', value: '¿Dónde puedo encontrar ayuda para habitantes de calle?'}, '*')"
        style="margin-top: 6px; width: 100%; text-align: left;"
      >
        🏠 Centros de ayuda
      </button>
    </div>
  `,
    []
  );

  const initialMessages: IntroMessage[] = [
    {
      html: userInfo ? getMainMenuHtml(userInfo.name) : '',
    },
  ];

  const connect = {
    handler: async (body: { messages: MessageContent[] }, signals: any) => {
      try {
        const lastMessage = body.messages?.[body.messages.length - 1]?.text;

        if (!lastMessage) {
          signals.onResponse({ error: 'Mensaje no válido' });
          return;
        }

        // Conexión normal a la API
        const response = await fetch('http://127.0.0.1:8000/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query: lastMessage,
            user: userInfo,
          }),
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        signals.onResponse({
          text: data.response,
          html: userInfo ? getMainMenuHtml(userInfo.name) : '',
          role: 'assistant',
        });
      } catch (error) {
        console.error('Error en el handler:', error);
        signals.onResponse({
          error: 'Error de conexión con el servidor. Por favor, intenta más tarde.',
        });
      }
    },
  };

  const InitialForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack p="md">
        <Stack>
          <Text size="md" fw={500} ta="center">
            Antes de comenzar, por favor completa tus datos
          </Text>
        </Stack>

        <TextInput
          label="Nombre"
          placeholder="Tu nombre"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <TextInput
          label="Correo electrónico"
          placeholder="tucorreo@ejemplo.com"
          {...register('email')}
          error={errors.email?.message}
          required
        />
        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Tu privacidad es muy importante para nosotros. <br />
          Al continuar, aceptas que tus datos se utilicen únicamente con fines de registro y
          seguimiento del programa. No compartiremos tu información con terceros.
        </Text>
        <Stack>
          <Button type="submit" loading={isSubmitting} fullWidth>
            Comenzar
          </Button>
        </Stack>
      </Stack>
    </form>
  );

  // Renderiza el contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <InitialForm />;
      case 'menu':
        return userInfo ? (
          <IntermediateMenu userInfo={userInfo} onSelectOption={handleMenuSelection} />
        ) : null;
      case 'report':
        return (
          <ReportForm
            reportData={reportData}
            onUpdateData={handleReportUpdate}
            onComplete={handleReportComplete}
            onCancel={handleReportCancel}
          />
        );
      case 'summary':
        return (
          <ReportSummary
            data={reportData.data}
            onConfirm={handleReportConfirm}
            onCancel={handleReportCancel}
          />
        );
      case 'chat':
        return (
          <DeepChat
            connect={connect}
            style={{ border: 'none' }}
            introMessage={initialMessages}
            messageStyles={{
              html: {
                shared: {
                  bubble: {
                    backgroundColor: 'unset',
                    padding: '0px',
                  },
                },
              },
            }}
            textInput={{
              placeholder: { text: 'Envía un mensaje' },
              styles: {
                container: {
                  boxShadow: 'none',
                  borderRadius: '1em',
                  border: '1px solid rgba(0,0,0,0.2)',
                },
                text: {
                  padding: '0.4em 0.8em',
                  paddingRight: '2.5em',
                },
              },
            }}
            submitButtonStyles={{
              submit: {
                container: {
                  default: {
                    paddingRight: '0.3em',
                    backgroundColor: '#00c82a',
                  },
                },
              },
            }}
          />
        );
      default:
        return <Text>Error: Vista no encontrada</Text>;
    }
  };

  // Componente para mostrar el botón de volver al menú (solo en la vista de chat)
  const BackToMenuButton = () => {
    if (currentView !== 'chat') {
      return null;
    }

    return (
      <Group justify="flex-start" mb="md">
        <Button size="xs" variant="subtle" onClick={() => setCurrentView('menu')}>
          <Group>
            <IconArrowLeft size={16} />
            <span>Volver al menú</span>
          </Group>
        </Button>
      </Group>
    );
  };

  return (
    <>
      <Popover opened={opened} onChange={toggle} position="top-end" offset={20} withArrow>
        <Popover.Target>
          <ActionIcon
            variant="filled"
            color="blue"
            size="xl"
            radius="xl"
            aria-label="Abrir chat"
            onClick={toggle}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 1000,
            }}
          >
            <IconMessageCircle size={24} stroke={1.5} />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown>
          <Paper style={{ width: '350px' }}>
            <BackToMenuButton />
            {renderContent()}
          </Paper>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
