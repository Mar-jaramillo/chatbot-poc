import { MenuOption } from '../types';

export const MENU_OPTIONS: MenuOption[] = [
  {
    id: 'question',
    label: 'Hacer una pregunta',
    action: 'chat',
    variant: 'outline',
  },
  {
    id: 'report',
    label: 'Crear nuevo reporte',
    action: 'report',
    variant: 'filled',
    color: 'blue',
  },
  {
    id: 'follow-up',
    label: 'Hacer seguimiento',
    action: 'chat',
    variant: 'outline',
  },
  {
    id: 'rate',
    label: 'Califica tu experiencia',
    action: 'chat',
    variant: 'outline',
  },
];
