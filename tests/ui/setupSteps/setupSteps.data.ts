import type { SuiteTag } from "../../../src/types/index.js";

const setupStepsDataset = {
  testDetails: {
    id: 9,
    title: "Setup Steps",
    suiteTags: ["@fullScope"] as SuiteTag[],
  },
  setupData: [
    {
      loginArgs: "administrator",
      createRoomArgsArray: [{}],
    },
    {
      loginArgs: "administrator",
      createRoomArgsArray: [{}],
    },
  ],
  stepData: {
    verifyRoomVisibilityArgs: [
      { tempDataIndex: 0, shouldBeVisible: true },
      { tempDataIndex: 0, shouldBeVisible: false },
      { tempDataIndex: 1, shouldBeVisible: true },
      { tempDataIndex: 1, shouldBeVisible: false },
    ],
    deleteRoomArgs: [0, 1],
  },
};

export default setupStepsDataset;
