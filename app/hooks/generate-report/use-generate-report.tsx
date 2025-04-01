import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL, REPORT_STEPS } from '../../consts';
import { useAppContext } from '../../context';
import { useUpdateCustomer } from '../../services';
import { ReportData } from '../../types';
import { useFormOptions } from '../use-form-options';

export function useGenerateReport() {
  const {
    reportData,
    handleReportUpdate,
    handleReportComplete,
    userServerResponse,
    setUserServerResponse,
  } = useAppContext();

  const { personTypeOptions } = useFormOptions();

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
  const { mutateAsync: updateCustomer } = useUpdateCustomer();

  // Función para enviar actualización de datos personales
  const updateCustomerInfo = async () => {
    if (!userServerResponse?.id) {
      return;
    }

    setIsUpdatingPersonalInfo(true);
    try {
      // Preparar los datos que quieres actualizar
      const customerData = {
        id: userServerResponse.id,
        person_type: personalData.person_type,
        document_type: personalData.document_type,
        organization_name: personalData.organization_name,
        document_number: personalData.document_number,
      };

      // Llamar al método de actualización
      const updatedUser = await updateCustomer(customerData);

      // Actualizar el estado con la respuesta
      setUserServerResponse({
        ...userServerResponse,
        ...updatedUser,
      });

      setCurrentStep('LOCATION');
    } catch (error) {
      notifications.show({
        title: 'Error al guardar el Registro',
        message:
          'Ha ocurrido un error al intentar guardar el Registro, por favor intenta de nuevo.',
        color: 'red',
      });
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

  // Verificar si la persona seleccionada es jurídica
  const isLegalEntity = () => {
    return personTypeOptions?.some(
      (option) =>
        option.value === personalData.person_type && option.label.toLowerCase().includes('jurídica')
    );
  };

  // Validación de campos por paso con condicional para organización
  const isPersonalInfoStepValid = () => {
    // Verificación básica para todos los tipos de personas
    const basicFieldsValid =
      (personalData.person_type || '').trim() !== '' &&
      (personalData.document_type || '').trim() !== '' &&
      (personalData.document_number || '').trim() !== '';

    // Si es persona jurídica, también debe tener razón social
    if (isLegalEntity()) {
      return basicFieldsValid && (personalData.organization_name || '').trim() !== '';
    }

    // Para persona natural, no se requiere razón social
    return basicFieldsValid;
  };

  const isLocationStepValid = () => {
    return (
      (formData.incident_address || '').trim() !== '' &&
      (formData.administrative_area_id || '').trim() !== '' &&
      (formData.neighborhood_id || '').trim() !== ''
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
