import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { eventStatus } from "../schema";

export const getEvent = internalQuery({
    args: {
        id: v.string()
    },
    handler: async (ctx, { id }) => {
        return await ctx.db.query('events')
            .withIndex('by_stripe_id', q => q.eq('stripeId', id))
            .first();
    }
});

export const createEvent = internalMutation({
    args: {
        id: v.string()
    },
    handler: async (ctx, { id }) => {
        return await ctx.db.insert('events', {
            stripeId: id,
            status: 'processing'
        });
    }
});

export const updateEvent = internalMutation({
    args: {
        id: v.id('events'),
        status: eventStatus
    },
    handler: async (ctx, { id, status }) => {
        return await ctx.db.patch(id, {
            status: status
        });
    }
});

export const clearEvents = internalMutation({
    args: {},
    handler: async (ctx, { }) => {
        const date = new Date();
        const old = date.setDate(date.getDate() - 30);

        const entries = 
            await ctx.db.query('events')
            .filter(q => q.lte(q.field('_creationTime'), old))
            .collect();

        const result = entries.map(entry => {
            return ctx.db.delete(entry._id);
        });

        await Promise.allSettled(result);
    }
});