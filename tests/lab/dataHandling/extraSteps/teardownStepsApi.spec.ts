import apiTest from "../../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../../src/helpers/chaining/stepSequenceHelper";
import requestHelper from "../../../../src/helpers/channel/requestHelper";
import authSteps from "../../../../src/services/auth/authSteps";
import roomSteps from "../../../../src/services/room/roomSteps";
import testUtils from "../../../../src/utils/testUtils";
import dataset from "./teardownStepsApi.data";

apiTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
apiTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
    requestHelper.openNewContext();
    authSteps.login(dataset.stepData.loginArgs);
    roomSteps.createRoom(dataset.stepData.createRoomArgs);
    await stepSequenceHelper.stepSequence;
});