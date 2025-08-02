import type { SetupStepsArgsObj, TeardownStepsArgsObj, TestDetailsObj, CreateRoomArgs, LoginArgs } from "../../../src/types/index.js";

type TestData = TestDetailsObj & SetupStepsArgsObj & TeardownStepsArgsObj & {
    stepData: { 
        loginArgs: LoginArgs;
        createRoomArgs: CreateRoomArgs[];
    };
};

const teardownStepsDataset: TestData = {
    testDetails: {
        id: 2,
        title: "Teardown Steps",
        suiteTags: ["@fullScope"]
    },
    stepData: {
        loginArgs: { user: "administrator" },
        createRoomArgs: [
            {
                payload: {
                    roomName: "initialRoom",
                    type: "Double",
                    accessible: false,
                    description: "Double room description",
                    image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                    roomPrice: 350,
                    features: ["TV"]
                }
            },
            {
                payload: {
                    roomName: "otherRoom",
                    type: "Double",
                    accessible: false,
                    description: "Double room description",
                    image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                    roomPrice: 350,
                    features: ["TV"]
                }
            }
        ]
    },
    teardownStepsArgsArray: [
        {
            loginArgs: { user: "administrator" },
            getRoomIdArgsArray: [{ roomName: "initialRoom" }],
            deleteRoomArgsArray: [{ tempDataIndex: 0 }]
        },
        {
            loginArgs: { user: "administrator" },
            getRoomIdArgsArray: [{ roomName: "otherRoom" }],
            deleteRoomArgsArray: [{ tempDataIndex: 1 }]
        }
    ]
};

export default teardownStepsDataset;