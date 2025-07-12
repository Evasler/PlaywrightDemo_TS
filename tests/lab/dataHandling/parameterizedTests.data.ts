import { CreateRoomPayload } from "../../../src/customTypes/apiPayloadTypes";
import { TestDetailsObj } from "../../../src/customTypes/frameworkTypes";

type ParameterizedTestsDataset = TestDetailsObj & {
    stepData: {
        roomDetails: CreateRoomPayload;
        roomTempDataIndex: number;
    }
};

const parameterizedTestsDatasets: ParameterizedTestsDataset[] = [
    {
        testDetails: {
            id: 1,
            title: "Parameterized Test | Create and delete room 998",
            suiteTags: ["@fullScope"]
        },
        stepData: {
            roomDetails: {
                roomName: "998",
                type: "Double",
                accessible: false,
                description: "Double room description",
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                roomPrice: 350,
                features: ["TV"]
            } as CreateRoomPayload,
            roomTempDataIndex: 0
        }
    },
    {
        testDetails: {
            id: 2,
            title: "Parameterized Test | Create and delete room 999"
        },
        stepData: {
            roomDetails: {
                roomName: "999",
                type: "Family",
                accessible: false,
                description: "Family room description",
                image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                roomPrice: 400,
                features: ["Views"],
                thisIsWrong: ""
            } as CreateRoomPayload,
            roomTempDataIndex: 0
        }
    }
];

export default parameterizedTestsDatasets;