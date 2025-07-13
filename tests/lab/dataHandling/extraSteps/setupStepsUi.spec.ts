import extendedTest from "../../../../src/fixtures/extendedTest";
import stepSequenceHelper from "../../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../../src/pages/blank/blankSteps";
import loginSteps from "../../../../src/pages/restfulBooker/login/loginSteps";
import testUtils from "../../../../src/utils/testUtils";
import dataset from "./setupStepsUi.data";

extendedTest.use({ setupStepsArgsArray: dataset.setupStepsArgsArray });
extendedTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
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