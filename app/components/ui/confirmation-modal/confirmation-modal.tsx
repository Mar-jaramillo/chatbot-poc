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
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      style={{
        zIndex: 1100,
      }}
    >
      <Stack>
        <Text>{message}</Text>
        <Group justify="flex-end">
          <Button variant="outline" size="xs" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button color="red" size="xs" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
