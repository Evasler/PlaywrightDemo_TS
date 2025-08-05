import type { SuiteTag } from "../../../src/types/index.js";

const fakerConfigDataset = {
  testDetails: {
    id: 19,
    title: "Faker Configuration",
    suiteTags: ["@fullScope"] as SuiteTag[],
  },
  fakerConfigArgs: { seed: 0, defaultRefDateISO: "2000-01-01T00:00:00.000Z" },
  setupData: [
    {
      loginArgs: "administrator",
      createRoomArgsArray: [{}],
    },
  ],
  stepData: {
    getRoomIdArgs: 0,
    deleteRoomArgs: 0,
  },
};

export default fakerConfigDataset;
