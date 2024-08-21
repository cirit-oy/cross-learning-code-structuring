export interface NotificationsService {
  sendNotification(notification: Record<string, string>): Promise<void>;
}

interface Dependencies {
  serviceUrl: string;
}

export const makeNotificationsService = ({ serviceUrl }: Dependencies): NotificationsService => {
  return {
    sendNotification: async (notification: Record<string, string>) => {
      await fetch(serviceUrl, {
        method: 'POST',
        body: JSON.stringify(notification),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}