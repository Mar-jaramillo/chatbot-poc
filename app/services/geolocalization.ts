import { useQuery } from '@tanstack/react-query';
import { QueryResult, ValueDetails } from '../types';
import { fetchApi } from './api';
import { baseApi } from './base-api';

export function useGetCommunes() {
  return useQuery<QueryResult<ValueDetails>>({
    queryKey: ['communes'],
    queryFn: () => fetchApi<QueryResult<ValueDetails>>('/chats/conversations/cali-communes/'),
  });
}
export function useGetNeighborhoods(commune_id?: string) {
  return useQuery<QueryResult<ValueDetails>>({
    queryKey: ['neighborhoods', commune_id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`chats/conversations/cali-neighborhoods/?commune_id=${commune_id}`, { signal })
        .json(),
    enabled: !!commune_id,
  });
}
