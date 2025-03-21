import { useRef } from 'react';
import { DeepChat } from 'deep-chat-react';
import { Text } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { useDeepChatConnect } from '@/app/hooks';
import { GenerateReport, SummaryReport } from '../components/generate-report';
import { InitialFormConversation } from '../components/initial-form-conversation';
import { MenuOptions } from '../components/menu-options';
import { SatisfactionSurvey } from '../components/satisfactory-survey';

export function useViewsContent() {
  const deepChatRef = useRef(null);
  const { connect, initialMessages } = useDeepChatConnect();
  const {
    userServerResponse,
    currentView,
    reportData,
    handleReportUpdate,
    handleReportComplete,
    handleReportCancel,
    handleReportConfirm,
    handleSurveyComplete,
    handleSurveyError,
  } = useAppContext();

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

  return { renderContent };
}
