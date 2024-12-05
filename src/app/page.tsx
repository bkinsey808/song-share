import { tw } from "@/features/global/tw";
import { Grid } from "@/features/grid/Grid";
import { GridHeader } from "@/features/grid/GridHeader";
import { GridRow } from "@/features/grid/GridRow";

export default function Home() {
	return (
		<main className="justify-center">
			{/* This site is currently in closed private alpha. Please check back later. */}
			<div>
				<div>
					<Grid
						fixedClassName={tw`grid-cols-[12rem,12fr]`}
						scrollingClassName={tw`grid-cols-[2fr,2fr]`}
					>
						<GridHeader>
							<div data-testid="fixed-header-1">Fixed Header 1</div>
							<div data-testid="fixed-header-2">Fixed Header 2</div>
							<div data-testid="scrolling-header-1">Scrolling Header 1</div>
							<div data-testid="scrolling-header-2">Scrolling Header 2</div>
						</GridHeader>
						<GridRow>
							<div data-testid="fixed-row-1">Fixed Row 1</div>
							<div data-testid="fixed-row-2">Fixed Row 2</div>
							<div data-testid="scrolling-row-1">Scrolling Row 1</div>
							<div data-testid="scrolling-row-2">Scrolling Row 2</div>
						</GridRow>
						<GridRow>
							<div data-testid="fixed-row-3">Fixed Row 3</div>
							<div data-testid="fixed-row-4">Fixed Row 4</div>
							<div data-testid="scrolling-row-3">Scrolling Row 3</div>
							<div data-testid="scrolling-row-4">Scrolling Row 4</div>
						</GridRow>
					</Grid>
				</div>
			</div>
		</main>
	);
}
