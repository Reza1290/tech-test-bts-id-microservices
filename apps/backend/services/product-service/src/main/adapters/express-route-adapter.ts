import type { Request, Response } from 'express';
import type { Controller, UntrustedHttpRequest, HttpQueryValue, HttpHeaderValue } from '@bts/http';

export const expressRouteAdapter = (controller: Controller<unknown>) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: UntrustedHttpRequest = {
      body: req.body ?? null,
      params: (req.params ?? {}) as Record<string, string>,
      query: (req.query ?? {}) as Record<string, HttpQueryValue>,
      headers: (req.headers ?? {}) as Record<string, HttpHeaderValue>,
    };

    const httpResponse = await controller.handle(httpRequest);

    if (httpResponse.statusCode === 204) {
      res.status(204).send();
      return;
    }

    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
