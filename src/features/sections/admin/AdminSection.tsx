import { JSX } from "react";

import { BackUpForm } from "./BackUpForm";

export const AdminSection = (): JSX.Element => {
	return (
		<div>
			Admin Section
			<div>{process.env.NODE_ENV}</div>
			<BackUpForm />
		</div>
	);
};
