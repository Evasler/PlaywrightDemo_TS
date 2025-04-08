import uiTest from "../../../../src/fixtures/uiFixtures";
import TestUtils from "../../../../src/utils/TestUtils";
import dataset from "./setupStepsUi.data";

uiTest.use({ setupStepsArgsArray: dataset.setupStepsArgsArray });
uiTest(TestUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageStepsHelper.blankSteps)
    .goToRestfulBooker(ui.pageStepsHelper.loginSteps)
    .populateCredentials("administrator")
    .clickLogin(ui.pageStepsHelper.adminPanelSteps)
    .verifyRoomVisibility(dataset.stepData.roomInfo, true)
    .deleteRoom(dataset.stepData.roomInfo)
    .verifyRoomVisibility(dataset.stepData.roomInfo, false)
    ._execute();
});