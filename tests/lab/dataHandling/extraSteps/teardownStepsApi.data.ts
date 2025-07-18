import type { CreateRoomPayload } from "../../../../src/types/apiPayloadTypes.js";
import type { SetupStepsArgsObj, TeardownStepsArgsObj, TestDetailsObj } from "../../../../src/types/frameworkTypes.js";
import type { CreateRoomArgs, LoginArgs } from "../../../../src/types/stepArgsTypes.js";

type TestData = TestDetailsObj & SetupStepsArgsObj & TeardownStepsArgsObj & {
    stepData: { 
        loginArgs: LoginArgs;
        createRoomArgs: CreateRoomArgs; 
    };
};

const teardownStepsApiDataset: TestData = {
    testDetails: {
        id: 1,
        title: "Teardown Steps | API Test",
        suiteTags: ["@fullScope"]
    },
    stepData: {
        loginArgs: { user: "administrator" },
        createRoomArgs: {
            payload: {
                roomName: "initialRoom",
                type: "Double",
                accessible: false,
                description: "Double room description",
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                roomPrice: 350,
                features: ["TV"]
            } as CreateRoomPayload
        }
    },
    teardownStepsArgsArray: [
        {
            loginArgs: { user: "administrator" },
            getRoomIdArgsArray: [
                {
                    roomName: "initialRoom"
                }
            ],
            deleteRoomArgsArray: [
                {
                    tempDataIndex: 0
                }
            ]
        }
    ]
};

export default teardownStepsApiDataset;