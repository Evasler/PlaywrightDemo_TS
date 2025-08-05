import type { SuiteTag } from "../../../src/types/index.js";

const teardownStepsDataset = {
  testDetails: {
    id: 3,
    title: "Teardown Steps",
    suiteTags: ["@fullScope"] as SuiteTag[],
  },
  stepData: {
    loginArgs: "administrator",
  },
  teardownData: [
    {
      loginArgs: "administrator",
      getRoomIdArgsArray: [0],
      deleteRoomArgsArray: [0],
    },
    {
      loginArgs: "administrator",
      getRoomIdArgsArray: [1],
      deleteRoomArgsArray: [1],
    },
  ],
};

export default teardownStepsDataset;
