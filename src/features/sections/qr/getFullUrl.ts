export const getFullUrl = () => {
	try {
		/** @see https://github.com/vercel/next.js/discussions/42319#discussioncomment-4033667 */
		return window?.location.href.replace(
			"localhost:3000",
			process.env.NEXT_PUBLIC_DOMAIN ?? "localhost:3000",
		);
	} catch (error) {
		return undefined;
	}
};
