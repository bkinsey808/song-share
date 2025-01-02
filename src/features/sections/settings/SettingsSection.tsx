import { JSX } from "react";

import { SettingsForm } from "./SettingsForm";

export const SettingsSection = (): JSX.Element => {
	return (
		<section data-title="Settings Section">
			<SettingsForm />
		</section>
	);
};
