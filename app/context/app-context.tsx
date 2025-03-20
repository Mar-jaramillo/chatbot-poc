'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '@/app/consts';
import { CostumerInitialInfo, ReportData, ViewType } from '@/app/types';
import { ConfirmationModal } from '../components/ui';

interface AppContextProps {
  userServerResponse: CostumerInitialInfo | null;
  currentView: ViewType;
  reportData: ReportData;
  setCurrentView: (view: ViewType) => void;
  setUserServerResponse: (data: CostumerInitialInfo | null) => void;
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>;
  onSubmitInitialData: (data: CostumerInitialInfo) => Promise<void>;
  handleReportConfirm: () => Promise<void>;
  handleReportUpdate: (data: ReportData['data']) => void;
  handleReportComplete: (data: ReportData['data']) => void;
  handleReportCancel: () => void;
  handleMenuSelection: (option: 'chat' | 'report') => void;
  handleSurveyComplete: () => void;
  handleSurveyError: (error: Error) => void;
  confirmModalProps: {
    opened: boolean;
    open: () => void;
    close: () => void;
  };
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userServerResponse, setUserServerResponse] = useState<CostumerInitialInfo | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [reportData, setReportData] = useState<ReportData>({
    currentStep: '',
    data: {},
    isComplete: false,
  });
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] =
    useDisclosure(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: 'Confirmar acción',
    message: '¿Estás seguro de que deseas continuar?',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
  });

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

  const onSubmitInitialData = async (data: CostumerInitialInfo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUserServerResponse(responseData);
        setCurrentView('menu');

        notifications.show({
          id: 'login-success',
          title: '¡Bienvenido!',
          message: 'Tus datos se han enviado correctamente',
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
      } else {
        throw new Error('Error al crear los Datos iniciales');
      }
    } catch (error) {
      setCurrentView('login');
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
        notifications.show({
          id: 'report-success',
          title: 'Reporte enviado',
          message: 'Tu reporte ha sido enviado exitosamente',
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
        setCurrentView('survey');
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
    setCurrentView('summary');
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
          setCurrentView('menu');
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
      setCurrentView('menu');
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
    setCurrentView('menu');
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
    setCurrentView('menu');
  };

  const handleMenuSelection = (option: 'chat' | 'report') => {
    if (option === 'report') {
      setReportData({
        currentStep: '',
        data: {},
        isComplete: false,
      });
    }
    setCurrentView(option);
  };

  const value = {
    userServerResponse,
    currentView,
    reportData,
    setCurrentView,
    setUserServerResponse,
    setReportData,
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
