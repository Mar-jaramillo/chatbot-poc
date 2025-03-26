import { useEffect, useState } from 'react';
import { API_BASE_URL, REPORT_STEPS } from '../consts';
import { useAppContext } from '../context';
import { ReportData } from '../types';

export function useGenerateReport() {
  const {
    reportData,
    handleReportUpdate,
    handleReportComplete,
    userServerResponse,
    setUserServerResponse,
  } = useAppContext();

  const [currentStep, setCurrentStep] = useState<keyof typeof REPORT_STEPS>('PERSONAL_INFO');
  const [formData, setFormData] = useState<ReportData['data']>(reportData.data || {});
  const [personalData, setPersonalData] = useState({
    person_type: userServerResponse?.person_type || '',
    document_type: userServerResponse?.document_type || '',
    organization_name: userServerResponse?.organization_name || '',
    document_number: userServerResponse?.document_number || '',
  });
  const [isUpdatingPersonalInfo, setIsUpdatingPersonalInfo] = useState(false);

  useEffect(() => {
    if (
      userServerResponse?.person_type &&
      userServerResponse?.document_type &&
      userServerResponse?.document_number
    ) {
      setCurrentStep('LOCATION');
    }
  }, [userServerResponse]);

  // Efecto para actualizar formData si cambia reportData
  useEffect(() => {
    if (reportData.data) {
      setFormData(reportData.data);
    }
  }, [reportData]);

  // Función para actualizar formData
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para actualizar datos personales
  const updatePersonalData = (field: string, value: string) => {
    setPersonalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para enviar actualización de datos personales
  const updateCustomerInfo = async () => {
    if (!userServerResponse?.id) {
      return;
    }

    setIsUpdatingPersonalInfo(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/customers/${userServerResponse.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_type: personalData.person_type,
          document_type: personalData.document_type,
          organization_name: personalData.organization_name,
          document_number: personalData.document_number,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Actualizar el contexto con los datos actualizados
        setUserServerResponse({
          ...userServerResponse,
          ...updatedUser,
        });
        // Avanzar al siguiente paso
        setCurrentStep('LOCATION');
      } else {
        throw new Error('Error al actualizar los datos del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar datos personales:', error);
    } finally {
      setIsUpdatingPersonalInfo(false);
    }
  };

  // Función para manejar la navegación entre pasos
  const goToNextStep = () => {
    if (currentStep === 'PERSONAL_INFO') {
      updateCustomerInfo();
    } else if (currentStep === 'LOCATION') {
      setCurrentStep('DETAILS');
    } else if (currentStep === 'DETAILS') {
      setCurrentStep('RESPONSIBLE_TEAM');
    } else if (currentStep === 'RESPONSIBLE_TEAM') {
      // Actualizar y completar el formulario
      handleReportUpdate(formData);
      handleReportComplete(formData);
    }
  };

  const goToPreviousStep = () => {
    if (
      currentStep === 'LOCATION' &&
      (!userServerResponse?.person_type ||
        !userServerResponse?.document_type ||
        !userServerResponse?.organization_name ||
        !userServerResponse?.document_number)
    ) {
      setCurrentStep('PERSONAL_INFO');
    } else if (currentStep === 'DETAILS') {
      setCurrentStep('LOCATION');
    } else if (currentStep === 'RESPONSIBLE_TEAM') {
      setCurrentStep('DETAILS');
    }
  };

  // Validación de campos por paso
  const isPersonalInfoStepValid = () => {
    return (
      (personalData.person_type || '').trim() !== '' &&
      (personalData.document_type || '').trim() !== '' &&
      (personalData.organization_name || '').trim() !== '' &&
      (personalData.document_number || '').trim() !== ''
    );
  };

  const isLocationStepValid = () => {
    return (
      (formData.incident_address || '').trim() !== '' &&
      (formData.administrative_area || '').trim() !== '' &&
      (formData.neighborhood || '').trim() !== ''
    );
  };

  const isDetailsStepValid = () => {
    return (
      (formData.request_date || '').trim() !== '' && (formData.description || '').trim() !== ''
    );
  };

  const isResponsibleTeamStepValid = () => {
    return (formData.referred_to || '').trim() !== '';
  };

  return {
    currentStep,
    formData,
    personalData,
    isUpdatingPersonalInfo,
    updateFormData,
    updatePersonalData,
    goToNextStep,
    goToPreviousStep,
    isPersonalInfoStepValid,
    isLocationStepValid,
    isDetailsStepValid,
    isResponsibleTeamStepValid,
  };
}
