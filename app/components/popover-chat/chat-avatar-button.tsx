import { Avatar, Box, Indicator, Tooltip } from '@mantine/core';

export function ChatAvatarButton({ toggle }: { toggle: () => void }) {
  return (
    <Box
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 1000,
      }}
    >
      <Tooltip label="¿Necesitas ayuda?" position="left" color="blue">
        <Indicator inline processing color="green" size={16} offset={7} withBorder>
          <Avatar
            variant="white"
            size="lg"
            component="button"
            onClick={toggle}
            src="/images/abbi-avatar.png"
            alt="Abby - Asistente virtual"
          />
        </Indicator>
      </Tooltip>
    </Box>
  );
}
