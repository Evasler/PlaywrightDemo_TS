import { RoomFeature, RoomType } from "./AppTypes";

export type CreateRoomResponse = {
    roomid: number;
    roomName: string;
    type: RoomType;
    accessible: boolean;
    image: string;
    description: string;
    features: RoomFeature[];
    roomPrice: number;
};