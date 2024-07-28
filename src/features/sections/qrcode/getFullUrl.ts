export const getFullUrl = () => {
	try {
		/** @see https://github.com/vercel/next.js/discussions/42319#discussioncomment-4033667 */
		return window?.location.href.replace(
			"localhost:3000",
			"bk-music.vercel.app",
		);
	} catch (error) {
		return undefined;
	}
};
