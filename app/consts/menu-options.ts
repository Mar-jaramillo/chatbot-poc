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
    variant: 'filled',
    color: 'blue',
  },
  {
    id: 'follow-up',
    label: 'Hacer seguimiento',
    action: ViewEnum.REPORT,
    variant: 'outline',
  },
  {
    id: 'rate',
    label: 'Califica tu experiencia',
    action: ViewEnum.SURVEY,
    variant: 'outline',
  },
];
