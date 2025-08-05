import type { RoomType, SuiteTag } from "../../../src/types/index.js";

const parameterizedTestsDatasets = [
  {
    testDetails: {
      id: 0,
      title: "Parameterized Test | Create and delete Single room",
      suiteTags: ["@fullScope"] as SuiteTag[],
    },
    stepData: {
      createRoomArgs: { type: "Single" as RoomType },
      getRoomIdArgs: 0,
      deleteRoomArgs: 0,
    },
  },
  {
    testDetails: {
      id: 1,
      title: "Parameterized Test | Create and delete Family room",
      suiteTags: ["@fullScope"] as SuiteTag[],
    },
    stepData: {
      createRoomArgs: { type: "Family" as RoomType },
      getRoomIdArgs: 0,
      deleteRoomArgs: 0,
    },
  },
];

export default parameterizedTestsDatasets;
