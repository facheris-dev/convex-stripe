import type { GenericActionCtx, GenericDataModel } from 'convex/server';
import { httpAction } from '../../_generated/server';

import { verifyWebhookSignature } from './verify';
import { internal } from '../../_generated/api';

type Action = (
    ctx: GenericActionCtx<GenericDataModel>,
    request: Request,
) => Promise<Response>;

const action: Action = async (ctx, request) => {
    try {
        const signature =
            request.headers.get('stripe-signature') as string;

        const payload =
            await request.text();

        const event =
            await verifyWebhookSignature({
                payload: payload,
                signature: signature
            });
        
        const schedule = 
            await ctx.scheduler.runAfter(0, internal.stripe.webhook.process.process, {
                id: event.id
            });

    } catch(error: unknown) {
        console.error(error);

        return new Response('', {
            status: 400
        });
    }

    return new Response('OK', {
        status: 200
    });
};

export const webhook =
    httpAction(action);