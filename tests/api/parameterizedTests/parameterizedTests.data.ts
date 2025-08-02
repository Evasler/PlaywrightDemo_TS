import type {
  CreateRoomPayload,
  TestDetailsObj,
} from "../../../src/types/index.js";

type ParameterizedTestsDataset = TestDetailsObj & {
  stepData: {
    roomDetails: CreateRoomPayload;
    roomTempDataIndex: number;
  };
};

const parameterizedTestsDatasets: ParameterizedTestsDataset[] = [
  {
    testDetails: {
      id: 0,
      title: "Parameterized Test | Create and delete room 994",
      suiteTags: ["@fullScope"],
    },
    stepData: {
      roomDetails: {
        roomName: "994",
        type: "Double",
        accessible: false,
        description: "Double room description",
        image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
        roomPrice: 350,
        features: ["TV"],
      } as CreateRoomPayload,
      roomTempDataIndex: 0,
    },
  },
  {
    testDetails: {
      id: 1,
      title: "Parameterized Test | Create and delete room 995",
      suiteTags: ["@fullScope"],
    },
    stepData: {
      roomDetails: {
        roomName: "995",
        type: "Family",
        accessible: false,
        description: "Family room description",
        image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
        roomPrice: 400,
        features: ["Views"],
        thisIsWrong: "",
      } as CreateRoomPayload,
      roomTempDataIndex: 0,
    },
  },
];

export default parameterizedTestsDatasets;
