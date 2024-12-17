import ClearUserInfos from "./ClearUserInfos";
import { GetUserInfos } from "./UserInfos";
import { IsLogin } from "./IsLogin";

export default function CheckToken() {
	IsLogin().then( (isLogin) => {
		if (isLogin) {
			GetUserInfos().then( _user => {
				// User is still logged in
			}).catch( _error => {
				// User is not logged in
				ClearUserInfos();
			})
		}
	})
}