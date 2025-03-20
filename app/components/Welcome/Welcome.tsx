'use client';

import { useCallback, useRef } from 'react';
import { IconArrowLeft, IconMessageChatbot } from '@tabler/icons-react';
import { DeepChat } from 'deep-chat-react';
import { IntroMessage } from 'deep-chat/dist/types/messages';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Group,
  Indicator,
  Paper,
  Popover,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { API_BASE_URL } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { GenerateReport, SummaryReport } from '../generate-report';
import { InitialFormConversation } from '../initial-form-conversation';
import { MenuOptions } from '../menu-options';
import { SatisfactionSurvey } from '../satisfactory-survey';

interface MessageContent {
  text: string;
  role?: string;
  html?: string;
}

export function Welcome() {
  const [opened, { toggle }] = useDisclosure(false);
  const deepChatRef = useRef(null);
  const isProcessingSatisfaction = useRef(false);

  const {
    userServerResponse,
    currentView,
    reportData,
    setCurrentView,
    handleReportUpdate,
    handleReportComplete,
    handleReportCancel,
    handleReportConfirm,
    handleSurveyComplete,
    handleSurveyError,
  } = useAppContext();

  const getMainMenuHtml = useCallback(
    (first_name: string): string => `
    <div class="deep-chat-temporary-message" style="display: flex; flex-direction: column; gap: 10px;">
      <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; text-align: left; color: #495057; font-size: 12px;">
        ¡Hola ${first_name}! ¿Cómo podemos ayudarte?
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
      html: userServerResponse ? getMainMenuHtml(userServerResponse?.first_name) : '',
    },
  ];

  const connect = {
    handler: async (body: { messages: MessageContent[] }, signals: any) => {
      try {
        // Si estamos procesando una respuesta de satisfacción, no hacer nada
        if (isProcessingSatisfaction.current) {
          return;
        }

        const lastMessage = body.messages?.[body.messages.length - 1]?.text;

        // Verificar si parece una respuesta de satisfacción
        if (lastMessage && (lastMessage === 'Sí' || lastMessage === 'No')) {
          // No enviar estos mensajes al servidor
          return;
        }

        if (!lastMessage) {
          // Enviar un mensaje de error amigable al chat
          signals.onResponse({
            text: 'Por favor, ingresa un mensaje válido.',
            role: 'assistant',
          });
          return;
        }

        // Obtener el ID del usuario
        const userId = userServerResponse?.id;

        // Conexión normal a la API
        const response = await fetch(`${API_BASE_URL}/chats/conversations/ask/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            customer_query: lastMessage,
            customer_id: userId,
          }),
        });

        // Verificar si hubo un error
        if (!response.ok) {
          const errorData = await response.json();

          // Manejar el error específico de límite de preguntas
          if (
            errorData.type === 'validation_error' &&
            errorData.errors &&
            errorData.errors.some((err) => err.code === 'question_limit_exceeded')
          ) {
            // Enviar un mensaje amigable al chat sobre el límite alcanzado
            signals.onResponse({
              text: 'Has alcanzado el límite de preguntas para esta conversación. Por favor vuelve al menú principal si deseas hacer un reporte.',
              role: 'assistant',
            });
            return;
          }

          // Para otros errores del servidor
          let errorMessage =
            'Lo sentimos, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente más tarde.';

          // Si hay un mensaje de error específico del servidor, usarlo
          if (errorData.message) {
            errorMessage = `Error: ${errorData.message}`;
          }

          signals.onResponse({
            text: errorMessage,
            role: 'assistant',
          });
          return;
        }

        const data = await response.json();

        // Respuesta normal con la encuesta de satisfacción integrada como HTML
        signals.onResponse({
          text: data.chat_response,
          role: 'assistant',
        });
      } catch (error) {
        // Error de conexión u otro error inesperado
        signals.onResponse({
          text: 'Lo sentimos, ha ocurrido un problema de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.',
          role: 'assistant',
        });
      }
    },
  };

  // Renderiza el contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <InitialFormConversation />;
      case 'menu':
        return <MenuOptions />;
      case 'report':
        return (
          <GenerateReport
            reportData={reportData}
            onUpdateData={handleReportUpdate}
            onComplete={handleReportComplete}
            onCancel={handleReportCancel}
          />
        );
      case 'summary':
        return (
          <SummaryReport
            data={reportData.data}
            onConfirm={handleReportConfirm}
            onCancel={handleReportCancel}
          />
        );
      case 'survey':
        return (
          <SatisfactionSurvey
            customerId={userServerResponse?.id || ''}
            onComplete={handleSurveyComplete}
            onError={handleSurveyError}
          />
        );
      case 'chat':
        return (
          <DeepChat
            ref={deepChatRef}
            connect={connect}
            style={{ border: 'none' }}
            introMessage={initialMessages}
            errorMessages={{
              displayServiceErrorMessages: false,
              overrides: {
                default: '',
                service: '',
              },
            }}
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
          <Box
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '3rem',
              zIndex: 1000,
            }}
          >
            <Tooltip label="¿Necesitas ayuda?" opened position="left" color="blue">
              <Avatar
                variant="transparent"
                size="xl"
                component="button"
                onClick={toggle}
                src="/images/abbi-avatar.png"
                alt="it's me"
              />
            </Tooltip>
          </Box>
        </Popover.Target>

        <Popover.Dropdown>
          <Group>
            <Avatar src="/images/abbi-avatar.png" size="lg" radius="xl" />
            <Stack gap={5}>
              <Text size="lg" fw={700} style={{ lineHeight: 1 }}>
                Abby
              </Text>

              <Anchor
                href="https://x.com/mantinedev"
                c="dimmed"
                size="xs"
                style={{ lineHeight: 1 }}
              >
                Online chatbot
              </Anchor>
            </Stack>
          </Group>
          <Paper style={{ width: '350px' }}>
            <BackToMenuButton />
            {renderContent()}
          </Paper>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
