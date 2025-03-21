import React from 'react';
import { Paper, Stack } from '@mantine/core';
import { MENU_OPTIONS } from '@/app/consts';
import { useAppContext } from '@/app/context';
import { HeaderMenu } from './header-menu';
import { MenuButton } from './menu-button';

export function MenuOptions() {
  const { userServerResponse, handleMenuSelection } = useAppContext();

  if (!userServerResponse) {
    return null;
  }

  return (
    <Paper shadow="sm" radius="md">
      <Stack p="md">
        <HeaderMenu firstName={userServerResponse.first_name} />
        {MENU_OPTIONS.map((option) => (
          <MenuButton
            key={option.id}
            option={option}
            onClick={() => handleMenuSelection(option.action)}
          />
        ))}
      </Stack>
    </Paper>
  );
}
