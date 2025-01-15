"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { JSX } from "react";
import { useForm } from "react-hook-form";

import { RegistrationSchema } from "./schemas";
import { RegistrationData } from "./types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/features/app-store/useAppStore";
import { ModalContent, ModalFooter } from "@/features/design-system/Modal";

const defaultValues: RegistrationData = {
	username: "",
	acceptTermsAndConditions: false,
};

export const RegisterForm = ({
	setOpen,
}: {
	readonly setOpen: (open: boolean) => void;
}): JSX.Element => {
	const form = useForm<RegistrationData>({
		resolver: valibotResolver(RegistrationSchema),
		defaultValues,
	});

	const { registerSubmit } = useAppStore();

	return (
		<Form {...{ form }}>
			<form onSubmit={registerSubmit(form)}>
				<ModalContent>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										placeholder="Username"
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="acceptTermsAndConditions"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Accept Terms and conditions</FormLabel>
								<FormControl>
									<Checkbox
										className="block"
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...field}
										onCheckedChange={() => field.onChange(!field.value)}
									/>
								</FormControl>
								<FormDescription>
									In order to use this site, you must accept the Terms and
									Conditions
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</ModalContent>
				<ModalFooter>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						Register
					</Button>
					<Button
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>
				</ModalFooter>
			</form>
		</Form>
	);
};
