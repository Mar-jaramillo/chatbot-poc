'use client';

import Image from 'next/image';
import {
  Avatar,
  Box,
  Button,
  Group,
  Indicator,
  Paper,
  Popover,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from '@/app/context';
import { useViewsContent } from '@/app/hooks';
import { BackToMenuButton } from '../menu-options';

export function Welcome() {
  const [opened, { toggle }] = useDisclosure(false);
  const { currentView, setCurrentView } = useAppContext();
  const { renderContent } = useViewsContent();

  return (
    <>
      <Popover opened={opened} onChange={toggle} position="top-end" offset={10} withArrow>
        <Popover.Target>
          <Box
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '3rem',
              zIndex: 1000,
            }}
          >
            <Tooltip label="¿Necesitas ayuda?" position="left" color="blue">
              <Indicator inline processing color="green" size={16} offset={7} withBorder>
                <Avatar
                  variant="white"
                  size="xl"
                  component="button"
                  onClick={toggle}
                  src="/images/abbi-avatar.png"
                  alt="Abby - Asistente virtual"
                />
              </Indicator>
            </Tooltip>
          </Box>
        </Popover.Target>

        <Popover.Dropdown p={0} style={{ overflow: 'hidden' }}>
          {/* Header con fondo azul */}
          <Box bg="#292EFF" py="md" px="lg" style={{ width: '350px' }}>
            <Group>
              <Indicator inline processing color="green" size={12} offset={5} withBorder>
                <Avatar src="/images/abbi-avatar.png" size="md" radius="xl" />
              </Indicator>
              <Stack gap={0}>
                <Group gap={3}>
                  <Text size="lg" fw={700} c="white" style={{ lineHeight: 1.2 }}>
                    Abby
                  </Text>
                  <Image src="icons/icon-ai.svg" alt="Icon AI" width={20} height={20} />
                </Group>
                <Text c="white" opacity={0.9} size="xs" style={{ lineHeight: 1.2 }}>
                  Online chatbot
                </Text>
              </Stack>

              {/* Botón para cerrar (X) */}
              <Button
                variant="transparent"
                c="white"
                style={{ marginLeft: 'auto', padding: 0 }}
                onClick={toggle}
                radius="xl"
                size="sm"
              >
                ✕
              </Button>
            </Group>
          </Box>
          {/* Contenido */}
          <Paper style={{ width: '350px' }} bg="#F0F0F2" p="lg" radius="xs">
            <BackToMenuButton currentView={currentView} setCurrentView={setCurrentView} />
            {renderContent()}
          </Paper>
          {/* Footer */}
          <Box py="md" px="lg" style={{ width: '350px' }}>
            <Group align="space-beetween" justify="space-between">
              <Text size="xs" style={{ lineHeight: 1.2 }}>
                © 2025 Qubilo.
              </Text>

              <Image src="/icons/icon-gob247.svg" alt="Icon gob247" width={55} height={20} />
            </Group>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
