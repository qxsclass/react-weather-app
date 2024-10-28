import { z, ZodSchema } from 'zod';
import { InvalidResponseError } from '@/errors/invalid-response-error';

export async function apiClient<T>({
  method,
  url,
  zodSchema,
  queryParams,
  body,
}: {
  method: 'GET' | 'POST';
  url: string;
  zodSchema: ZodSchema<T>;
  queryParams?: Record<string, string>;
  body?: Record<string, unknown>;
}): Promise<T> {
  try {
    const queryString = queryParams
      ? '?' + new URLSearchParams(queryParams).toString()
      : '';

    const response = await fetch(url + queryString, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      console.error(
        `API Request failed with status: ${response.status}`,
        await response.text()
      );
      throw new InvalidResponseError(
        `API Request failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    return zodSchema.parse(data);
  } catch (error) {
    console.error('An error occurred while fetching API:', error);
    throw error;
  }
}
