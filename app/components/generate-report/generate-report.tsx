import { Text } from '@mantine/core';
import { REPORT_STEPS } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { useGenerateReport } from '@/app/hooks';
import {
  DetailsStep,
  FormStepper,
  LocationStep,
  PersonalInfoStep,
  ResponsibleTeamStep,
} from './steps';

export function GenerateReport() {
  const { userServerResponse } = useAppContext();

  const {
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
  } = useGenerateReport();

  const renderStepContent = () => {
    switch (currentStep) {
      case 'PERSONAL_INFO':
        return (
          <PersonalInfoStep
            personalData={personalData}
            updatePersonalData={updatePersonalData}
            isUpdatingPersonalInfo={isUpdatingPersonalInfo}
            isPersonalInfoStepValid={isPersonalInfoStepValid}
            goToNextStep={goToNextStep}
          />
        );

      case 'LOCATION':
        return (
          <LocationStep
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            isLocationStepValid={isLocationStepValid}
            showPreviousButton={
              !userServerResponse?.person_type ||
              !userServerResponse?.document_type ||
              !userServerResponse?.organization_name ||
              !userServerResponse?.document_number
            }
          />
        );

      case 'DETAILS':
        return (
          <DetailsStep
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            isDetailsStepValid={isDetailsStepValid}
          />
        );

      case 'RESPONSIBLE_TEAM':
        return (
          <ResponsibleTeamStep
            formData={formData}
            updateFormData={updateFormData}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            isResponsibleTeamStepValid={isResponsibleTeamStepValid}
          />
        );

      default:
        return <Text>Error: Paso no encontrado</Text>;
    }
  };

  const getVisibleSteps = () => {
    return Object.keys(REPORT_STEPS).filter(
      (step) =>
        step !== 'PERSONAL_INFO' ||
        currentStep === 'PERSONAL_INFO' ||
        !userServerResponse?.person_type ||
        !userServerResponse?.document_type ||
        !userServerResponse?.organization_name ||
        !userServerResponse?.document_number
    );
  };

  return (
    <>
      <FormStepper currentStep={currentStep} visibleSteps={getVisibleSteps()} />
      {renderStepContent()}
    </>
  );
}
