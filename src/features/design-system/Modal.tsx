import {
	ComponentProps,
	JSX,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";

import { cn } from "@/lib/utils";

type ModalProps = ComponentProps<"dialog"> & {
	readonly open: boolean;
	readonly setOpen: (isOpen: boolean) => void;
	readonly heading?: string;
};

export const Modal = ({
	open,
	setOpen,
	className,
	heading,
	children,
	ref,
	...dialogProps
}: ModalProps): JSX.Element => {
	/** @see https://stackoverflow.com/questions/66067697/cannot-assign-to-read-only-property-current-in-react-useref#71574359 */
	const mutableDialogRef = useRef<HTMLDialogElement | null>(null);

	const dialog = mutableDialogRef.current;

	const handleClick = useCallback(
		(event: MouseEvent) => {
			if (!dialog) {
				return;
			}

			const rect = dialog.getBoundingClientRect();
			const isInDialog =
				rect.top <= event.clientY &&
				event.clientY <= rect.top + rect.height &&
				rect.left <= event.clientX &&
				event.clientX <= rect.left + rect.width;

			setTimeout(() => {
				if (!isInDialog && open) {
					setOpen(false);
				}
			}, 100);
		},
		[dialog, open, setOpen],
	);

	// open/close the dialog when the open prop changes
	useEffect(() => {
		if (open) {
			mutableDialogRef.current?.showModal();
			document.addEventListener("click", handleClick);
		} else {
			mutableDialogRef.current?.close();
			document.removeEventListener("click", handleClick);
		}
	}, [open, handleClick]);

	const handleClose = useCallback(() => {
		if (open) {
			setOpen(false);
		}
	}, [open, setOpen]);

	// keep state in sync with dialog open state
	useEffect(() => {
		const innerDialog = mutableDialogRef.current;
		innerDialog?.addEventListener("close", handleClose);

		return (): void => {
			innerDialog?.removeEventListener("close", handleClose);
		};
	}, [handleClose]);

	useEffect(() => {
		return (): void => {
			document.removeEventListener("click", handleClick);
		};
	}, [handleClick]);

	return (
		<dialog
			data-visible={open}
			className={cn(
				"invisible fixed ml-auto mt-[3rem] flex max-h-[calc(100dvh-3rem)] flex-col overflow-hidden border border-current lg:mr-[2px] [&[data-visible='true']]:visible",
				className,
			)}
			ref={(element) => {
				mutableDialogRef.current = element;
				if (ref) {
					if (typeof ref === "function") {
						ref(element);
					} else {
						// eslint-disable-next-line no-param-reassign
						ref.current = element;
					}
				}
			}}
			{...dialogProps}
		>
			{heading ? (
				<header className="flex-shrink bg-[var(--color-header-background)] p-[1rem] text-background">
					<h2>{heading}</h2>
				</header>
			) : null}
			{children}
		</dialog>
	);
};

export const ModalContent = ({
	children,
}: {
	readonly children: ReactNode;
}): JSX.Element => {
	return (
		<div className="h-full flex-grow overflow-auto">
			<section className="flex flex-col gap-[2rem] p-[1rem]">
				{children}
			</section>
		</div>
	);
};

export const ModalFooter = ({
	children,
}: {
	readonly children?: ReactNode;
}): JSX.Element => {
	return (
		<footer
			id="modal-footer"
			className="flex flex-shrink-0 gap-[1rem] p-[1rem]"
		>
			{children}
		</footer>
	);
};
