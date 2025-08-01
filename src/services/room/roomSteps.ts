import { test, expect } from "@playwright/test";
import type { CreateRoomArgs, DeleteRoomArgs, GetRoomIdArgs, CreateRoomResponse, GetRoomResponse } from "../../types/index.js";
import roomRequests from "./roomRequests.js";
import testDataHelper from "../../helpers/data/testDataHelper.js";

const roomSteps = {
    
    async getAllRooms() {
        await test.step("Getting all rooms", async() => {
            console.log("Getting all rooms");
            const response = await roomRequests.getRoom();
            expect(response.status()).toEqual(200);
        });
    },
    
    async createRoom({ payload }: CreateRoomArgs) {
        await test.step(`Creating room "${payload.roomName}"`, async() => {
            console.log(`Creating room "${payload.roomName}"`);
            const response = await roomRequests.postRoom(payload);
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as CreateRoomResponse;
            expect(responseJson.success).toBeTruthy();
        });
    },

    async getRoomId({ roomName }: GetRoomIdArgs) {
        await test.step(`Getting roomId of room "${roomName}"`, async() => {
            console.log(`Getting roomId of room "${roomName}"`);
            const response = await roomRequests.getRoom();
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as GetRoomResponse;
            const rooms = responseJson.rooms.filter(room => room.roomName === roomName);
            expect(rooms).toHaveLength(1);
            testDataHelper.pushTestData("roomId", String(rooms[0].roomid));
        });
    },

    async deleteRoom({ tempDataIndex }: DeleteRoomArgs) {
        await test.step("Deleting room with roomId", async () => {
            const roomId = +testDataHelper.getTestData("roomId", tempDataIndex);
            console.log(`Deleting room with roomId "${roomId}"`);
            const response = await roomRequests.deleteRoom(roomId);
            expect(response.status()).toEqual(200);
        });
    }
};

export default roomSteps;