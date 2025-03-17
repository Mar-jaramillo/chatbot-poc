'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { API_BASE_URL } from '@/app/consts';
import { CostumerInitialInfo, ReportData, ViewType } from '@/app/types';

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
      } else {
        throw new Error('Error al crear los Datos iniciales');
      }
    } catch (error) {
      console.error('Error al enviar los Datos iniciales:', error);
      setCurrentView('login');
    }
  };

  const handleReportConfirm = async () => {
    try {
      const userId = userServerResponse?.id;

      console.log('Enviando reporte con ID de usuario:', userId);

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
        // En lugar de ir al menú, vamos a la encuesta
        setCurrentView('survey');
      } else {
        throw new Error('Error al crear el reporte');
      }
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      alert('Error al enviar el reporte. Por favor, intenta nuevamente.');
    }
  };
  const handleSurveyComplete = () => {
    alert('¡Gracias por tu feedback!');
    setCurrentView('menu');
  };

  const handleSurveyError = (error: Error) => {
    console.error('Error en la encuesta:', error);
    alert('Error al enviar tu respuesta, pero tu reporte ha sido guardado correctamente.');
    setCurrentView('menu');
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

  const handleMenuSelection = (option: 'chat' | 'report') => {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};
