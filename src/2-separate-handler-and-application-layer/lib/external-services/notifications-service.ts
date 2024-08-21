export const sendNotification = async (serviceUrl: string, notification: Record<string, string>): Promise<void> => {
  await fetch(serviceUrl, {
    method: 'POST',
    body: JSON.stringify(notification),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}