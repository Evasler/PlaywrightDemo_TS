import type { CreateRoomPayload } from "./apiPayloadTypes.js";

export interface ExtraStepsArgs {
  loginArgs?: LoginArgs;
  createRoomArgsArray?: CreateRoomArgs[];
  getRoomIdArgsArray?: GetRoomIdArgs[];
  deleteRoomArgsArray?: DeleteRoomArgs[];
}
export interface LoginArgs {
  user: string;
}
export interface CreateRoomArgs {
  payload: CreateRoomPayload;
}
export interface GetRoomIdArgs {
  roomName: string;
}
export interface DeleteRoomArgs {
  tempDataIndex: number;
}
