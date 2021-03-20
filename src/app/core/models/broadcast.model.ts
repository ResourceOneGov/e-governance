export interface Broadcast {
    channelId: string;
    scheduledAt: string;
    hasNextScheduledBroadcast: boolean;
    message: string;
    _id: string;
}