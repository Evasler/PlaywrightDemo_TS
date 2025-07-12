import { CreateRoomPayload } from "./apiPayloadTypes";

export type ExtraStepsArgs = {
    loginArgs?: LoginArgs,
    createRoomArgsArray?: CreateRoomArgs[]
    getRoomIdArgsArray?: GetRoomIdArgs[],
    deleteRoomArgsArray?: DeleteRoomArgs[]
};
export type LoginArgs = { user: string };
export type CreateRoomArgs = { payload: CreateRoomPayload };
export type GetRoomIdArgs = { roomName: string; };
export type DeleteRoomArgs = { tempDataIndex: number };