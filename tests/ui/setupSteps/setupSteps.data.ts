import type {
  DeleteRoomArgs,
  SetupStepsArgsObj,
  TeardownStepsArgsObj,
  TestDetailsObj,
  VerifyRoomVisibilityArgs,
} from "../../../src/types/index.js";

type TestData = TestDetailsObj &
  SetupStepsArgsObj &
  TeardownStepsArgsObj & {
    stepData: {
      verifyRoomVisibilityArgs: VerifyRoomVisibilityArgs[];
      deleteRoomArgs: DeleteRoomArgs[];
    };
  };

const setupStepsDataset: TestData = {
  testDetails: {
    id: 8,
    title: "Setup Steps",
    suiteTags: ["@fullScope"],
  },
  setupData: [
    {
      loginArgs: { user: "administrator" },
      createRoomArgsArray: [{ hardData: {} }],
    },
    {
      loginArgs: { user: "administrator" },
      createRoomArgsArray: [{ hardData: {} }],
    },
  ],
  stepData: {
    verifyRoomVisibilityArgs: [
      { tempDataIndex: 0, shouldBeVisible: true },
      { tempDataIndex: 0, shouldBeVisible: false },
      { tempDataIndex: 1, shouldBeVisible: true },
      { tempDataIndex: 1, shouldBeVisible: false },
    ],
    deleteRoomArgs: [{ tempDataIndex: 0 }, { tempDataIndex: 1 }],
  },
};

export default setupStepsDataset;
