'use client';

import { useMutation } from '@tanstack/react-query';
import { FollowUpData } from '@/app/types';
import { baseApi } from './base-api';

type SearchCaseParams = {
  customerId: string;
  referenceNumber: string;
};

export const searchCase = async ({ customerId, referenceNumber }: SearchCaseParams) => {
  return baseApi
    .get('chats/conversations/follow-up/', {
      searchParams: { customer_id: customerId, reference_number: referenceNumber },
    })
    .json<FollowUpData>();
};

export const useSearchCaseMutation = () => {
  return useMutation({
    mutationFn: searchCase,
  });
};
