import { useState } from 'react';
import { API_BASE_URL } from '../consts';
import { ReportData } from '../types';
import { useInitialForm } from './use-initial-form';

export function useGenerateReport() {
  const { userServerResponse, setCurrentView } = useInitialForm();
  const [reportData, setReportData] = useState<ReportData>({
    currentStep: '',
    data: {},
    isComplete: false,
  });

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

  return { handleReportConfirm, setReportData, reportData };
}
