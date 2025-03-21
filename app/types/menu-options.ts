export type MenuOption = {
  id: string;
  label: string;
  action: 'chat' | 'report';
  variant: 'outline' | 'filled';
  color?: string;
};
