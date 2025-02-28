"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import { JSX } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { InferOutput, array, object, string } from "valibot";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Sortable,
	SortableDragHandle,
	SortableItem,
} from "@/components/ui/sortable";

const schema = object({
	flipTricks: array(
		object({
			name: string(),
			spin: string(),
		}),
	),
});

export type Schema = InferOutput<typeof schema>;

export const VerticalSortingDemo = (): JSX.Element => {
	const form = useForm<Schema>({
		resolver: valibotResolver(schema),
		defaultValues: {
			flipTricks: [
				{
					spin: "360",
					name: "Kickflip",
				},
				{
					spin: "180",
					name: "Heelflip",
				},
			],
		},
	});

	function onSubmit(input: Schema): void {
		console.log({ input });
	}

	const { fields, append, move, remove } = useFieldArray({
		control: form.control,
		name: "flipTricks",
	});

	return (
		<Card>
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				<CardHeader className="w-full flex-col gap-4 space-y-0 sm:flex-row">
					<div className="flex flex-1 flex-col gap-1.5">
						<CardTitle>Vertical sorting</CardTitle>
						<CardDescription>
							Sort items in the vertical direction.
						</CardDescription>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="w-fit"
						onClick={() => append({ name: "", spin: "" })}
					>
						Add trick
					</Button>
				</CardHeader>
			</div>
			<CardContent>
				<Form form={form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex w-full flex-col gap-4"
					>
						<Sortable
							value={fields}
							onMove={({ activeIndex, overIndex }) =>
								move(activeIndex, overIndex)
							}
							overlay={
								<div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
									<div className="w-full rounded-sm bg-primary/10" />
									<div className="w-full rounded-sm bg-primary/10" />
									<div className="shrink-0 rounded-sm bg-primary/10" />
									<div className="shrink-0 rounded-sm bg-primary/10" />
								</div>
							}
						>
							<div className="flex w-full flex-col gap-2">
								{fields.map((flipTricksField, index) => (
									<SortableItem
										key={flipTricksField.id}
										value={flipTricksField.id}
										asChild
									>
										<div className="grid grid-cols-[0.5fr,1fr,auto,auto] items-center gap-2">
											<FormField
												control={form.control}
												name={`flipTricks.${index}.spin`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																className="h-8"
																// eslint-disable-next-line react/jsx-props-no-spreading
																{...field}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`flipTricks.${index}.name`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																className="h-8"
																// eslint-disable-next-line react/jsx-props-no-spreading
																{...field}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
											<SortableDragHandle
												variant="outline"
												size="icon"
												className="size-8 shrink-0"
											>
												<DragHandleDots2Icon
													className="size-4"
													aria-hidden="true"
												/>
											</SortableDragHandle>
											<Button
												type="button"
												variant="outline"
												size="icon"
												className="size-8 shrink-0"
												onClick={() => remove(index)}
											>
												<TrashIcon
													className="size-4 text-destructive"
													aria-hidden="true"
												/>
												<span className="sr-only">Remove</span>
											</Button>
										</div>
									</SortableItem>
								))}
							</div>
						</Sortable>
						<Button size="sm" className="w-fit">
							Submit
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
