'use node';

import { Stripe } from 'stripe';

import { v } from "convex/values";
import { ActionCtx, internalAction } from "../../_generated/server";

import { internal } from "../../_generated/api";
import { Doc } from '../../_generated/dataModel';
import stripe from '..';

const isProcessed = (event: Doc<'events'> | null) => {
    return event !== null && (event.status === 'fulfilled' || event.status === 'processing')
}

const handle = async (ctx: ActionCtx, id: string) => {
    try {
        const event =
            await stripe.events.retrieve(id);

        switch (event.type) {
            case 'payment_intent.created':
                // Handle db stuff here
                console.log('Payment intent event logged: ', event.id);
                break;
        }
    } catch(error: unknown) {
        return 'failed'
    }

    return 'fulfilled'
}

export const process = internalAction({
    args: {
        id: v.string()
    },
    handler: async (ctx, { id }) => {
        const event = await ctx.runQuery(internal.stripe.events.getEvent, {
            id: id
        });

        if (isProcessed(event)) {
            return;
        }

        const eventId = event ? event._id : await ctx.runMutation(internal.stripe.events.createEvent, {
            id: id
        });

        const status = 
            await handle(ctx, id)

        await ctx.runMutation(internal.stripe.events.updateEvent, {
            id: eventId,
            status: status
        });
    }
});