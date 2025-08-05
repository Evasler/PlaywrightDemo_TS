import type {
  TestDetailsObj,
  CreateRoomArgs,
  GetRoomIdArgs,
  DeleteRoomArgs,
} from "../../../src/types/index.js";

type ParameterizedTestsDataset = TestDetailsObj & {
  stepData: {
    createRoomArgs: CreateRoomArgs;
    getRoomIdArgs: GetRoomIdArgs;
    deleteRoomArgs: DeleteRoomArgs;
  };
};

const parameterizedTestsDatasets: ParameterizedTestsDataset[] = [
  {
    testDetails: {
      id: 0,
      title: "Parameterized Test | Create and delete Single room",
      suiteTags: ["@fullScope"],
    },
    stepData: {
      createRoomArgs: { hardData: { type: "Single" } },
      getRoomIdArgs: { tempDataIndex: 0 },
      deleteRoomArgs: { tempDataIndex: 0 },
    },
  },
  {
    testDetails: {
      id: 1,
      title: "Parameterized Test | Create and delete Family room",
      suiteTags: ["@fullScope"],
    },
    stepData: {
      createRoomArgs: { hardData: { type: "Family" } },
      getRoomIdArgs: { tempDataIndex: 0 },
      deleteRoomArgs: { tempDataIndex: 0 },
    },
  },
];

export default parameterizedTestsDatasets;
