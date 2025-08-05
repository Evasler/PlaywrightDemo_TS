import type { CreateRoomPayload } from "./apiPayloadTypes.js";

export interface ExtraStepsArgs {
  loginArgs?: string;
  createRoomArgsArray?: Partial<CreateRoomPayload>[];
  getRoomIdArgsArray?: number[];
  deleteRoomArgsArray?: number[];
}
