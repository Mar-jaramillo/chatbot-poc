import { useState } from 'react';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { API_BASE_URL } from '@/app/consts';

interface SatisfactionSurveyProps {
  customerId: string;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function SatisfactionSurvey({ customerId, onComplete, onError }: SatisfactionSurveyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSatisfaction = async (isSatisfactory: boolean) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/conversations/satisfaction/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          is_satisfactory: isSatisfactory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la encuesta de satisfacción');
      }

      onComplete();
    } catch (error) {
      console.error('Error en la encuesta de satisfacción:', error);
      onError(error instanceof Error ? error : new Error('Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card p="lg" radius="md" withBorder>
      <Title order={4} ta="center" mb="md">
        ¿Estás satisfecho con el reporte generado?
      </Title>
      <Text ta="center" mb="xl">
        Tu opinión nos ayuda a mejorar nuestro servicio
      </Text>

      <Stack>
        <Group justify="center" gap="xl">
          <Button
            variant="outline"
            color="red"
            size="lg"
            onClick={() => submitSatisfaction(false)}
            disabled={isSubmitting}
            leftSection={<IconThumbDown size={20} />}
          >
            No
          </Button>
          <Button
            variant="outline"
            color="green"
            size="lg"
            onClick={() => submitSatisfaction(true)}
            disabled={isSubmitting}
            leftSection={<IconThumbUp size={20} />}
          >
            Sí
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
