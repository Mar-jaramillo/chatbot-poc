'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '@/app/consts';
import { CostumerInitialInfo, FollowUpData, ReportData, ViewEnum, ViewType } from '@/app/types';
import { ConfirmationModal } from '../components/ui';
import { useCreateCustomer } from '../services';

interface AppContextProps {
  userServerResponse: CostumerInitialInfo | null;
  currentView: ViewType;
  reportData: ReportData;
  followUpData: FollowUpData | null; // Add follow-up data
  setCurrentView: (view: ViewType) => void;
  setUserServerResponse: (data: CostumerInitialInfo | null) => void;
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>;
  setFollowUpData: (data: FollowUpData | null) => void; // Add setter for follow-up data
  onSubmitInitialData: (data: CostumerInitialInfo) => Promise<void>;
  handleReportConfirm: () => Promise<void>;
  handleReportUpdate: (data: ReportData['data']) => void;
  handleReportComplete: (data: ReportData['data']) => void;
  handleReportCancel: () => void;
  handleMenuSelection: (option: ViewEnum) => void;
  handleSurveyComplete: () => void;
  handleSurveyError: (error: Error) => void;
  handleGoToMenu: () => void;
  confirmModalProps: {
    opened: boolean;
    open: () => void;
    close: () => void;
  };
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userServerResponse, setUserServerResponse] = useState<CostumerInitialInfo | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>(ViewEnum.INITIAL);
  const [reportData, setReportData] = useState<ReportData>({
    currentStep: '',
    data: {},
    isComplete: false,
  });
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
    useDisclosure(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: 'Confirmar acción',
    message: '¿Estás seguro de que deseas continuar?',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
  });

  const handleGoToMenu = () => {
    setCurrentView(ViewEnum.MENU);
  };

  const showConfirmation = (onConfirm: () => void, config?: Partial<typeof confirmModalConfig>) => {
    setPendingAction(() => onConfirm);
    if (config) {
      setConfirmModalConfig({ ...confirmModalConfig, ...config });
    }
    openConfirmModal();
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    closeConfirmModal();
  };

  const { mutateAsync: createCustomer } = useCreateCustomer();

  const onSubmitInitialData = async (data: CostumerInitialInfo) => {
    try {
      const response = await createCustomer(data);
      const responseData = response;
      setUserServerResponse(responseData);
      setCurrentView(ViewEnum.MENU);
      notifications.show({
        id: 'login-success',
        title: '¡Te damos la bienvenida!',
        message: 'Tus datos se han enviado correctamente',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    } catch (error) {
      setCurrentView(ViewEnum.LOGIN);
      notifications.show({
        id: 'login-error',
        title: 'Error',
        message: 'Hubo un problema al procesar tus datos. Intenta nuevamente.',
        color: 'red',
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    }
  };

  const handleReportConfirm = async () => {
    try {
      const userId = userServerResponse?.id;
      const response = await fetch(`${API_BASE_URL}/chats/conversations/case/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...reportData.data,
          customer_id: userId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Guardar el número de referencia y el estado en reportData
        setReportData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            reference_number: responseData.reference_number,
            status: responseData.status,
          },
        }));

        notifications.show({
          id: 'report-success',
          title: 'Reporte enviado',
          message: 'Tu reporte ha sido enviado exitosamente',
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });

        setCurrentView(ViewEnum.REFERENCE_NUMBER);
      } else {
        throw new Error('Error al crear el reporte');
      }
    } catch (error) {
      notifications.show({
        id: 'report-error',
        title: 'Error',
        message: 'Error al enviar el reporte. Por favor, intenta nuevamente.',
        color: 'red',
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    }
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
    setCurrentView(ViewEnum.SUMMARY);
  };

  const handleReportCancel = () => {
    if (Object.keys(reportData.data).length > 0) {
      showConfirmation(
        () => {
          setReportData({
            currentStep: '',
            data: {},
            isComplete: false,
          });
          setCurrentView(ViewEnum.MENU);
        },
        {
          title: 'Cancelar reporte',
          message: '¿Estás seguro de cancelar? Se perderán los datos ingresados.',
          confirmLabel: 'Sí, cancelar',
          cancelLabel: 'No, continuar',
        }
      );
    } else {
      setReportData({
        currentStep: '',
        data: {},
        isComplete: false,
      });
      setCurrentView(ViewEnum.MENU);
    }
  };

  const handleSurveyComplete = () => {
    notifications.show({
      id: 'survey-success',
      title: '¡Gracias por tu feedback!',
      message: 'Tu opinión nos ayuda a mejorar nuestro servicio',
      color: 'blue',
      autoClose: 3000,
    });

    setReportData({
      currentStep: '',
      data: {},
      isComplete: false,
    });
    setCurrentView(ViewEnum.MENU);
  };

  const handleSurveyError = () => {
    notifications.show({
      id: 'survey-error',
      title: 'Error en la encuesta',
      message:
        'Hubo un problema al enviar tu respuesta, pero tu reporte ha sido guardado correctamente.',
      color: 'orange',
      icon: <IconX size={16} />,
      autoClose: 5000,
    });

    setReportData({
      currentStep: '',
      data: {},
      isComplete: false,
    });
    setCurrentView(ViewEnum.MENU);
  };

  const handleMenuSelection = (option: ViewEnum) => {
    if (option === ViewEnum.REPORT) {
      setReportData({
        currentStep: '',
        data: {},
        isComplete: false,
      });
    } else if (option === ViewEnum.FOLLOW_UP) {
      // Clear follow-up data when selecting follow-up from menu
      setFollowUpData(null);
    }
    setCurrentView(option);
  };

  const value = {
    userServerResponse,
    currentView,
    reportData,
    followUpData,
    handleGoToMenu,
    setCurrentView,
    setUserServerResponse,
    setReportData,
    setFollowUpData,
    onSubmitInitialData,
    handleReportConfirm,
    handleReportUpdate,
    handleReportComplete,
    handleReportCancel,
    handleMenuSelection,
    handleSurveyComplete,
    handleSurveyError,
    confirmModalProps: {
      opened: confirmModalOpened,
      open: openConfirmModal,
      close: closeConfirmModal,
    },
  };

  return (
    <>
      <ConfirmationModal
        opened={confirmModalOpened}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        cancelLabel={confirmModalConfig.cancelLabel}
      />
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};
