import { Box, Paper, Popover, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useViewsContent } from '@/app/hooks';
import { BackToMenuButton } from '../menu-options';
import { ChatAvatarButton } from './chat-avatar-button';
import { PopOverCharFooter } from './popover-chat-footer';
import { PopoverChatHeader } from './popover-chat-header';

export function PopoverChat() {
  const [opened, { toggle }] = useDisclosure(false);
  const { renderContent } = useViewsContent();

  return (
    <Popover
      opened={opened}
      onChange={toggle}
      position="top-end"
      offset={1}
      middlewares={{ flip: true, shift: true, inline: true }}
      closeOnClickOutside={false}
    >
      <Popover.Target>
        <Box
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 1000,
            display: 'inline-block',
          }}
        >
          <ChatAvatarButton toggle={toggle} />
        </Box>
      </Popover.Target>

      <Popover.Dropdown
        p={0}
        style={{
          overflow: 'hidden',
          maxWidth: '90vw',
          width: '420px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PopoverChatHeader toggle={toggle} />

        <ScrollArea style={{ flexGrow: 1, overflowY: 'auto' }}>
          <Paper bg="#F0F0F2" p="lg" radius={0}>
            <Paper p="lg" radius="lg" shadow="sm">
              <BackToMenuButton />
              {renderContent()}
            </Paper>
          </Paper>
        </ScrollArea>

        <PopOverCharFooter />
      </Popover.Dropdown>
    </Popover>
  );
}
