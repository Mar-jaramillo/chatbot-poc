import { MenuOption, ViewEnum } from '../types';

export const MENU_OPTIONS: MenuOption[] = [
  {
    id: 'question',
    label: 'Hacer una pregunta',
    action: ViewEnum.CHAT,
    variant: 'outline',
  },
  {
    id: 'report',
    label: 'Crear nuevo reporte',
    action: ViewEnum.REPORT,
    variant: 'outline',
  },
  {
    id: 'follow-up',
    label: 'Hacer seguimiento',
    action: ViewEnum.FOLLOW_UP,
    variant: 'outline',
  },
  {
    id: 'rate',
    label: 'Califica tu experiencia',
    action: ViewEnum.SURVEY,
    variant: 'outline',
  },
];

export const INITIAL_MENU_OPTIONS: MenuOption[] = [
  {
    id: 'attention_contact',
    label: 'Lineas de atención - urgencias',
    action: ViewEnum.ATTENTION_CONTACT,
    variant: 'outline',
  },
  {
    id: 'initial-form',
    label: 'Chatea con Abby',
    action: ViewEnum.LOGIN,
    variant: 'filled',
    color: 'blue',
  },
];
