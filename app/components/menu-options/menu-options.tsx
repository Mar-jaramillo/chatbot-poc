import { IconMessageCircle } from '@tabler/icons-react';
import { Button, Stack, Text } from '@mantine/core';
import { CostumerInitialInfo } from '@/app/types';

type IntermediateMenuProps = {
  userInfo: CostumerInitialInfo;
  onSelectOption: (option: 'chat' | 'report') => void;
};

export function MenuOptions({ userInfo, onSelectOption }: IntermediateMenuProps) {
  return (
    <Stack p="md">
      <Text size="lg" fw={500} ta="center">
        ¡Hola {userInfo.first_name}!
      </Text>
      <Text size="md" ta="center">
        ¿Qué deseas hacer?
      </Text>

      <Button
        variant="outline"
        onClick={() => onSelectOption('chat')}
        my={5}
        leftSection={<IconMessageCircle size={16} />}
      >
        Hacer una pregunta
      </Button>

      <Button variant="filled" onClick={() => onSelectOption('report')} color="blue">
        📝 Crear nuevo reporte
      </Button>
    </Stack>
  );
}
