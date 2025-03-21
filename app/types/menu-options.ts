import { ViewEnum } from './costumers';

export type MenuOption = {
  id: string;
  label: string;
  action: ViewEnum;
  variant: 'outline' | 'filled';
  color?: string;
};
