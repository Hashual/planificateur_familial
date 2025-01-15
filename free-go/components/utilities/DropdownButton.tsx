import { Shadows } from '@/constants/Shadows';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DropdownMenuProps {
  options: { value: string; label: string }[];
  selectOption: string;
  onSelectOption: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, selectOption, onSelectOption, sortOrder, onSortOrderChange }) => {
  const colors = useThemeColor();
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const handleOptionPress = (value: string) => {
    onSelectOption(value);
    setVisible(false);
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    onSortOrderChange(order);
    setVisible(false);
  };

  const menuItemStyle = {
    ...styles.menuItem,
    borderBottomColor: colors.shelf,
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={toggleMenu}>
        <MaterialCommunityIcons name="sort" size={20} color="white" />
      </TouchableOpacity>

      {visible && (
        <View style={[styles.menu, Shadows.dp2, { backgroundColor: colors.elementBackground, borderColor: colors.primary }]}>
          <ThemedText variant="title">Trié par</ThemedText>

          {/* Liste des options */}
          <ThemedText variant="subtitle">Critères :</ThemedText>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={menuItemStyle}
              onPress={() => handleOptionPress(option.value)}
            >
              <ThemedText>{option.label}</ThemedText>
              {selectOption === option.value && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color="green"
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
          ))}

          {/* Choix de l'ordre */}
          <ThemedText variant="subtitle" style={{marginTop: 15}}>Ordre :</ThemedText>
          <TouchableOpacity
            style={menuItemStyle}
            onPress={() => handleSortOrderChange('asc')}
          >
            <ThemedText>Croissant</ThemedText>
            {sortOrder === 'asc' && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color="green"
                style={styles.selectedIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={menuItemStyle}
            onPress={() => handleSortOrderChange('desc')}
          >
            <ThemedText>Décroissant</ThemedText>
            {sortOrder === 'desc' && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color="green"
                style={styles.selectedIcon}
              />
            )}
          </TouchableOpacity>

          
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    top: 70,
    right: 0,
    borderRadius: 5,
    width: 200,
    padding: 10,
    zIndex: 10,
    borderWidth: 1,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedIcon: {
    marginLeft: 10,
  },
});


export default DropdownMenu;
