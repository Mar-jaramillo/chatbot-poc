import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../consts';

export type ResponsibleTeam = {
  id: string;
  name: string;
  description: string;
};

export function useResponsibleTeams() {
  const [teams, setTeams] = useState<ResponsibleTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResponsibleTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/conversations/case-responsibles/`);

      if (!response.ok) {
        throw new Error('Error al obtener los equipos responsables');
      }

      const data = await response.json();
      setTeams(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsibleTeams();
  }, []);

  return {
    teams,
    isLoading,
    error,
    refetch: fetchResponsibleTeams,
  };
}
