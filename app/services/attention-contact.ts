import { useQuery } from '@tanstack/react-query';
import { AttentionContacts, QueryResult } from '../types';
import { fetchApi } from './api';

export function useGetAttentionContact() {
  return useQuery<QueryResult<AttentionContacts>>({
    queryKey: ['attention_contact'],
    queryFn: () =>
      fetchApi<QueryResult<AttentionContacts>>('/chats/conversations/emergency-lines/'),
  });
}
