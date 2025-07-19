import type { CreateRoomPayload, SetupStepsArgsObj, TeardownStepsArgsObj, TestDetailsObj } from "../../../../src/types/index.js";

type TestData = TestDetailsObj & SetupStepsArgsObj & TeardownStepsArgsObj & {
    stepData: { roomInfo: { roomName: string, type: string, accessible: string, price: string, roomDetails: string }; };
};

const setupStepsUiDataset: TestData = {
    testDetails: {
        id: 1,
        title: "Setup Steps | UI Test",
        suiteTags: ["@fullScope"]
    },
    setupStepsArgsArray: [{
        loginArgs: { user: "administrator" },
        createRoomArgsArray: [{
            payload: {
                roomName: "initialRoom",
                type: "Double",
                accessible: false,
                description: "Double room description",
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                roomPrice: 350,
                features: ["TV"]
            } as CreateRoomPayload
        }]
    }],
    stepData: {
        roomInfo: {
            roomName: "initialRoom",
            type: "Double",
            accessible: "false",
            price: "350",
            roomDetails: "TV"
        }
    }
};

export default setupStepsUiDataset;