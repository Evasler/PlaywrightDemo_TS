import apiTest from "../../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../../src/helpers/chaining/StepSequenceHelper";
import requestHelper from "../../../../src/helpers/channel/RequestHelper";
import authSteps from "../../../../src/services/Auth/AuthSteps";
import roomSteps from "../../../../src/services/Room/RoomSteps";
import testUtils from "../../../../src/utils/TestUtils";
import dataset from "./teardownStepsApi.data";

apiTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
apiTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
    requestHelper.openNewContext();
    authSteps.login(dataset.stepData.loginArgs);
    roomSteps.createRoom(dataset.stepData.createRoomArgs);
    await stepSequenceHelper.stepSequence;
});