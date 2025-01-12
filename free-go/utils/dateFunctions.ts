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