import { useQuery } from '@tanstack/react-query';
import { QueryResult, ResponsibleTeam } from '../types';
import { fetchApi } from './api';

export function useGetTeamsResponsibles() {
  return useQuery<QueryResult<ResponsibleTeam>>({
    queryKey: ['responsibleTeam'],
    queryFn: () =>
      fetchApi<QueryResult<ResponsibleTeam>>('/chats/conversations/case-responsibles/'),
  });
}
