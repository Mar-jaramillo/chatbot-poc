import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/app/consts';

type Option = {
  id: string;
  name: string;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Option[];
};

export function useFormOptions() {
  const [personTypes, setPersonTypes] = useState<Option[]>([]);
  const [documentTypes, setDocumentTypes] = useState<Option[]>([]);
  const [isLoadingPersonTypes, setIsLoadingPersonTypes] = useState(false);
  const [isLoadingDocumentTypes, setIsLoadingDocumentTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonTypes = async () => {
    setIsLoadingPersonTypes(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/customers/person_types/`);

      if (!response.ok) {
        throw new Error('Error al obtener los tipos de persona');
      }

      const data: ApiResponse = await response.json();
      setPersonTypes(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoadingPersonTypes(false);
    }
  };

  const fetchDocumentTypes = async () => {
    setIsLoadingDocumentTypes(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chats/customers/document_types/`);

      if (!response.ok) {
        throw new Error('Error al obtener los tipos de documento');
      }

      const data: ApiResponse = await response.json();
      setDocumentTypes(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoadingDocumentTypes(false);
    }
  };

  useEffect(() => {
    fetchPersonTypes();
    fetchDocumentTypes();
  }, []);

  const getPersonTypeOptions = () =>
    personTypes.map((type) => ({ value: type.id, label: type.name }));

  const getDocumentTypeOptions = () =>
    documentTypes.map((type) => ({ value: type.id, label: type.name }));

  return {
    personTypeOptions: getPersonTypeOptions(),
    documentTypeOptions: getDocumentTypeOptions(),
    isLoading: isLoadingPersonTypes || isLoadingDocumentTypes,
    error,
    refetch: {
      personTypes: fetchPersonTypes,
      documentTypes: fetchDocumentTypes,
    },
  };
}
