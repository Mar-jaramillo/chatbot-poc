import { useState } from 'react';
import { IconMessageCircle, IconThumbDown, IconThumbUp, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core';
import { API_BASE_URL } from '@/app/consts';

interface SatisfactionSurveyProps {
  customerId: string;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export function SatisfactionSurvey({ customerId, onComplete, onError }: SatisfactionSurveyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');

  const submitSatisfaction = async () => {
    if (selectedOption === null) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/conversations/satisfaction/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          is_satisfactory: selectedOption,
          customer_feedback: feedback.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la encuesta de satisfacción');
      }

      onComplete();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="xl" radius="lg" withBorder shadow="sm">
      <ActionIcon
        style={{ position: 'absolute', top: 15, right: 15 }}
        variant="subtle"
        onClick={onComplete}
      >
        <IconX size={18} />
      </ActionIcon>

      <Box my={40}>
        <Title order={4} mb="sm">
          ¿Cómo fue tu experiencia?
        </Title>
        <Text size="xs" c="dimmed">
          Tu opinión es valiosa para ayudarnos a comprender mejor tus necesidades y ajustar nuestro
          servicio de acuerdo a ellas.
        </Text>
        <Divider my="md" />
        <Group justify="center">
          {[false, true].map((option) => (
            <UnstyledButton
              px="md"
              pb="xl"
              key={option ? 'satisfied' : 'unsatisfied'}
              onClick={() => setSelectedOption(option)}
              style={{
                opacity: selectedOption === null || selectedOption === option ? 1 : 0.4,
                transition: 'all 0.2s ease',
              }}
            >
              <ThemeIcon
                size={50}
                radius="xl"
                color={option ? 'green' : 'red'}
                variant={selectedOption === option ? 'filled' : 'light'}
              >
                {option ? <IconThumbUp size={25} /> : <IconThumbDown size={25} />}
              </ThemeIcon>
            </UnstyledButton>
          ))}
        </Group>

        {selectedOption !== null && (
          <Textarea
            pb="xl"
            placeholder="Agregar un comentario..."
            value={feedback}
            onChange={(e) => setFeedback(e.currentTarget.value)}
            rows={3}
          />
        )}

        <Button
          fullWidth
          size="xs"
          radius="xl"
          color={selectedOption ? 'green' : selectedOption === false ? 'red' : 'blue'}
          onClick={submitSatisfaction}
          loading={isSubmitting}
          disabled={selectedOption === null}
          style={{
            opacity: selectedOption === null ? 0.7 : 1,
            transition: 'all 0.3s ease',
          }}
        >
          Enviar ahora
        </Button>
      </Box>
    </Card>
  );
}
