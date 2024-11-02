import { z } from 'zod';

export enum Environment {
  local = 'local',
  dev = 'dev',
  prod = 'prod',
}

export interface Config {
  openWeatherApiKey: string;
  baiduTranslateAppId: string;
  baiduTranslateKey: string;
}

const configSchema = z.object({
  environment: z.nativeEnum(Environment),
  openWeatherApiKey: z.string(),
  baiduTranslateAppId: z.string(),
  baiduTranslateKey: z.string(),
});

export function getConfig() {
  const environment =
    getEnvVariable('NEXT_PUBLIC_ENVIRONMENT') ?? Environment.local;

  return configSchema.parse({
    environment,
    openWeatherApiKey:
      getEnvVariable('NEXT_PUBLIC_OPENWEATHER_API_KEY') ??
      'aeb40a22f63323746108fcefb00c0f9b',
    baiduTranslateAppId:
      getEnvVariable('NEXT_PUBLIC_BAIDU_TRANSLATE_APPID') ?? '',
    baiduTranslateKey: getEnvVariable('NEXT_PUBLIC_BAIDU_TRANSLATE_KEY') ?? '',
  });
}

interface CustomWindow extends Window {
  __ENV?: Record<string, string>;
}

declare let window: CustomWindow;
function getEnvVariable(name: string) {
  if (typeof window !== 'undefined' && window.__ENV) {
    return window.__ENV[name];
  }
  return process.env[name];
}
