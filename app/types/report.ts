export type ReportData = {
  currentStep?: string;
  data: {
    customer_id?: string;
    incident_address?: string;
    administrative_area?: string;
    request_date?: string;
    neighborhood?: string;
    personType?: string;
    idType?: string;
    idNumber?: string;
    description?: string;
    referred_to?: string;
  };
  isComplete?: boolean;
};
