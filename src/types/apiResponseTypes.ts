import { RoomFeature, RoomType } from "./appTypes";

export interface LoginResponse { token: string; }
export interface ValidateResponse { valid: boolean; }
export interface CreateRoomResponse { success: boolean; }
export interface GetRoomResponse {
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