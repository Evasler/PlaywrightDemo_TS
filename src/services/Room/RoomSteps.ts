import { expect } from "@playwright/test";
import { CreateRoomResponse, GetRoomResponse } from "../../customTypes/ApiResponseTypes";
import { CreateRoomArgs, DeleteRoomArgs, GetRoomIdArgs } from "../../customTypes/StepArgsTypes";
import stepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import roomRequests from "./RoomRequests";
import testDataHelper from "../../helpers/data/TestDataHelper";

const roomSteps = {
    
    getAllRooms() {
        stepSequenceHelper.addStep("getAllRooms", async() => {
            console.log("getAllRooms");
            const response = await roomRequests.getRoom();
            expect(response.status).toEqual(200);
        });
        return this;
    },
    
    createRoom({ payload }: CreateRoomArgs) {
        stepSequenceHelper.addStep("createRoom", async() => {
            console.log("createRoom");
            const response = await roomRequests.postRoom(payload);
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as CreateRoomResponse;
            expect(responseJson.success).toBeTruthy();
        });
        return this;
    },

    getRoomId({ roomName }: GetRoomIdArgs) {
        stepSequenceHelper.addStep("getRoomId", async() => {
            console.log(`Getting roomId of room with name "${roomName}"`);
            const response = await roomRequests.getRoom();
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as GetRoomResponse;
            const room = responseJson.rooms.find(room => room.roomName === roomName);
            expect(room).toBeDefined();
            testDataHelper.pushTestData("roomId", String(room!.roomid));
        });
        return this;
    },

    deleteRoom({ tempDataIndex }: DeleteRoomArgs) {
        stepSequenceHelper.addStep("deleteRoom", async () => {
            console.log("deleteRoom");
            const response = await roomRequests.deleteRoom(+testDataHelper.getTestData("roomId", tempDataIndex));
            expect(response.status()).toEqual(200);
        });
        return this;
    }
};

export default roomSteps;