"use client";

import Image from "next/image";
import { JSX } from "react";

import { sectionId } from "../consts";
import { AboutBlurb } from "./AboutBlurb";
import { IconBrand } from "@/features/design-system/IconBrand";
import { SectionAccordion } from "@/features/section/SectionAccordion";

export const AboutSection = (): JSX.Element => {
	return (
		<section data-title="About Section">
			<SectionAccordion
				sectionId={sectionId.WHY_SIGN_IN}
				title={
					<>
						Why Register and Sign In to <IconBrand />
					</>
				}
				buttonLabel="Why Register for Free and Sign In"
				buttonVariant="secondary"
			>
				<div className="mb-[2rem] flex flex-col gap-[1rem]">
					<p>
						Registering an account on <IconBrand /> is <em>free!</em>
					</p>
					<p>
						First and foremost: signing in allows you to request songs from your
						song library.
					</p>
					<p>
						Signing in to allows you to save your songs into your song library
						across sessions and across browsers. Same with playlists and users.
						Signing into an account gives you access to additional settings
						suchtimezone and a feature called &quot;Wake Lock&quot;. If set,
						Wake Lock will keep your device from going to sleep while this app
						is open.
					</p>
				</div>
			</SectionAccordion>

			<SectionAccordion
				sectionId={sectionId.WHY_JOIN}
				title={
					<>
						Why Join <IconBrand />
					</>
				}
				buttonLabel="Why Join as a Paying Member"
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
				<AboutBlurb />
			</div>
		</section>
	);
};
