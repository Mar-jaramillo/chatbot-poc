import { useRef } from 'react';
import { DeepChat } from 'deep-chat-react';
import { Paper, Text } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { useDeepChatConnect } from '@/app/hooks';
import {
  FollowUpDetails,
  FollowUpReport,
  GenerateReport,
  InitialFormConversation,
  InitialOptions,
  MenuOptions,
  ReferenceNumber,
  SatisfactionSurvey,
  SummaryReport,
} from '../components';
import { ViewEnum } from '../types';

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
      case ViewEnum.INITIAL:
        return <InitialOptions />;
      case ViewEnum.LOGIN:
        return <InitialFormConversation />;
      case ViewEnum.MENU:
        return <MenuOptions />;
      case ViewEnum.REPORT:
        return (
          <GenerateReport
            reportData={reportData}
            onUpdateData={handleReportUpdate}
            onComplete={handleReportComplete}
            onCancel={handleReportCancel}
          />
        );
      case ViewEnum.SUMMARY:
        return (
          <SummaryReport
            data={reportData.data}
            onConfirm={handleReportConfirm}
            onCancel={handleReportCancel}
          />
        );
      case ViewEnum.SURVEY:
        return (
          <SatisfactionSurvey
            customerId={userServerResponse?.id || ''}
            onComplete={handleSurveyComplete}
            onError={handleSurveyError}
          />
        );
      case ViewEnum.REFERENCE_NUMBER:
        return (
          <ReferenceNumber
            referenceNumber={reportData.data.reference_number || ''}
            status={reportData.data.status || 'PENDING'}
          />
        );
      case ViewEnum.FOLLOW_UP:
        return <FollowUpReport />;
      case ViewEnum.FOLLOW_UP_DETAILS:
        return <FollowUpDetails />;
      case ViewEnum.CHAT:
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
