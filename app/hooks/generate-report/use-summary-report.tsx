import { useEffect, useState } from 'react';
import {
  IconCalendar,
  IconHome2,
  IconMap,
  IconMapPin,
  IconNotes,
  IconUsers,
} from '@tabler/icons-react';
import { Skeleton } from '@mantine/core';
import { useResponsibleTeams } from '@/app/hooks/use-responsible-teams';
import { useGetActionPlanEvidence, useGetCommunes } from '@/app/services/geolocalization';
import type { ReportField, ReportFormData, ResponsibleTeam } from '@/app/types';

export function useSummaryReport(data: ReportFormData) {
  const [communeName, setCommuneName] = useState<string>('');
  const [neighborhoodName, setNeighborhoodName] = useState<string>('');

  const { teams, isLoading: isLoadingTeams } = useResponsibleTeams();
  const { data: communes, isPending: isLoadingCommunes } = useGetCommunes();
  const { data: neighborhoods, isPending: isLoadingNeighborhoods } = useGetActionPlanEvidence(
    data.administrative_area_id
  );

  useEffect(() => {
    if (communes && communes.results && data.administrative_area_id) {
      const commune = communes.results.find((item) => item.id === data.administrative_area_id);
      setCommuneName(commune ? commune.name : data.administrative_area_id);
    }
  }, [communes, data.administrative_area_id]);

  useEffect(() => {
    if (neighborhoods && neighborhoods.results && data.neighborhood_id) {
      const neighborhood = neighborhoods.results.find((item) => item.id === data.neighborhood_id);
      setNeighborhoodName(neighborhood ? neighborhood.name : data.neighborhood_id);
    }
  }, [neighborhoods, data.neighborhood_id]);

  const formatTeamName = (teamId: string, teams?: ResponsibleTeam[]) => {
    if (!teams || teams.length === 0 || !teamId) {
      return teamId || '-';
    }

    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : teamId;
  };

  const reportFields: ReportField[] = [
    {
      label: 'Dirección',
      key: 'incident_address',
      icon: <IconHome2 size={16} />,
    },
    {
      label: 'Comuna',
      key: 'administrative_area_id',
      icon: <IconMap size={16} />,
      format: (value) =>
        isLoadingCommunes ? <Skeleton height={16} width="70%" /> : communeName || value,
    },
    {
      label: 'Barrio',
      key: 'neighborhood_id',
      icon: <IconMapPin size={16} />,
      format: (value) =>
        isLoadingNeighborhoods ? <Skeleton height={16} width="70%" /> : neighborhoodName || value,
    },
    {
      label: 'Fecha',
      key: 'request_date',
      icon: <IconCalendar size={16} />,
    },
    {
      label: 'Descripción',
      key: 'description',
      icon: <IconNotes size={16} />,
    },
    {
      label: 'Equipo asignado',
      key: 'referred_to',
      icon: <IconUsers size={16} />,
      format: (value) =>
        isLoadingTeams ? <Skeleton height={16} width="70%" /> : formatTeamName(value, teams),
    },
  ];
  return { reportFields, teams };
}
