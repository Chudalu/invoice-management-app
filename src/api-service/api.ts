import { AppConfig } from '@/utils/app.config';
import type { paths } from './service';
import createClient from 'openapi-fetch';

export const config = {
    token: null
};

export let { GET, POST, PATCH, PUT, DELETE, HEAD, TRACE } = createClient<paths>({
    baseUrl: AppConfig().API_URL,
    cache: 'no-store',
    headers: config.token ? { authorization: `Bearer ${config.token}` } : {}
});