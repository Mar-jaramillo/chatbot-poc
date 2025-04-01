// app/services/followUpService.ts
import { FollowUpData } from '@/app/types';
import { fetchApi } from './api';

export const followUpService = {
  // Buscar un caso por número de referencia
  getByReferenceNumber: (customerId: string, referenceNumber: string) =>
    fetchApi<FollowUpData>(
      `/chats/conversations/follow-up/?customer_id=${customerId}&reference_number=${referenceNumber}`
    ),

  // Enviar encuesta de satisfacción
  submitSatisfaction: (data: {
    customer_id: string;
    is_satisfactory: boolean;
    customer_feedback: string | null;
  }) =>
    fetchApi('/chats/conversations/satisfaction/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
