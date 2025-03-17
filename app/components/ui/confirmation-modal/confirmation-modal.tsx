import { Button, Group, Modal, Stack, Text } from '@mantine/core';

type ConfirmationModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmationModal({
  opened,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack>
        <Text>{message}</Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button color="red" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
