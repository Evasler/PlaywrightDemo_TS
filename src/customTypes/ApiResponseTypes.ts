import { RoomFeature, RoomType } from "./AppTypes";

export type LoginResponse = { token: string; }
export type ValidateResponse = { valid: boolean; }
export type CreateRoomResponse = { success: boolean; }
export type GetRoomResponse = {
    rooms: {
        roomid: number;
        roomName: string;
        type: RoomType;
        accessible: boolean;
        image: string;
        description: string;
        features: RoomFeature[];
        roomPrice: number;
    }[];
}