import { FormEvent, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export const useFormSubmitOnChange = <
	FormType extends Record<string, unknown>,
>({
	onSubmit,
	form,
}: {
	onSubmit: (formEvent: FormEvent<HTMLFormElement>) => Promise<void> | void;
	form: UseFormReturn<FormType>;
}) => {
	const isDirty = form.formState.isDirty;

	useEffect(() => {
		const submitForm = async () => {
			await form.trigger(); // Validate the form
			if (form.formState.isDirty) {
				console.log("in here");
				const formEvent = new Event("submit", {
					bubbles: true,
					cancelable: true,
				});
				await onSubmit(formEvent as unknown as FormEvent<HTMLFormElement>);
			}
		};

		// Watch formState.isDirty and call submitForm when it changes
		if (isDirty) {
			void (async () => {
				console.log("is dirty");
				await submitForm();
			})();
		}
	}, [isDirty, form, onSubmit]);
};
