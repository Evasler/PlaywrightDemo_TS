import extendedTest from "../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../src/helpers/channel/requestHelper.js";
import { authSteps, roomSteps } from "../../../src/services/index.js";
import { testUtils } from "../../../src/utils/index.js";
import fakerConfigDataset from "./fakerConfig.data.js";

extendedTest.describe.configure({ mode: "serial" });
extendedTest.use({
  fakerConfigArgs: [fakerConfigDataset.fakerConfigArgs, { scope: "test" }],
  setupData: [fakerConfigDataset.setupData, { scope: "test" }],
});
extendedTest(
  testUtils.fullTitle(
    fakerConfigDataset.testDetails.id,
    fakerConfigDataset.testDetails.title,
    fakerConfigDataset.testDetails.suiteTags,
  ),
  async () => {
    await requestHelper.openNewContext();
    await authSteps.login("administrator");
    await roomSteps.getRoomId(fakerConfigDataset.stepData.getRoomIdArgs);
    await roomSteps.deleteRoom(fakerConfigDataset.stepData.deleteRoomArgs);
  },
);
