import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMailbox, IconUser } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { Anchor, Box, Button, Checkbox, Group, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { CostumerInitialInfo, schemaInitialInfo } from '@/app/types';
import { CustomHeader } from '../ui';

export function InitialFormConversation() {
  const { onSubmitInitialData } = useAppContext();
  const [activeTab, setActiveTab] = useState('personal');
  const [checked, setChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
  } = useForm<CostumerInitialInfo>({
    resolver: zodResolver(schemaInitialInfo),
    mode: 'onChange',
  });

  const handleTabChange = async (nextTab: string) => {
    if (nextTab === 'contact' && activeTab === 'personal') {
      const isPersonalValid = await trigger([
        'first_name',
        'last_name',
        'person_type',
        'organization_name',
        'document_type',
      ]);
      if (!isPersonalValid) {
        return;
      }
    }
    setActiveTab(nextTab);
  };

  return (
    <>
      <CustomHeader
        title={
          <Group gap={5}>
            <Text size="xl" fw={700}>
              ¡Hola! Soy
            </Text>
            <Text
              size="xl"
              fw={900}
              variant="gradient"
              gradient={{ from: 'grape', to: 'cyan', deg: 102 }}
            >
              Abby,
            </Text>
            <br />
            <Text size="xl" fw={700} lh={1}>
              Tu asistente virtual
            </Text>
          </Group>
        }
        subtitle="Antes de comenzar por favor completa tus datos"
      />

      <form onSubmit={handleSubmit(onSubmitInitialData)}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List grow>
            <Tabs.Tab value="personal" leftSection={<IconUser size="0.8rem" />}>
              <Text size="xs">Datos Personales</Text>
            </Tabs.Tab>
            <Tabs.Tab value="contact" leftSection={<IconMailbox size="0.8rem" />}>
              <Text size="xs"> Datos de Contacto</Text>
            </Tabs.Tab>
          </Tabs.List>

          <Box>
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
                    <Text
                      size="xs"
                      style={{ fontStyle: 'italic', color: 'var(--mantine-color-gray-6)' }}
                    >
                      Tu información será tratada de forma segura y solo se usará con fines de
                      registro. Al comenzar, aceptas nuestro tratamiento de datos conforme a{' '}
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
                  <Button
                    size="xs"
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                    disabled={!checked}
                  >
                    Comenzar
                  </Button>
                </Stack>
              </Stack>
            </Tabs.Panel>
          </Box>
        </Tabs>
      </form>
    </>
  );
}
