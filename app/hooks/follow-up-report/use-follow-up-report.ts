import { useState } from 'react';
import { useAppContext } from '@/app/context';
import { useSearchCaseMutation } from '@/app/services';
import { ViewEnum } from '@/app/types';

export function useFollowUpReport() {
  const { userServerResponse, setCurrentView, setFollowUpData } = useAppContext();
  const [referenceNumber, setReferenceNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const searchCaseMutation = useSearchCaseMutation();

  const handleSearchCase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referenceNumber.trim()) {
      setError('Por favor ingresa un número de radicado válido');
      return;
    }

    setError(null);

    try {
      const data = await searchCaseMutation.mutateAsync({
        customerId: userServerResponse?.id || '',
        referenceNumber,
      });

      setFollowUpData(data);
      setCurrentView(ViewEnum.FOLLOW_UP_DETAILS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return {
    setReferenceNumber,
    referenceNumber,
    handleSearchCase,
    isLoading: searchCaseMutation.isPending,
    error,
  };
}
