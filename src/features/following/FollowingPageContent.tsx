"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { PageColumn } from "@/features/layout/PageColumn";
import PageContent from "@/features/layout/PageContent";
import { SectionAccordion } from "@/features/section/SectionAccordion";
import { sectionData } from "@/features/sections/consts";

export const DashboardPageContent = () => {
	const { sectionsFollowingGet } = useAppStore();
	const pageColumns = sectionsFollowingGet();

	return (
		<PageContent>
			{pageColumns.map((pageColumn, columnIndex) => (
				<PageColumn key={columnIndex}>
					{pageColumn.map((sectionId) => {
						const Title = sectionData[sectionId]?.title;
						const Section = sectionData[sectionId]?.section;
						const ButtonLabel = sectionData[sectionId]?.buttonLabel;

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
