import { Href, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export function SetBackPage(page: Href) {
	const router = useRouter();
	
	useEffect(() => {
		const backAction = () => {
		  router.replace(page); // Retourner à Page B sur bouton retour
		  return true; // Empêche le comportement par défaut du bouton retour
		};
	
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
	
		return () => backHandler.remove(); // Nettoyer l'écouteur sur démontage du composant
	}, []);
}