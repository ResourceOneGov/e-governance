export interface Notification{
    new: boolean;
    title: string;
    body: string;
    createdOn: string;
}

export interface NotificationsResp {
    count: number;
    notifications: Notification[];
}
