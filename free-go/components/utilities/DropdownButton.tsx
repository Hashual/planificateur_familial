import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DropdownMenu = ({ options, onSelectOption }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Première option sélectionnée par défaut
  const [sortOrder, setSortOrder] = useState('asc'); // "asc" pour croissant, "desc" pour décroissant

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const handleOptionPress = (value, label) => {
    const selected = { value, label };
    setSelectedOption(selected);  // Mise à jour de l'option sélectionnée
    onSelectOption(value);  // Appel de la fonction avec la value de l'option
    setVisible(false);  // Fermer le menu après sélection
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);  // Mettre à jour l'ordre de tri
    setVisible(false);  // Fermer le menu après changement
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleMenu}>
        <MaterialCommunityIcons name="menu" size={30} color="white" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Trié par :</Text>

          {/* Choix de l'ordre */}
          <Text style={styles.menuTitle}>Ordre :</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleSortOrderChange('asc')}
          >
            <Text style={styles.menuItemText}>Croissant</Text>
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
            style={styles.menuItem}
            onPress={() => handleSortOrderChange('desc')}
          >
            <Text style={styles.menuItemText}>Décroissant</Text>
            {sortOrder === 'desc' && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color="green"
                style={styles.selectedIcon}
              />
            )}
          </TouchableOpacity>

          {/* Liste des options */}
          <Text style={styles.menuTitle}>Options :</Text>
          {options.map((option, label) => (
            <TouchableOpacity
              key={label}
              style={styles.menuItem}
              onPress={() => handleOptionPress(option.value, option.label)}
            >
              <Text style={styles.menuItemText}>{option.label}</Text>
              {selectedOption.value === option.value && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color="green"
                  style={styles.selectedIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginTop: 50,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,  // Rendre le bouton rond
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    top: 70,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 200,
    paddingTop: 10,
    zIndex: 10, // Assurer que le menu soit au-dessus
  },
  menuTitle: {
    paddingLeft: 10,
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,  // Agrandir le texte
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,  // Agrandir le texte
  },
  selectedIcon: {
    marginLeft: 10,
  },
});

export default DropdownMenu;
