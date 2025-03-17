'use client';

import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useInitialForm } from '@/app/hooks';

export function InitialFormConversation() {
  const { onSubmitInitialData, handleSubmit, register, isSubmitting } = useInitialForm();
  return (
    <form onSubmit={handleSubmit(onSubmitInitialData)}>
      <Stack p="md">
        <Stack>
          <Text size="md" fw={500} ta="center">
            Antes de comenzar, por favor completa tus datos
          </Text>
        </Stack>

        <TextInput
          label="Primer nombre"
          placeholder="Escribe tu nombre"
          {...register('first_name')}
          required
        />
        <TextInput
          label="Primer Apellido"
          placeholder="Escribe tu apellido"
          {...register('last_name')}
          required
        />
        <TextInput label="Número de contacto" {...register('phone_number')} required />

        <TextInput
          label="Correo electrónico"
          placeholder="tucorreo@ejemplo.com"
          {...register('email')}
          required
        />
        <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
          Tu privacidad es muy importante para nosotros. <br />
          Al continuar, aceptas que tus datos se utilicen únicamente con fines de registro y
          seguimiento del programa. No compartiremos tu información con terceros.
        </Text>
        <Stack>
          <Button type="submit" loading={isSubmitting} fullWidth>
            Comenzar
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
