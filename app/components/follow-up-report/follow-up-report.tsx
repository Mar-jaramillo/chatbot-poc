import { IconSearch } from '@tabler/icons-react';
import { Button, Divider, Stack, TextInput } from '@mantine/core';
import { useFollowUpReport } from '@/app/hooks';
import { CustomHeader } from '../ui';

export function FollowUpReport() {
  const { handleSearchCase, referenceNumber, setReferenceNumber, error, isLoading } =
    useFollowUpReport();
  return (
    <>
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

          <Divider my="md" />

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
