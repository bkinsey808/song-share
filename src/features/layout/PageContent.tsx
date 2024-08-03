import { PageColumn } from "./PageColumn";
import { SECTIONS, pageColumns } from "./pageColumns";
import { SectionAccordion } from "@/features/design-system/SectionAccordion";
import { Header } from "@/features/layout/Header";

export const PageContent = () => {
	return (
		<div className="@container flex h-screen flex-col lg:max-h-screen">
			<Header />
			<main className="flex-grow overflow-auto lg:overflow-hidden">
				<div className="grid grid-cols-1 lg:h-full lg:grid-cols-2 lg:overflow-auto">
					{pageColumns.map((pageColumn, columnIndex) => (
						<PageColumn key={columnIndex}>
							{pageColumn.map((sectionId) => {
								const Title = SECTIONS[sectionId]?.title;
								const Section = SECTIONS[sectionId]?.section;

								if (!Title || !Section) {
									return null;
								}

								return (
									<SectionAccordion
										key={sectionId}
										sectionId={sectionId}
										title={typeof Title === "string" ? Title : <Title />}
									>
										<Section />
									</SectionAccordion>
								);
							})}
						</PageColumn>
					))}
				</div>
			</main>
		</div>
	);
};

export default PageContent;
