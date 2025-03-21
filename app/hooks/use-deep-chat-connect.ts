import { IntroMessage } from 'deep-chat/dist/types/messages';
import { API_BASE_URL } from '../consts';
import { useAppContext } from '../context';
import { MessageContent } from '../types';
import { getInitialMenuAskHtml } from '../utils';

export function useDeepChatConnect() {
  const { userServerResponse } = useAppContext();

  const initialMessages: IntroMessage[] = [
    {
      html: userServerResponse ? getInitialMenuAskHtml(userServerResponse?.first_name) : '',
    },
  ];

  const connect = {
    handler: async (body: { messages: MessageContent[] }, signals: any) => {
      try {
        const lastMessage = body.messages?.[body.messages.length - 1]?.text;

        if (!lastMessage) {
          signals.onResponse({
            text: 'Por favor, ingresa un mensaje válido.',
            role: 'assistant',
          });
          return;
        }
        const userId = userServerResponse?.id;
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

        if (!response.ok) {
          const errorData = await response.json();

          if (
            errorData.type === 'validation_error' &&
            errorData.errors &&
            errorData.errors.some((err: { code: string }) => err.code === 'question_limit_exceeded')
          ) {
            signals.onResponse({
              text: 'Has alcanzado el límite de preguntas para esta conversación. Por favor vuelve al menú principal si deseas hacer un reporte.',
              role: 'assistant',
            });
            return;
          }

          let errorMessage =
            'Lo sentimos, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente más tarde.';

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

        signals.onResponse({
          text: data.chat_response,
          role: 'assistant',
        });
      } catch (error) {
        signals.onResponse({
          text: 'Lo sentimos, ha ocurrido un problema de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.',
          role: 'assistant',
        });
      }
    },
  };
  return { connect, initialMessages };
}
