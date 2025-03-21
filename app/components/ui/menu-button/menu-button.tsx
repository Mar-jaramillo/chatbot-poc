import { Button } from '@mantine/core';
import { MenuOption } from '@/app/types';

export function MenuButton({ option, onClick }: { option: MenuOption; onClick: () => void }) {
  return (
    <Button
      size="xs"
      variant={option.variant}
      color={option.color}
      onClick={onClick}
      my={option.variant === 'outline' ? 5 : 0}
    >
      {option.label}
    </Button>
  );
}
