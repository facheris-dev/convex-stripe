import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export const eventStatus = 
    v.union(
        v.literal('fulfilled'),
        v.literal('failed'),
        v.literal('processing')
    );


export default defineSchema({
    events: defineTable({
        stripeId: v.string(),
        status: eventStatus
    }).index('by_stripe_id', ['stripeId'])
});