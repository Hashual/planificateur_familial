export function createDate (date: Date | null, time: Date | null) {
    if (date) {
      if (time) {
        date.setHours(time.getHours(), time.getMinutes());
      } else {
        date.setHours(0, 0, 0, 0);
      }
      return date;
    } else {
      return null;
    }
  };

export function formatDateTimeToFrench(dateString: string | Date): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("La date fournie est invalide.");
    }

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return date.toLocaleDateString('fr-FR', options).replace(',', ' à');
}