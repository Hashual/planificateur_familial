import { BASE_URL } from "@/hooks/useAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other'
}

type UserInfos = {
	id: string;
	email: string;
	firstName: string
	lastName: string;
	avatarUrl: string;
	gender: Gender | null;
	nickname: string | null;
	createdAt: string;
	updatedAt: string;
}

export async function GetUserInfos(): Promise<UserInfos> {
	// TODO: Use useFetchQuery instead of fetch
	return new Promise( (resolve, reject) => {
		AsyncStorage.getItem("session-token").then((token) => {
			if (!token) { 
				reject(new Error("No token found"));
				return;
			}
		
			fetch(`${BASE_URL}/users/me`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then((response) => {
				if (response.status !== 200) {
					reject(new Error(`Failed to fetch user info: ${response.status}`));
					return;
				}
				return response.json();
			}).then((data) => {
				resolve(data.data);
			}).catch((error) => {
				reject(error);
			});
		}).catch((e) => {
			reject(e);
		});
	})
}

export async function GetUserInfosFromCache(): Promise<UserInfos> {
	let user = await AsyncStorage.getItem("user-infos");
	if (!user) {
		throw new Error("No user infos found in cache");
	}
	
	return JSON.parse(user);
}