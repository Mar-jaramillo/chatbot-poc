// app/services/reportService.ts
import { ReportData } from '@/app/types';
import { fetchApi } from './api';

export const reportService = {
  // Crear un nuevo reporte
  createReport: (data: ReportData['data'] & { customer_id: string }) =>
    fetchApi('/chats/conversations/case/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Otros métodos relacionados con reportes
};
