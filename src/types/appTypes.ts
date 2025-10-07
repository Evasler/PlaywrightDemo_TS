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
export const adminHeaderLink = [
  "Restful Booker Platform Demo",
  "Rooms",
  "Report",
  "Branding",
  "Messages",
  "Front Page",
] as const;
export type AdminHeaderLink = (typeof adminHeaderLink)[number];
export const reportCalendarButtons = ["Today", "Back", "Next"] as const;
export type ReportCalendarButton = (typeof reportCalendarButtons)[number];
