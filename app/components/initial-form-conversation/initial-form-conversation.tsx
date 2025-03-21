'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { CostumerInitialInfo, schemaInitialInfo } from '@/app/types';

export function InitialFormConversation() {
  const { onSubmitInitialData } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CostumerInitialInfo>({
    resolver: zodResolver(schemaInitialInfo),
  });

  return (
    <Paper shadow="sm" radius="md">
      <form onSubmit={handleSubmit(onSubmitInitialData)}>
        <Stack p="md">
          <Stack>
            <Group gap={5}>
              <Text size="xl" fw={700}>
                ¡Hola! Soy
              </Text>
              <Text
                size="xl"
                fw={700}
                variant="gradient"
                gradient={{ from: 'rgba(245, 142, 197, 1)', to: 'rgba(162, 67, 209, 1)', deg: 90 }}
              >
                Abby,
              </Text>
              <Text size="md">
                Tu asistente virtual, antes de comenzar por favor completa tus datos
              </Text>
            </Group>
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
            Tu información será tratada de forma segura y solo se usará para brindarte el servicio
            solicitado. Al continuar, aceptas nuestro tratamiento de datos conforme a nuestras
            políticas.
          </Text>
          <Stack>
            <Button size="xs" type="submit" loading={isSubmitting} fullWidth>
              Comenzar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
