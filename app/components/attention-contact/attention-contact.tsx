import { Stack, Text } from '@mantine/core';
import { useGetAttentionContact } from '@/app/services/attention-contact';
import { CloseButton, CustomHeader } from '../ui';
import { ContactCard } from './attention-card';

export function AttentionContact() {
  const { data, isLoading, error } = useGetAttentionContact();

  const contactLines = data?.results || [];

  if (isLoading) {
    return <Text>Cargando líneas de emergencia...</Text>;
  }
  if (error) {
    return <Text c="red">Error al cargar las líneas de emergencia</Text>;
  }

  return (
    <Stack>
      <CloseButton />
      <CustomHeader
        title="🚨 Líneas de Atención de Emergencia"
        subtitle="Conoce los números de contacto esenciales para situaciones de emergencia"
      />

      {contactLines.map((line, index) => (
        <ContactCard
          key={index}
          title={line.name}
          number={line.number}
          description={line.description}
          available={line.availability}
        />
      ))}
    </Stack>
  );
}
