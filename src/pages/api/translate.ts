import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { text, from = 'auto', to = 'en' } = req.body;

    const tokenResponse = await axios.post(
      'https://aip.baidubce.com/oauth/2.0/token',
      null,
      {
        params: {
          grant_type: 'client_credentials',
          client_id: process.env.NEXT_PUBLIC_BAIDU_TRANSLATE_APPID,
          client_secret: process.env.NEXT_PUBLIC_BAIDU_TRANSLATE_KEY,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const translateResponse = await axios.post(
      `https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token=${accessToken}`,
      {
        from,
        to,
        q: text,
      }
    );

    return res.status(200).json({
      success: true,
      data: translateResponse.data,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Translation error:', err);
    return res.status(200).json({
      success: false,
      message: err instanceof Error ? err.message : 'Translation failed',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
