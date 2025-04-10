import { useState } from 'react';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import {
  Box,
  Button,
  Divider,
  Group,
  Textarea,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { API_BASE_URL } from '@/app/consts';
import { CustomHeader } from '../ui';

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
    <Group>
      <Box my={10}>
        <CustomHeader
          title=" ¿Cómo fue tu experiencia?"
          subtitle="  Tu opinión es valiosa para ayudarnos a comprender mejor tus necesidades y ajustar nuestro
          servicio de acuerdo a ellas."
        />

        <Group justify="center">
          {[false, true].map((option) => (
            <UnstyledButton
              px="md"
              py="xl"
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
        <Divider my="md" />
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
    </Group>
  );
}
