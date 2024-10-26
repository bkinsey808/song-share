"use client";

export const AboutSection = () => {
	return (
		<section data-title="About Section" className="flex flex-col gap-[2rem]">
			<p>
				{process.env.NEXT_PUBLIC_BRAND ?? "Song Share"} helps musicians share
				songs with their communities. Song leaders can share information about
				the music they are playing in real time with people following along on
				the app, including lyrics, translations, credits, and more. Followers
				receive song changes in real time on their own apps, during a live set
				and thus can gain a deeper appreciation of the music.
			</p>
			<p>
				Additionally, community members can build up a song library of their own
				which they can reference after the set is over and even when they are
				offline. And followers can use the app to become song leaders of their
				own if they so choose.
			</p>
			<p>
				Additionally, this app helps a musician log their practice and search
				and organize their song library into playlists. Playlists categorize the
				songs and also track an ordering if that matters. Playlists can be
				shared with the community or kept private for organizational purposes.
			</p>
			<p>
				In this way, {process.env.NEXT_PUBLIC_BRAND ?? "Song Share"} serves the
				needs of musicians and their communities. It vastly simplifies the
				process of helping the community learn lyrics to songs. It saves trees
				because printed handouts of lyrics are no longer needed. And most
				everybody carries around a smart phone nowadays.
			</p>
			<p>
				{process.env.NEXT_PUBLIC_BRAND ?? "Song Share"} could be used not just
				for sharing songs with a community, but also prayers, meditations, and
				many other things. It is intended to serve the needs of all faiths and
				spiritual traditions.
			</p>
		</section>
	);
};
