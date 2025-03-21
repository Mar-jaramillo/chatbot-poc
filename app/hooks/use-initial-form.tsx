import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../consts';
import { schemaInitialInfo, ViewType, type CostumerInitialInfo } from '../types';

export function useInitialForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CostumerInitialInfo>({
    resolver: zodResolver(schemaInitialInfo),
  });

  const [userServerResponse, setUserServerResponse] = useState(null);
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const onSubmitInitialData = async (data: CostumerInitialInfo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUserServerResponse(responseData);
        setCurrentView('menu');
      } else {
        throw new Error('Error al crear los Datos iniciales');
      }
    } catch (error) {
      // Handle the error appropriately here
      setUserServerResponse(null);
      setCurrentView('login');
    }
  };
  return {
    userServerResponse,
    currentView,
    setCurrentView,
    register,
    handleSubmit,
    onSubmitInitialData,
    isSubmitting,
  };
}
