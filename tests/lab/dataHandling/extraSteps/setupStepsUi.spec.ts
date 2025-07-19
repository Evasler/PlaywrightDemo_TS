import extendedTest from "../../../../src/fixtures/extendedTest.js";
import { adminPanelSteps, blankSteps, loginSteps } from "../../../../src/pages/index.js";
import { testUtils } from "../../../../src/utils/index.js";
import dataset from "./setupStepsUi.data.js";

extendedTest.use({ setupStepsArgsArray: dataset.setupStepsArgsArray });
extendedTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    .goToRestfulBookerAdminPage(loginSteps)
    .populateCredentials("administrator")
    .clickLogin(adminPanelSteps)
    .verifyRoomVisibility(dataset.stepData.roomInfo, true)
    .deleteRoom(dataset.stepData.roomInfo)
    .verifyRoomVisibility(dataset.stepData.roomInfo, false)
    ._execute();
});