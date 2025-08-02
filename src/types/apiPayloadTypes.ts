import type { RoomFeature, RoomType } from "./appTypes.js";

export interface CreateRoomPayload {
  roomName: string;
  type: RoomType;
  accessible: boolean;
  description: string;
  image: string;
  roomPrice: number;
  features: RoomFeature[];
}
