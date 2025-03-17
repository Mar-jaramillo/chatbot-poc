'use client';

import { useCallback, useEffect, useRef } from 'react';
import { IconArrowLeft, IconCheck, IconMessageChatbot } from '@tabler/icons-react';
import { DeepChat } from 'deep-chat-react';
import { IntroMessage } from 'deep-chat/dist/types/messages';
import { ActionIcon, Button, Group, Paper, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
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
    handleMenuSelection,
    handleSurveyComplete,
    handleSurveyError,
  } = useAppContext();

  const submitFeedback = async (isSatisfactory: boolean) => {
    if (!userServerResponse?.id) {
      return;
    }

    isProcessingSatisfaction.current = true;

    try {
      const response = await fetch(`${API_BASE_URL}/chats/conversations/satisfaction/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userServerResponse.id,
          is_satisfactory: isSatisfactory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la encuesta de satisfacción');
      }

      notifications.show({
        id: 'feedback-success',
        title: '¡Gracias por tu feedback!',
        message: 'Tu opinión nos ayuda a mejorar',
        color: 'blue',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error al enviar feedback:', error);
    } finally {
      setTimeout(() => {
        isProcessingSatisfaction.current = false;
      }, 500);
    }
  };

  // HTML para los botones de satisfacción - usamos identificadores únicos
  const getSatisfactionHtml = () => `
    <div class="deep-chat-temporary-message" style="display: flex; flex-direction: column; gap: 10px; width: 100%; text-align: center; margin-top: 8px;">
      <div style="background-color: #f8f9fa; padding: 12px; border-radius: 8px; text-align: center; color: #495057; font-size: 14px;">
        ¿Te fue útil esta respuesta?
      </div>
      <div style="display: flex; justify-content: center; gap: 16px; margin-top: 8px;">
        <button
          class="satisfaction-button satisfaction-yes"
          onclick="window.postMessage({type: 'satisfactionFeedback', value: true}, '*')"
          style="padding: 8px 20px; border: 1px solid #12B886; border-radius: 4px; background-color: white; color: #12B886; font-weight: 500;"
        >
          Sí
        </button>
        <button
          class="satisfaction-button satisfaction-no"
          onclick="window.postMessage({type: 'satisfactionFeedback', value: false}, '*')"
          style="padding: 8px 20px; border: 1px solid #FA5252; border-radius: 4px; background-color: white; color: #FA5252; font-weight: 500;"
        >
          No
        </button>
      </div>
    </div>
  `;

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

  // Escuchar mensajes de la ventana para los botones de satisfacción
  useEffect(() => {
    // Función para prevenir que los botones de satisfacción envíen mensajes
    const preventSatisfactionSubmit = (e: MouseEvent) => {
      // Verificar si el clic fue en un botón de satisfacción
      const target = e.target as HTMLElement;
      if (target.classList.contains('satisfaction-button')) {
        e.preventDefault();
        e.stopPropagation();

        // Determinar qué tipo de botón de satisfacción se hizo clic
        const isSatisfied = target.classList.contains('satisfaction-yes');

        // Enviar feedback
        submitFeedback(isSatisfied);

        // Actualizar la UI para dar retroalimentación visual
        const satisfactionContainer = target.closest('.deep-chat-temporary-message');
        if (satisfactionContainer) {
          satisfactionContainer.innerHTML = `
            <div style="background-color: #e9fef6; padding: 12px; border-radius: 8px; text-align: center; color: #12B886; font-size: 14px;">
              ¡Gracias por tu feedback!
            </div>
          `;
        }

        return false;
      }
    };

    // Agregar handler para clics en el documento
    document.addEventListener('click', preventSatisfactionSubmit as unknown as EventListener, true);

    // Handler para mensajes de window.postMessage
    const handleCustomEvent = (event: MessageEvent) => {
      if (event.data.type === 'satisfactionFeedback') {
        submitFeedback(event.data.value);
      }
    };

    window.addEventListener('message', handleCustomEvent);

    return () => {
      document.removeEventListener(
        'click',
        preventSatisfactionSubmit as unknown as EventListener,
        true
      );
      window.removeEventListener('message', handleCustomEvent);
    };
  }, [userServerResponse]);

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
              text: 'Has alcanzado el límite de preguntas para esta conversación. Si necesitas seguir conversando, por favor vuelve al menú principal.',
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
          html: getSatisfactionHtml(),
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

  // Configuración simple de errorMessages según la documentación
  const errorMessages = {
    displayServiceErrorMessages: false,
    overrides: {
      default: 'Lo sentimos, ha ocurrido un error. Por favor, inténtalo de nuevo.',
      service: 'Has alcanzado el límite de preguntas para esta conversación.',
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
            // Configuración de errores - desactivar mensajes de error nativos
            errorMessages={{
              displayServiceErrorMessages: false, // No mostrar errores del servicio

              overrides: {
                default: '', // Mensaje vacío para no mostrar errores nativos
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
          <ActionIcon
            variant="filled"
            color="blue"
            size="4rem"
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
            <IconMessageChatbot size={40} stroke={1.5} />
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
