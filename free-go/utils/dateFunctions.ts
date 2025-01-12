import { TimeDurations } from "@/constants/TimeDuration";

export function createDate(date: Date | null, time: Date | null) {
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
}

export function formatDateTimeToFrench(dateString: string | Date): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("La date fournie est invalide.");
    }

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    return date.toLocaleDateString("fr-FR", options).replace(",", " à");
}

export function getTimeStatus(remainingTime: number): string {
    const formatTime = (
        value: number,
        unit: string,
        isOverdue: boolean
    ): string => {
        const plural = value > 1 ? "s" : "";
        return isOverdue
            ? `Retard de ${value} ${unit}${plural}`
            : `${value} ${unit}${plural} restant${plural}`;
    };

    const isOverdue = remainingTime < 0;
    const time = Math.abs(remainingTime);

    const days = Math.floor(time / TimeDurations.day);
    const hours = Math.floor((time % TimeDurations.day) / TimeDurations.hour);
    const minutes = Math.floor(
        (time % TimeDurations.hour) / TimeDurations.minute
    );

    if (days >= 1) return formatTime(days, "jour", isOverdue);
    if (hours >= 1) return formatTime(hours, "heure", isOverdue);
    if (minutes >= 1) return formatTime(minutes, "minute", isOverdue);
    return isOverdue
        ? "Retard de moins d'une minute"
        : "Moins d'une minute restante";
}

export function timeRemaining(targetDate: Date): number {
    const date = new Date(targetDate);
    const currentDate = new Date();
    return date.getTime() - currentDate.getTime();
}

