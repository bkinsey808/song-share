import { usePlaylist } from "./slice";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const PlaylistFollowing = () => {
	const { songActiveId, songLoadClick, songNameGet } = useAppStore();
	const playlist = usePlaylist();
	const songs = playlist?.songs ?? [];

	return (
		<div className="flex flex-col gap-[1rem]">
			{songs.length > 0 ? (
				<Grid gridClassName="grid-cols-[1.5rem,1fr]">
					<GridHeader>
						<div></div>
						<div>Song Name</div>
					</GridHeader>
					<RadioGroup
						name="songActiveId"
						id="songActiveId"
						value={songActiveId ?? ""}
					>
						{songs.map(({ songId }) => (
							<GridRow key={songId}>
								<div className="align-center grid justify-center">
									<RadioGroupItem
										className="self-center"
										id={songId}
										disabled={true}
										value={songId}
									/>
								</div>
								<div className="">
									<Button
										variant="outline"
										className="min-h-[2rem] w-full justify-start"
										onClick={songLoadClick(songId)}
										title="Load song"
									>
										{songNameGet(songId)}
									</Button>
								</div>
							</GridRow>
						))}
					</RadioGroup>
				</Grid>
			) : // <div>
			// 	<h2 className="border-b border-[currentColor] font-bold">Songs</h2>
			// 	<ul>
			// 		{songs.map(({ songId }) => (
			// 			<li key={songId}>
			// 				<Button
			// 					variant="outline"
			// 					className="min-h-[2rem] w-full justify-start"
			// 					onClick={songLoadClick(songId)}
			// 					title="Load song"
			// 				>
			// 					{songLibrary[songId]?.songName}
			// 				</Button>
			// 			</li>
			// 		))}
			// 	</ul>
			// </div>
			null}
		</div>
	);
};
