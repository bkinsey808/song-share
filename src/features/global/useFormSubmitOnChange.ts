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
}): void => {
	const isDirty = form.formState.isDirty;

	useEffect(() => {
		const submitForm = async (): Promise<void> => {
			await form.trigger(); // Validate the form
			if (form.formState.isDirty) {
				const formEvent = new Event("submit", {
					bubbles: true,
					cancelable: true,
				});

				await onSubmit(formEvent as unknown as FormEvent<HTMLFormElement>);
			}
		};

		// Watch formState.isDirty and call submitForm when it changes
		if (isDirty) {
			void (async (): Promise<void> => {
				await submitForm();
			})();
		}
	}, [isDirty, form, onSubmit]);
};
