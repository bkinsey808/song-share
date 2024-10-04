"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { PageColumn } from "@/features/layout/PageColumn";
import PageContent from "@/features/layout/PageContent";
import { SectionAccordion } from "@/features/section/SectionAccordion";
import { SECTIONS } from "@/features/sections/consts";

export const DashboardPageContent = () => {
	const { getDashboardSections } = useAppStore();
	const pageColumns = getDashboardSections();

	return (
		<PageContent>
			{pageColumns.map((pageColumn, columnIndex) => (
				<PageColumn key={columnIndex}>
					{pageColumn.map((sectionId) => {
						const Title = SECTIONS[sectionId]?.title;
						const Section = SECTIONS[sectionId]?.section;
						const ButtonLabel = SECTIONS[sectionId]?.buttonLabel;

						if (!Title || !Section || !ButtonLabel) {
							return null;
						}

						return (
							<SectionAccordion
								key={sectionId}
								sectionId={sectionId}
								title={typeof Title === "string" ? Title : <Title />}
								buttonLabel={
									typeof ButtonLabel === "string" ? (
										ButtonLabel
									) : (
										<ButtonLabel />
									)
								}
							>
								<Section />
							</SectionAccordion>
						);
					})}
				</PageColumn>
			))}
		</PageContent>
	);
};

export default DashboardPageContent;
