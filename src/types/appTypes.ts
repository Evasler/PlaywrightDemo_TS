export const roomType = [
  "Single",
  "Twin",
  "Double",
  "Family",
  "Suite",
] as const;
export type RoomType = (typeof roomType)[number];
export const roomFeature = [
  "WiFi",
  "TV",
  "Radio",
  "Refreshments",
  "Safe",
  "Views",
] as const;
export type RoomFeature = (typeof roomFeature)[number];
