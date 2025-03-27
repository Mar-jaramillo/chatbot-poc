import { useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { ActionIcon, Button, Stack, TextInput } from '@mantine/core';
import { API_BASE_URL } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { ViewEnum } from '@/app/types';
import { CustomHeader } from '../ui';

export function FollowUpReport() {
  const { userServerResponse, setCurrentView, setFollowUpData } = useAppContext();
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchCase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referenceNumber.trim()) {
      setError('Por favor ingresa un número de radicado válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/conversations/follow-up/?customer_id=${userServerResponse?.id}&reference_number=${referenceNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? 'No se encontró ningún caso con ese número de radicado'
            : 'Error al buscar el caso'
        );
      }

      const data = await response.json();
      setFollowUpData(data);
      setCurrentView(ViewEnum.FOLLOW_UP_DETAILS);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ActionIcon
        style={{ position: 'absolute', top: 30, right: 30 }}
        variant="subtle"
        onClick={() => setCurrentView(ViewEnum.MENU)}
      >
        <IconX size={18} />
      </ActionIcon>
      <form onSubmit={handleSearchCase}>
        <Stack>
          <CustomHeader
            title="Seguimiento de Reporte"
            subtitle="Ingresa el número de radicado de tu caso para consultar su estado actual."
          />
          <TextInput
            required
            label="Número de radicado"
            placeholder="Ej: 270325-IC08"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            error={error}
            size="xs"
          />

          <Button
            type="submit"
            leftSection={<IconSearch size={16} />}
            loading={isLoading}
            size="xs"
            mt="md"
          >
            Buscar Caso
          </Button>
        </Stack>
      </form>
    </>
  );
}
