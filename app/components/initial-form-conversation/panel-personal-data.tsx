import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button, Stack, Tabs, TextInput } from '@mantine/core';
import { CostumerInitialInfo } from '@/app/types';

type PanelPersonalDataProps = {
  register: UseFormRegister<CostumerInitialInfo>;
  errors: FieldErrors<CostumerInitialInfo>;
  handleTabChange: (nextTab: string | null) => Promise<void>;
};

export function PanelPersonalData({ register, errors, handleTabChange }: PanelPersonalDataProps) {
  return (
    <Tabs.Panel value="personal">
      <Stack pt="md">
        <TextInput
          size="xs"
          label="Primer nombre"
          placeholder="Escribe tu nombre"
          {...register('first_name')}
          required
          error={errors.first_name?.message}
        />
        <TextInput
          size="xs"
          label="Primer apellido"
          placeholder="Escribe tu apellido"
          {...register('last_name')}
          required
          error={errors.last_name?.message}
        />

        <Button size="xs" onClick={() => handleTabChange('contact')} fullWidth>
          Siguiente
        </Button>
      </Stack>
    </Tabs.Panel>
  );
}
