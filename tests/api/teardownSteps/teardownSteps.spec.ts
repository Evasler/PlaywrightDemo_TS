import extendedTest from "../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../src/helpers/channel/requestHelper.js";
import { authSteps, roomSteps } from "../../../src/services/index.js";
import { testUtils } from "../../../src/utils/index.js";
import teardownStepsDataset from "./teardownSteps.data.js";

extendedTest.use({
  teardownData: [teardownStepsDataset.teardownData, { scope: "test" }],
});
extendedTest(
  testUtils.fullTitle(
    teardownStepsDataset.testDetails.id,
    teardownStepsDataset.testDetails.title,
    teardownStepsDataset.testDetails.suiteTags,
  ),
  async () => {
    await requestHelper.openNewContext();
    await authSteps.login(teardownStepsDataset.stepData.loginArgs);
    await roomSteps.createRoom();
    await roomSteps.createRoom();
  },
);
