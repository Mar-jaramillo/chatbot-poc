import { IconCheck, IconClockHour4, IconQuestionMark } from '@tabler/icons-react';
import { useAppContext } from '@/app/context';
import { ViewEnum } from '@/app/types';

export function useFollowUpReportDetails() {
  const { followUpData, setCurrentView } = useAppContext();

  const getStatusInfo = () => {
    switch (followUpData?.status) {
      case 'PENDING':
        return {
          label: 'Pendiente',
          color: 'orange',
          icon: <IconClockHour4 size={15} />,
        };
      case 'IN_PROGRESS':
        return {
          label: 'En proceso',
          color: 'blue',
          icon: <IconClockHour4 size={15} />,
        };
      case 'COMPLETED':
        return {
          label: 'Resuelto',
          color: 'green',
          icon: <IconCheck size={15} />,
        };
      default:
        return {
          label: 'Desconocido',
          color: 'gray',
          icon: <IconQuestionMark size={15} />,
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleBackToSearch = () => {
    setCurrentView(ViewEnum.FOLLOW_UP);
  };

  return { statusInfo, handleBackToSearch, followUpData };
}
