import uiTest from "../../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../../src/helpers/chaining/StepSequenceHelper";
import browserHelper from "../../../../src/helpers/channel/BrowserHelper";
import blankSteps from "../../../../src/pages/Blank/BlankSteps";
import loginSteps from "../../../../src/pages/RestfulBooker/Login/LoginSteps";
import testUtils from "../../../../src/utils/TestUtils";
import dataset from "./setupStepsUi.data";

uiTest.use({ setupStepsArgsArray: dataset.setupStepsArgsArray });
uiTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToRestfulBookerAdminPage(loginSteps)
    .populateCredentials("administrator")
    .clickLogin()
    .verifyRoomVisibility(dataset.stepData.roomInfo, true)
    .deleteRoom(dataset.stepData.roomInfo)
    .verifyRoomVisibility(dataset.stepData.roomInfo, false);
    await stepSequenceHelper.stepSequence;
});