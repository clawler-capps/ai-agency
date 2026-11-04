// Build-time feature flags (NEXT_PUBLIC_* values are inlined at build time,
// so redeploy after changing them).

// Snapshot promo pieces from the 3 Nov funnel audit: the hero text link and
// the homepage Snapshot block that replaces today's orange band.
export const SNAPSHOT_LINKED = process.env.NEXT_PUBLIC_SNAPSHOT_LINKED === "true";
