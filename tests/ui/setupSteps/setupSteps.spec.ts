import extendedTest from "../../../src/fixtures/extendedTest.js";
import {
  roomsSteps,
  blankSteps,
  loginSteps,
} from "../../../src/pages/index.js";
import { testUtils } from "../../../src/utils/index.js";
import setupStepsDataset from "./setupSteps.data.js";

extendedTest.use({
  setupData: [setupStepsDataset.setupData, { scope: "test" }],
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
      .clickLogin(roomsSteps)
      .verifyRoomVisibility(
        setupStepsDataset.stepData.verifyRoomVisibilityArgs[0],
      )
      .deleteRoom(setupStepsDataset.stepData.deleteRoomArgs[0])
      .verifyRoomVisibility(
        setupStepsDataset.stepData.verifyRoomVisibilityArgs[1],
      )
      .verifyRoomVisibility(
        setupStepsDataset.stepData.verifyRoomVisibilityArgs[2],
      )
      .deleteRoom(setupStepsDataset.stepData.deleteRoomArgs[1])
      .verifyRoomVisibility(
        setupStepsDataset.stepData.verifyRoomVisibilityArgs[3],
      )
      ._execute();
  },
);
