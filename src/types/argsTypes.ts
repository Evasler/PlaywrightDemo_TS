import type { RoomFeature, RoomType } from "./appTypes.js";

export interface ExtraStepsArgs {
  loginArgs?: string;
  createRoomArgsArray?: PostRoomHardData[];
  getRoomIdArgsArray?: number[];
  deleteRoomArgsArray?: number[];
}

export interface PostRoomHardData {
  type?: RoomType;
  accessible?: boolean;
  description?: string;
  image?: string;
  roomPrice?: number;
  features?: RoomFeature[];
}
