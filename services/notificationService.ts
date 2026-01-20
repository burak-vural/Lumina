
export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Bu tarayıcı bildirimleri desteklemiyor.');
      return false;
    }

    if (Notification.permission === 'granted') return true;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  sendNotification: (title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      // Fix: Removed 'vibrate' property which is not supported in the standard NotificationOptions type for the window context Notification constructor
      new Notification(title, {
        body,
        icon: icon || 'https://api.dicebear.com/7.x/initials/svg?seed=Lumina&backgroundColor=f43f5e',
        badge: 'https://api.dicebear.com/7.x/initials/svg?seed=L&backgroundColor=f43f5e',
      });
      return true;
    }
    return false;
  }
};
