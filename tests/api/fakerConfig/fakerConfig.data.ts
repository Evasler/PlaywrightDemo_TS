import type {
  DeleteRoomArgs,
  FakerConfigArgsObj,
  GetRoomIdArgs,
  SetupStepsArgsObj,
  TeardownStepsArgsObj,
  TestDetailsObj,
} from "../../../src/types/index.js";

type TestData = TestDetailsObj &
  SetupStepsArgsObj &
  FakerConfigArgsObj &
  TeardownStepsArgsObj & {
    stepData: {
      getRoomIdArgs: GetRoomIdArgs;
      deleteRoomArgs: DeleteRoomArgs;
    };
  };

const fakerConfigDataset: TestData = {
  testDetails: {
    id: 8,
    title: "Faker Configuration",
    suiteTags: ["@fullScope"],
  },
  fakerConfigArgs: { seed: 0, defaultRefDateISO: "2000-01-01T00:00:00.000Z" },
  setupData: [
    {
      loginArgs: { user: "administrator" },
      createRoomArgsArray: [{ hardData: {} }],
    },
  ],
  stepData: {
    getRoomIdArgs: { tempDataIndex: 0 },
    deleteRoomArgs: { tempDataIndex: 0 },
  },
};

export default fakerConfigDataset;
