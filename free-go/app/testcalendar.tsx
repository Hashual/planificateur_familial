import { RootView } from '@/components/utilities/RootView';
import { ThemedText } from '@/components/utilities/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, {useState} from 'react';
import {Calendar, CalendarList, Agenda, LocaleConfig, Timeline} from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };

LocaleConfig.defaultLocale = 'fr';

export default function TestCalendar() {
    const [selected, setSelected] = useState('');
    const colors = useThemeColor();

    const calendarTheme = {
      backgroundColor: colors.background,
      calendarBackground: colors.elementBackground,
      textSectionTitleColor: colors.primaryText,
      selectedDayBackgroundColor: colors.primary,
      selectedDayTextColor: '#ffffff',
      todayTextColor: colors.primary,
      dayTextColor: colors.primaryText,
      textDisabledColor: colors.inactive,
      monthTextColor: colors.primaryText
    }

    return (
        <RootView>
            <ThemedText variant='title' align='center'>Calendrier</ThemedText>
            <Calendar
            key={colors.background}
            theme={calendarTheme}
            onDayPress={(day: any) => {
                setSelected(day.dateString);
            }}
            markedDates={{
                [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'},
                "2024-12-19": {
                  dots: [
                    { color: 'orange', key: 'event1' }, // Dot orange
                    { color: 'blue', key: 'event2' },   // Dot bleu
                    { color: 'rose', key: 'event4' },   // Dot bleu
                  ],
                },
                "2024-12-20": {
                  dots: [
                    { color: 'green', key: 'event3' },  // Dot vert
                  ],
                },
            }}
            markingType="multi-dot"
            />
        </RootView>
      );
}