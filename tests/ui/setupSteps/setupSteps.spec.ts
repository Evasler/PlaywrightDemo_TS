import extendedTest from "../../../src/fixtures/extendedTest.js";
import {
  adminPanelSteps,
  blankSteps,
  loginSteps,
} from "../../../src/pages/index.js";
import { testUtils } from "../../../src/utils/index.js";
import setupStepsDataset from "./setupSteps.data.js";

extendedTest.use({
  setupStepsArgsArray: [
    setupStepsDataset.setupStepsArgsArray,
    { scope: "test" },
  ],
});
extendedTest(
  testUtils.fullTitle(
    setupStepsDataset.testDetails.id,
    setupStepsDataset.testDetails.title,
    setupStepsDataset.testDetails.suiteTags,
  ),
  async ({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
      .goToRestfulBookerAdminPage(loginSteps)
      .populateCredentials("administrator")
      .clickLogin(adminPanelSteps)
      .verifyRoomVisibility(setupStepsDataset.stepData.roomInfo[0], true)
      .deleteRoom(setupStepsDataset.stepData.roomInfo[0])
      .verifyRoomVisibility(setupStepsDataset.stepData.roomInfo[0], false)
      .verifyRoomVisibility(setupStepsDataset.stepData.roomInfo[1], true)
      .deleteRoom(setupStepsDataset.stepData.roomInfo[1])
      .verifyRoomVisibility(setupStepsDataset.stepData.roomInfo[1], false)
      ._execute();
  },
);
