'use client';

import { useCallback } from 'react';
import { IconArrowLeft, IconMessageCircle } from '@tabler/icons-react';
import { DeepChat } from 'deep-chat-react';
import { IntroMessage } from 'deep-chat/dist/types/messages';
import { ActionIcon, Button, Group, Paper, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from '@/app/context';
import { GenerateReport, SummaryReport } from '../generate-report';
import { InitialFormConversation } from '../initial-form-conversation';
import { MenuOptions } from '../menu-options';
import { SatisfactionSurvey } from '../satisfactory-survey';

interface MessageContent {
  text: string;
  role?: string;
}

export function Welcome() {
  const [opened, { toggle }] = useDisclosure(false);
  // Usar el contexto global en lugar de los hooks individuales
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
        const lastMessage = body.messages?.[body.messages.length - 1]?.text;

        if (!lastMessage) {
          signals.onResponse({ error: 'Mensaje no válido' });
          return;
        }

        // Obtener el ID del usuario de la respuesta del servidor
        const userId = userServerResponse?.id || userServerResponse?._id;

        // Objeto de usuario con ID del servidor
        const userWithId = userId
          ? { ...userServerResponse, id: userId } // Añadir el ID si existe
          : userServerResponse; // Usar solo userInfo si no hay ID

        // Conexión normal a la API
        const response = await fetch('http://localhost:8000/api/v1/chats/conversations/ask/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query: lastMessage,
            user: userWithId, // Enviar el usuario con ID
          }),
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        signals.onResponse({
          text: data.response,
          html: userServerResponse ? getMainMenuHtml(userServerResponse.first_name) : '',
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
          // ... configuración existente
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
