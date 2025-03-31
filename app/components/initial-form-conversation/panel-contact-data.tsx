import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Anchor, Button, Checkbox, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { CostumerInitialInfo } from '@/app/types';

type PanelContactDataProps = {
  register: UseFormRegister<CostumerInitialInfo>;
  errors: FieldErrors<CostumerInitialInfo>;
  handleTabChange: (nextTab: string | null) => Promise<void>;
  isSubmitting: boolean;
};

export function PanelContactData({
  register,
  errors,
  handleTabChange,
  isSubmitting,
}: PanelContactDataProps) {
  const [checked, setChecked] = useState(false);
  return (
    <Tabs.Panel value="contact">
      <Stack pt="md">
        <TextInput
          size="xs"
          label="Número de contacto"
          placeholder="Ingresa tu número de teléfono"
          {...register('phone_number')}
          required
          error={errors.phone_number?.message}
        />
        <TextInput
          size="xs"
          label="Correo electrónico"
          placeholder="tucorreo@ejemplo.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          size="xs"
          style={{ fontStyle: 'italic', color: 'var(--mantine-color-gray-6)' }}
          label={
            <Text size="xs" style={{ fontStyle: 'italic', color: 'var(--mantine-color-gray-6)' }}>
              Tu información será tratada de forma segura y solo se usará con fines de registro. Al
              comenzar, aceptas nuestro tratamiento de datos conforme a{' '}
              <Anchor
                href="https://www.cali.gov.co/gobierno/publicaciones/147161/autorizacion-para-el-tratamiento-de-datos-personales/"
                target="_blank"
                size="xs"
              >
                nuestras políticas
              </Anchor>
              .
            </Text>
          }
        />
        <Stack>
          <Button
            size="xs"
            onClick={() => handleTabChange('personal')}
            fullWidth
            variant="outline"
            mb="xs"
          >
            Anterior
          </Button>
          <Button size="xs" type="submit" loading={isSubmitting} fullWidth disabled={!checked}>
            Comenzar
          </Button>
        </Stack>
      </Stack>
    </Tabs.Panel>
  );
}
