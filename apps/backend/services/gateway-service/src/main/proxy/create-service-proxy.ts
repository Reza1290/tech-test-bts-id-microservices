import { createProxyMiddleware } from 'http-proxy-middleware';

export const createServiceProxy = (targetUrl: string) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    xfwd: true,
  });
};
