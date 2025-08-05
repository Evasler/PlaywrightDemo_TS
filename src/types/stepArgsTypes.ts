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
  hardData: Partial<CreateRoomPayload>;
}
export interface GetRoomIdArgs {
  tempDataIndex: number;
}
export interface DeleteRoomArgs {
  tempDataIndex: number;
}
export interface VerifyRoomVisibilityArgs {
  tempDataIndex: number;
  shouldBeVisible: boolean;
}
