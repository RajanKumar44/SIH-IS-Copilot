import type { IncomingMessage, ServerResponse } from 'node:http';
import { readNodeRequest, writeNodeResponse, toErrorResponse } from '../server/http';
import { buildRouter } from '../server/routes';

/**
 * Vercel serverless entry point. `vercel.json` rewrites /api/* to this function.
 * Environment variables are configured in the Vercel project settings.
 */
const router = buildRouter();

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse): Promise<void> {
  try {
    const apiReq = await readNodeRequest(req);
    writeNodeResponse(res, await router.handle(apiReq));
  } catch (e) {
    writeNodeResponse(res, toErrorResponse(e));
  }
}
