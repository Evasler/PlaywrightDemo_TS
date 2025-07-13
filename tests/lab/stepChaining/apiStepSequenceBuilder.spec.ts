import apiTest from "../../../src/fixtures/apiFixture";
import requestHelper from "../../../src/helpers/channel/requestHelper";
import authSteps from "../../../src/services/auth/authSteps";
import roomSteps from "../../../src/services/room/roomSteps";
import testUtils from "../../../src/utils/testUtils";

apiTest(testUtils.fullTitle(1, "Chained Function Object Model | StepSequenceBuilder"), async() => {
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
    await roomSteps.createRoom({
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
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
    await roomSteps.createRoom({
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
});