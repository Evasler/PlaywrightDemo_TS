import { test, expect } from "@playwright/test";
import type {
  CreateRoomResponse,
  GetRoomResponse,
  CreateRoomPayload,
} from "../../types/index.js";
import roomRequests from "./roomRequests.js";
import testDataHelper from "../../helpers/data/testDataHelper.js";
import { createRoomPayload } from "../../../resources/payloads/createRoomPayload.js";

const roomSteps = {
  getAllRooms() {
    return test.step("Getting all rooms", async () => {
      console.log("Getting all rooms");
      const response = await roomRequests.getRoom();
      expect(response.status()).toEqual(200);
    });
  },

  createRoom(hardData: Partial<CreateRoomPayload> = {}) {
    return test.step(`Creating room`, async () => {
      const payload = createRoomPayload(hardData);
      console.log(`Creating room "${payload.roomName}"`);
      const response = await roomRequests.postRoom(payload);
      expect(response.status()).toEqual(200);
      const responseJson = (await response.json()) as CreateRoomResponse;
      expect(responseJson.success).toBeTruthy();
      testDataHelper.pushTestData("roomName", payload.roomName);
      testDataHelper.pushTestData("roomType", payload.type);
      testDataHelper.pushTestData("roomAccessible", String(payload.accessible));
      testDataHelper.pushTestData("roomPrice", String(payload.roomPrice));
      testDataHelper.pushTestData("roomFeatures", payload.features.join(", "));
    });
  },

  getRoomId(tempDataIndex: number) {
    return test.step(`Getting roomId"`, async () => {
      const roomName = testDataHelper.getTestData("roomName", tempDataIndex);
      console.log(`Getting roomId of room "${roomName}"`);
      const response = await roomRequests.getRoom();
      expect(response.status()).toEqual(200);
      const responseJson = (await response.json()) as GetRoomResponse;
      const rooms = responseJson.rooms.filter(
        (room) => room.roomName === roomName,
      );
      expect(rooms).toHaveLength(1);
      testDataHelper.pushTestData("roomId", String(rooms[0].roomid));
    });
  },

  deleteRoom(tempDataIndex: number) {
    return test.step("Deleting room with roomId", async () => {
      const roomId = +testDataHelper.getTestData("roomId", tempDataIndex);
      console.log(`Deleting room with roomId "${roomId}"`);
      const response = await roomRequests.deleteRoom(roomId);
      expect(response.status()).toEqual(200);
    });
  },
};

export default roomSteps;
