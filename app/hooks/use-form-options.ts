import { useGetDocumentTypes, useGetPersonTypes } from '../services';

export function useFormOptions() {
  const { data: personTypesData, isPending: loadingPersonTypes } = useGetPersonTypes();
  const { data: documentTypesData, isPending: loadingDocumentTypes } = useGetDocumentTypes();

  const getPersonTypeOptions = () =>
    personTypesData?.results?.map((type) => ({ value: type.id, label: type.name }));

  const getDocumentTypeOptions = () =>
    documentTypesData?.results?.map((type) => ({ value: type.id, label: type.name }));

  return {
    personTypeOptions: getPersonTypeOptions(),
    documentTypeOptions: getDocumentTypeOptions(),
    isLoading: loadingPersonTypes || loadingDocumentTypes,
  };
}
