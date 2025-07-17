import test, { expect } from "@playwright/test";
import { CreateRoomResponse, GetRoomResponse } from "../../types/apiResponseTypes";
import { CreateRoomArgs, DeleteRoomArgs, GetRoomIdArgs } from "../../types/stepArgsTypes";
import roomRequests from "./roomRequests";
import testDataHelper from "../../helpers/data/testDataHelper";

const roomSteps = {
    
    async getAllRooms() {
        await test.step("getAllRooms", async() => {
            console.log("getAllRooms");
            const response = await roomRequests.getRoom();
            expect(response.status()).toEqual(200);
        });
    },
    
    async createRoom({ payload }: CreateRoomArgs) {
        await test.step("createRoom", async() => {
            console.log("createRoom");
            const response = await roomRequests.postRoom(payload);
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as CreateRoomResponse;
            expect(responseJson.success).toBeTruthy();
        });
    },

    async getRoomId({ roomName }: GetRoomIdArgs) {
        await test.step("getRoomId", async() => {
            console.log(`Getting roomId of room with name "${roomName}"`);
            const response = await roomRequests.getRoom();
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as GetRoomResponse;
            const rooms = responseJson.rooms.filter(room => room.roomName === roomName);
            expect(rooms).toHaveLength(1);
            testDataHelper.pushTestData("roomId", String(rooms[0].roomid));
        });
    },

    async deleteRoom({ tempDataIndex }: DeleteRoomArgs) {
        await test.step("deleteRoom", async () => {
            console.log("deleteRoom");
            const response = await roomRequests.deleteRoom(+testDataHelper.getTestData("roomId", tempDataIndex));
            expect(response.status()).toEqual(200);
        });
    }
};

export default roomSteps;