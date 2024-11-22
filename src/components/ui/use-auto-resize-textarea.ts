import * as React from "react";

export const useAutoResizeTextarea = (
	ref: React.ForwardedRef<HTMLTextAreaElement> | undefined,
	autoResize: boolean,
) => {
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

	React.useImperativeHandle(ref, () => textAreaRef.current!);

	const textAreaValue = textAreaRef.current?.value;
	const textAreaEl = textAreaRef?.current;

	const updateTextareaHeight = React.useCallback(() => {
		if (textAreaEl && autoResize) {
			textAreaEl.style.height = "auto";
			textAreaEl.style.height = textAreaEl?.scrollHeight + 2 + "px";
		}
	}, [autoResize, textAreaEl]);

	React.useEffect(() => {
		updateTextareaHeight();
	}, [textAreaValue, updateTextareaHeight]);

	React.useEffect(() => {
		updateTextareaHeight();

		textAreaEl?.addEventListener("input", updateTextareaHeight);

		return () => textAreaEl?.removeEventListener("input", updateTextareaHeight);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { textAreaRef };
};
