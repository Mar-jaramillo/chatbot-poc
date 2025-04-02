import { z } from 'zod';

export enum ViewEnum {
  ATTENTION_CONTACT = 'attention_contact',
  INITIAL = 'initial',
  LOGIN = 'login',
  MENU = 'menu',
  CHAT = 'chat',
  REPORT = 'report',
  SUMMARY = 'summary',
  SURVEY = 'survey',
  REFERENCE_NUMBER = 'reference_number',
  FOLLOW_UP = 'follow_up',
  FOLLOW_UP_DETAILS = 'follow_up_details',
}
export type ViewType = ViewEnum;

export type CostumerInitialInfo = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  conversation_id?: string;
  document_number?: string;
  document_type?: string;
  organization_name?: string;
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
  email: z.string().nullable(),
  phone_number: z.string(),
});
