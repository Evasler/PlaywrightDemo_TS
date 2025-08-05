import type {
  TeardownStepsArgsObj,
  TestDetailsObj,
  LoginArgs,
} from "../../../src/types/index.js";

type TestData = TestDetailsObj &
  TeardownStepsArgsObj & {
    stepData: {
      loginArgs: LoginArgs;
    };
  };

const teardownStepsDataset: TestData = {
  testDetails: {
    id: 2,
    title: "Teardown Steps",
    suiteTags: ["@fullScope"],
  },
  stepData: {
    loginArgs: { user: "administrator" },
  },
  teardownData: [
    {
      loginArgs: { user: "administrator" },
      getRoomIdArgsArray: [{ tempDataIndex: 0 }],
      deleteRoomArgsArray: [{ tempDataIndex: 0 }],
    },
    {
      loginArgs: { user: "administrator" },
      getRoomIdArgsArray: [{ tempDataIndex: 1 }],
      deleteRoomArgsArray: [{ tempDataIndex: 1 }],
    },
  ],
};

export default teardownStepsDataset;
