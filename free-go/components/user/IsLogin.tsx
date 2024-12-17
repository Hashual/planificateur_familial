import { GetUserInfosFromCache } from "@/utils/api/GetUserInfos";

export function IsLogin(): Promise<boolean> {
	return new Promise( (resolve, _reject) => {
		GetUserInfosFromCache().then(() => {
			resolve(true);
		}).catch( (_error) => {
			resolve(false);
		})
	})
}