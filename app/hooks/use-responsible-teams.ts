import { useGetTeamsResponsibles } from '../services';

export function useResponsibleTeams() {
  const { data: teamsResponsibles, isPending: loadingTeams, error } = useGetTeamsResponsibles();

  return {
    teams: teamsResponsibles?.results,
    isLoading: loadingTeams,
    error,
  };
}
