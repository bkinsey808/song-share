import { BackUpForm } from "./BackUpForm";

export const AdminSection = () => {
	return (
		<div>
			Admin Section
			<div>{process.env.NODE_ENV}</div>
			<BackUpForm />
		</div>
	);
};
