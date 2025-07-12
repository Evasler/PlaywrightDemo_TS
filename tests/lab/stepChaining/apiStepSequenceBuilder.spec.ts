import apiTest from "../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../src/helpers/chaining/StepSequenceHelper";
import requestHelper from "../../../src/helpers/channel/RequestHelper";
import authSteps from "../../../src/services/Auth/AuthSteps";
import roomSteps from "../../../src/services/Room/RoomSteps";
import testUtils from "../../../src/utils/TestUtils";

apiTest(testUtils.fullTitle(1, "Chained Function Object Model | StepSequenceBuilder"), async() => {
    requestHelper.openNewContext();
    authSteps.login({ user: "administrator" });
    roomSteps.createRoom({
        payload: {
            roomName: "998",
            type: "Double",
            accessible: false,
            description: "Double room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 350,
            features: ["TV"]
        }
    });
    requestHelper.openNewContext();
    authSteps.login({ user: "administrator" });
    roomSteps.createRoom({
        payload: {
            roomName: "999",
            type: "Family",
            accessible: false,
            description: "Family room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 400,
            features: ["Views"]
        }
    });
    await stepSequenceHelper.stepSequence;
});