import stripe from "..";

import type { Stripe } from 'stripe';

type Payload =
    string;

type VerifyParameters = {
    payload: Payload;
    signature: string;
};

export const verifyWebhookSignature = async ({
    payload,
    signature,
}: VerifyParameters): Promise<Stripe.Event> => {
    const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
    ) as Stripe.Event;

    return event;
};