import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { z } from 'zod';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
  statusCode?: number;
}

interface ApiClientConfig<T> extends Omit<AxiosRequestConfig, 'url'> {
  url: string;
  zodSchema?: z.ZodType<T>;
  queryParams?: Record<string, string>;
  body?: Record<string, unknown>;
}

interface ApiErrorResponse {
  message?: string;
  data?: unknown;
}

export async function apiClient<T>({
  url,
  method = 'GET',
  zodSchema,
  queryParams,
  body,
  ...config
}: ApiClientConfig<T>): Promise<ApiResponse<T>> {
  try {
    const response = await axios({
      url,
      method,
      params: queryParams,
      data: body,
      ...config,
    });

    if (zodSchema) {
      try {
        const validatedData = zodSchema.parse(response.data);
        return {
          success: true,
          data: validatedData,
        };
      } catch (error) {
        console.error('Data validation error:', error);
        return {
          success: false,
          message: 'Data validation failed',
          error: error,
        };
      }
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    // 添加详细的错误日志
    console.log('API Error Details:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
      url: url,
      method: method,
      params: queryParams,
    });

    return {
      success: false,
      message: axiosError.response?.data?.message || axiosError.message,
      error: axiosError.response?.data || axiosError,
      statusCode: axiosError.response?.status,
    };
  }
}
