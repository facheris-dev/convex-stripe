import { httpRouter } from 'convex/server';

import { webhook } from './stripe/webhook/action';

const router = 
    httpRouter();

router.route({
    path: '/webhooks/stripe',
    method: 'POST',
    handler: webhook
});

export default router;