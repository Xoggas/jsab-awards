export interface RankedEntryDto {
  id: string;
  name: string;
  link: string;
  rank: number;
  type: "video" | "channel";
  vote_count: number;
  channel_link: string;
}
