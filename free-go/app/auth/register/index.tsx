import RegisterForm from "@/components/auth/forms/RegisterForm";
import { SetBackPage } from "@/utils/SetBackPage";

export default function Register() {
	SetBackPage("/auth/login");
	return (
		<RegisterForm />
	)
}