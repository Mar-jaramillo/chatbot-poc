import { z } from 'zod';

export type ViewType = 'login' | 'menu' | 'chat' | 'report' | 'summary';

export type CostumerInitialInfo = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  conversation_id?: string;
  document_number?: string;
  document_type?: string;
  person_type?: string;
};

export const schemaInitialInfo = z.object({
  first_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  last_name: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  phone_number: z.string(),
});
