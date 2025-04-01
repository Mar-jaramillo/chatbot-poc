'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { CostumerInitialInfo, QueryResult, ValueDetails } from '@/app/types';
import { fetchApi } from './api';
import { baseApi } from './base-api';

export function useCreateCustomer() {
  return useMutation<CostumerInitialInfo, Error, Partial<CostumerInitialInfo>>({
    mutationFn: (customer) => baseApi.post('chats/customers/', { json: customer }).json(),
  });
}

export function useUpdateCustomer() {
  return useMutation<CostumerInitialInfo, Error, Partial<CostumerInitialInfo>>({
    mutationFn: (customer) =>
      baseApi.patch(`chats/customers/${customer.id}/`, { json: customer }).json(),
  });
}

export function useGetPersonTypes() {
  return useQuery<QueryResult<ValueDetails>>({
    queryKey: ['personTypes'],
    queryFn: () => fetchApi<QueryResult<ValueDetails>>('/chats/customers/person_types/'),
  });
}

export function useGetDocumentTypes() {
  return useQuery<QueryResult<ValueDetails>>({
    queryKey: ['documentTypes'],
    queryFn: () => fetchApi<QueryResult<ValueDetails>>('/chats/customers/document_types/'),
  });
}
