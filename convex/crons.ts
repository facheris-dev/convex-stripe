import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly("Clear Events", {
    day: 1,
    hourUTC: 0,
    minuteUTC: 0
}, internal.stripe.events.clearEvents);

export default crons;