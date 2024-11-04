"use client";

import Image from "next/image";

import { sectionId } from "../consts";
import { IconBrand } from "@/features/design-system/IconBrand";
import { SectionAccordion } from "@/features/section/SectionAccordion";

export const AboutSection = () => {
	return (
		<section data-title="About Section">
			<SectionAccordion
				sectionId={sectionId.WHY_JOIN}
				title={
					<>
						Why Join <IconBrand />
					</>
				}
				buttonLabel="Why Join"
				buttonVariant="secondary"
			>
				<div className="mb-[2rem] flex flex-col gap-[1rem]">
					<p>
						By joining <IconBrand />, you will be supporting me, my family, and
						this software development project. Additionally, you will be
						supporting our community of musicians and music lovers.
					</p>
					<p>Features exclusive to Membership include:</p>
					<ul>
						<li>
							<Image
								className="mr-[1rem] inline"
								src="/favicon.svg"
								alt="Brand"
								width={20}
								height={20}
							/>
							Share song infomation in real time with your community or
							audience.
						</li>
						<li>
							<Image
								className="mr-[1rem] inline"
								src="/favicon.svg"
								alt="Brand"
								width={20}
								height={20}
							/>
							More features coming!
						</li>
					</ul>
				</div>
			</SectionAccordion>
			<div className="flex flex-col gap-[2rem]">
				<p>
					<IconBrand /> helps musicians share songs with their communities. Song
					leaders can share information about the music they are playing in real
					time with people following along on the app, including lyrics,
					translations, credits, and more. Followers receive song changes in
					real time on their own apps, during a live set and thus can gain a
					deeper appreciation of the music.
				</p>
				<p>
					Additionally, community members can build up a song library of their
					own which they can reference after the set is over and even when they
					are offline. And followers can use the app to become song leaders of
					their own if they so choose.
				</p>
				<p>
					Additionally, this app helps a musician log their practice and search
					and organize their song library into playlists. Playlists categorize
					the songs and also track an ordering if that matters. Playlists can be
					shared with the community or kept private for organizational purposes.
				</p>
				<p>
					In this way, <IconBrand /> serves the needs of musicians and their
					communities. It vastly simplifies the process of helping the community
					learn lyrics to songs. It saves trees because printed handouts of
					lyrics are no longer needed. And most everybody carries around a smart
					phone nowadays.
				</p>
				<p>
					<IconBrand /> could be used not just for sharing songs with a
					community, but also prayers, meditations, and many other things. It is
					intended to serve the needs of all faiths and spiritual traditions.
				</p>
			</div>
		</section>
	);
};
