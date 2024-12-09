import { IconBrand } from "../design-system/IconBrand";
import { GetStartedForm } from "../get-started/GetStartedForm";
import { PageColumn } from "../layout/PageColumn";
import { AboutBlurb } from "../sections/about/AboutBlurb";
import { RegisterSignInButton } from "./RegisterSignInButton";
import { Button } from "@/components/ui/button";

export const HomePage = () => {
	return (
		<main className="grid grid-cols-1 py-[2.5rem] lg:h-full lg:grid-cols-2 lg:pt-0">
			<PageColumn>
				<div className="mx-auto flex max-w-[32rem] flex-col gap-[1rem] p-[2rem] pb-0">
					<h1 className="text-2xl font-bold">
						Welcome to <IconBrand />
					</h1>
					<AboutBlurb />
				</div>
			</PageColumn>
			<PageColumn>
				<div className="mx-auto flex max-w-[32rem] flex-col gap-[1rem] p-[2rem]">
					<h1 className="text-2xl font-bold">Two Easy Ways to Get Started</h1>
					<div className="rounded-[1rem] border border-current p-[2rem]">
						<h2 className="mb-[1.5rem] text-2xl">
							<span className="mr-[1rem] inline-flex h-8 w-8 items-center justify-center rounded-full bg-[white]">
								<span className="text-background">1</span>
							</span>
							Follow a Song Leader
						</h2>
						<GetStartedForm />
					</div>

					<div className="rounded-[1rem] border border-current p-[2rem]">
						<h2 className="mb-[1.5rem] text-2xl">
							<span className="mr-[1rem] inline-flex h-8 w-8 items-center justify-center rounded-full bg-[white]">
								<span className="text-background">2</span>
							</span>
							Register as a Song Leader
						</h2>
						<p>
							Or aspiring song leader. Registering an account can unlock
							features to help your musical and spiritual practice.
						</p>
						<RegisterSignInButton />
					</div>
				</div>
			</PageColumn>
		</main>
	);
};
