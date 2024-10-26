import { SECTIONS } from "../sections/consts";
import { pageColumns } from "./pageColumns";
import { PageColumn } from "@/features/layout/PageColumn";
import PageContent from "@/features/layout/PageContent";
import { SectionAccordion } from "@/features/section/SectionAccordion";

export const DashboardPageContent = () => {
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
