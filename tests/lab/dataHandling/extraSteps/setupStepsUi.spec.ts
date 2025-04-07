import uiTest from "../../../../src/fixtures/uiFixtures";
import TestUtils from "../../../../src/utils/TestUtils";
import dataset from "./setupStepsUi.data";

uiTest.use({ setupStepsArgsArray: dataset.setupStepsArgsArray });
uiTest(TestUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ ui }) => {
    await ui
    ._openNewTabInNewContext(ui.pageHelper.blankPage)
    .goToRestfulBooker(ui.pageHelper.loginPage)
    .populateCredentials("administrator")
    .clickLogin(ui.pageHelper.adminPanelPage)
    .verifyRoomVisibility(dataset.stepData.roomInfo, true)
    .deleteRoom(dataset.stepData.roomInfo)
    .verifyRoomVisibility(dataset.stepData.roomInfo, false)
    ._execute();
});