import { useMutation } from '@tanstack/react-query';
import { ReportFormData } from '@/app/types';
import { baseApi } from './base-api';

export function useCreateReport() {
  return useMutation<ReportFormData, Error, Partial<ReportFormData>>({
    mutationFn: (report) => baseApi.post('chats/conversations/case/', { json: report }).json(),
  });
}
