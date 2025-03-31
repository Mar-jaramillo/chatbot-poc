import { Avatar, Indicator, Tooltip } from '@mantine/core';

export function ChatAvatarButton({ toggle }: { toggle: () => void }) {
  return (
    <Tooltip label="¿Necesitas ayuda?" position="left" color="blue">
      <Indicator inline processing color="green" size={16} offset={7} withBorder>
        <Avatar
          variant="white"
          size="lg"
          component="button"
          onClick={toggle}
          src="/images/abby_avatar.svg"
          alt="Abby - Asistente virtual"
          style={{ cursor: 'pointer' }}
        />
      </Indicator>
    </Tooltip>
  );
}
