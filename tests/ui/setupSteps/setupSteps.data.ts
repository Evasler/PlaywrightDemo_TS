import type {
  SetupStepsArgsObj,
  TeardownStepsArgsObj,
  TestDetailsObj,
} from "../../../src/types/index.js";

type TestData = TestDetailsObj &
  SetupStepsArgsObj &
  TeardownStepsArgsObj & {
    stepData: {
      roomInfo: {
        roomName: string;
        type: string;
        accessible: string;
        price: string;
        roomDetails: string;
      }[];
    };
  };

const setupStepsDataset: TestData = {
  testDetails: {
    id: 8,
    title: "Setup Steps",
    suiteTags: ["@fullScope"],
  },
  setupStepsArgsArray: [
    {
      loginArgs: { user: "administrator" },
      createRoomArgsArray: [
        {
          payload: {
            roomName: "initialRoom",
            type: "Double",
            accessible: false,
            description: "Double room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 350,
            features: ["TV"],
          },
        },
      ],
    },
    {
      loginArgs: { user: "administrator" },
      createRoomArgsArray: [
        {
          payload: {
            roomName: "otherRoom",
            type: "Family",
            accessible: false,
            description: "Family room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 400,
            features: ["TV", "WiFi"],
          },
        },
      ],
    },
  ],
  stepData: {
    roomInfo: [
      {
        roomName: "initialRoom",
        type: "Double",
        accessible: "false",
        price: "350",
        roomDetails: "TV",
      },
      {
        roomName: "otherRoom",
        type: "Family",
        accessible: "false",
        price: "400",
        roomDetails: "TV, WiFi",
      },
    ],
  },
};

export default setupStepsDataset;
