import ky, { type HTTPError } from 'ky';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '@/app/consts';
import { GenericRecord } from '../types';

interface ApiErrorResponse {
  msg?: string;
  detail?: string;
  type?: string;
  errors?: Array<{ detail: string; code?: string }>;
}

const rootApi = ky.create({ prefixUrl: API_BASE_URL, credentials: 'same-origin' });

export const baseApi = rootApi.extend({
  hooks: {
    beforeError: [errorNotifier],
  },
});

async function errorNotifier(error: HTTPError) {
  const { response } = error;

  if (response.status >= 400) {
    const data = (await response.json()) as ApiErrorResponse;

    let errMsg = data?.msg || data?.detail;

    if (
      ['client_error', 'validation_error'].includes(data?.type ?? '') &&
      (data?.errors?.length ?? 0) > 0
    ) {
      errMsg = data?.errors?.map((err: GenericRecord) => err.detail).join('\n');
    }

    notifications.show({
      title: 'Error',
      color: 'red',
      message: errMsg || 'Hubo un error al procesar la solicitud. Vuelva a intentarlo.',
    });
  }
  return error;
}
