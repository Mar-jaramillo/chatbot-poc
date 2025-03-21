export type ReportData = {
  currentStep?: string;
  data: {
    id?: string;
    customer_id?: string;
    incident_address?: string;
    administrative_area?: string;
    request_date?: string;
    neighborhood?: string;
    personType?: string;
    description?: string;
    referred_to?: string;
    conversation_id?: string;
    reference_number?: string;
    initial_analysis?: string;
    observations?: string;
    status?: string;
  };
  isComplete?: boolean;
};
