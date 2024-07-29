import * as React from "react";

export const useAutoResizeTextarea = (
	ref: React.ForwardedRef<HTMLTextAreaElement>,
	autoResize: boolean,
) => {
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

	React.useImperativeHandle(ref, () => textAreaRef.current!);

	React.useEffect(() => {
		const textAreaEl = textAreaRef?.current;

		const updateTextareaHeight = () => {
			if (textAreaEl && autoResize) {
				textAreaEl.style.height = "auto";
				textAreaEl.style.height = textAreaEl?.scrollHeight + 2 + "px";
			}
		};

		updateTextareaHeight();

		textAreaEl?.addEventListener("input", updateTextareaHeight);

		return () => textAreaEl?.removeEventListener("input", updateTextareaHeight);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { textAreaRef };
};
