import axios from 'axios';
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
    const response = await axios({
      method: method,
      url: url,
      params: queryParams,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 使用 zod 解析和验证返回的数据
    return zodSchema.parse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API Request failed: ${error.message}`,
        error.response?.data
      );
      throw new InvalidResponseError(`API Request failed: ${error.message}`);
    } else {
      // 其他类型的错误，如网络连接问题等
      console.error('An error occurred while fetching API:', error);
      throw error;
    }
  }
}
