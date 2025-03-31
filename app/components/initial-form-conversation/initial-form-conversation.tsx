import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMailbox, IconUser } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { Box, Group, Tabs, Text } from '@mantine/core';
import { useAppContext } from '@/app/context';
import { CostumerInitialInfo, schemaInitialInfo } from '@/app/types';
import { CustomHeader } from '../ui';
import { PanelContactData } from './panel-contact-data';
import { PanelPersonalData } from './panel-personal-data';

export function InitialFormConversation() {
  const { onSubmitInitialData } = useAppContext();
  const [activeTab, setActiveTab] = useState('personal');

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
        subtitle="Para continuar por favor completa tus datos"
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
            <PanelPersonalData
              register={register}
              errors={errors}
              handleTabChange={handleTabChange}
            />
            <PanelContactData
              register={register}
              errors={errors}
              handleTabChange={handleTabChange}
              isSubmitting={isSubmitting}
            />
          </Box>
        </Tabs>
      </form>
    </>
  );
}
