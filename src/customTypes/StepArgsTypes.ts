import { CreateRoomPayload } from "./ApiPayloadTypes";

export type StepsArgsArray = {
    loginArgs?: LoginArgs,
    createRoomArgsArray?: CreateRoomArgs[]
    getRoomIdArgsArray?: GetRoomIdArgs[],
    deleteRoomArgsArray?: DeleteRoomArgs[]
}[];
export type LoginArgs = { user: string };
export type CreateRoomArgs = { payload: CreateRoomPayload };
export type GetRoomIdArgs = {
    roomName: string;
    tempDataKeyPrefix: string;
};
export type DeleteRoomArgs = { tempDataKeyPrefix: string };