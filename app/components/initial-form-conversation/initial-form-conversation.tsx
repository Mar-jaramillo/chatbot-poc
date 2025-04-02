import { IconMailbox, IconUser } from '@tabler/icons-react';
import { Box, Group, Tabs, Text } from '@mantine/core';
import { useInitialFormConversation } from '@/app/hooks';
import { CloseButton, CustomHeader } from '../ui';
import { PanelContactData } from './panel-contact-data';
import { PanelPersonalData } from './panel-personal-data';

export function InitialFormConversation() {
  const {
    handleSubmit,
    onSubmitInitialData,
    activeTab,
    handleTabChange,
    register,
    errors,
    isSubmitting,
  } = useInitialFormConversation();

  return (
    <>
      <CloseButton />
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
