import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@/app/context';
import { CostumerInitialInfo, schemaInitialInfo } from '@/app/types';

export function useInitialFormConversation() {
  const { onSubmitInitialData } = useAppContext();
  const [activeTab, setActiveTab] = useState('personal');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
  } = useForm<CostumerInitialInfo>({
    resolver: zodResolver(schemaInitialInfo),
    mode: 'onChange',
  });

  const handleTabChange = async (nextTab: string | null) => {
    if (!nextTab) {
      return;
    }

    if (nextTab === 'contact' && activeTab === 'personal') {
      const isPersonalValid = await trigger([
        'first_name',
        'last_name',
        'person_type',
        'organization_name',
        'document_type',
      ]);
      if (!isPersonalValid) {
        return;
      }
    }
    setActiveTab(nextTab);
  };

  return {
    onSubmitInitialData,
    register,
    handleSubmit,
    isSubmitting,
    errors,
    handleTabChange,
    activeTab,
  };
}
