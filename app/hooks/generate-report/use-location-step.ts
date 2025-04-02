import { useGetCommunes, useGetNeighborhoods } from '../../services/geolocalization';
import { ReportFormData } from '../../types';

export function useLocationStep(
  formData: ReportFormData,
  updateFormData: (field: string, value: string) => void
) {
  const { data: communes, isPending: loadingCommunes } = useGetCommunes();
  const { data: neighborhoods, isPending: loadingNeighborhoods } = useGetNeighborhoods(
    formData.administrative_area_id
  );

  const getCommuneOptions = () =>
    communes?.results?.map((type) => ({ value: type.id, label: type.name }));

  const getNeighborhoodOptions = () =>
    neighborhoods?.results?.map((item) => ({ value: item.id, label: item.name }));

  const handleCommuneChange = (value: string | null) => {
    updateFormData('administrative_area_id', value || '');

    updateFormData('neighborhood_id', '');
  };

  return {
    loadingCommunes,
    loadingNeighborhoods,
    getCommuneOptions,
    getNeighborhoodOptions,
    handleCommuneChange,
  };
}
