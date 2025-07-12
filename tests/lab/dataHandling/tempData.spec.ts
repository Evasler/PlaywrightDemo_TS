import apiTest from "../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import requestHelper from "../../../src/helpers/channel/requestHelper";
import authSteps from "../../../src/services/auth/authSteps";
import roomSteps from "../../../src/services/room/roomSteps";
import testUtils from "../../../src/utils/testUtils";

apiTest(testUtils.fullTitle(1, "Temporary Data"), async() => {
    requestHelper.openNewContext();
    authSteps.login({ user: "administrator" });
    roomSteps.createRoom({
        payload: {
            roomName: "996",
            type: "Double",
            accessible: false,
            description: "Double room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 350,
            features: ["TV"]
        }
    });
    roomSteps.getRoomId({ roomName: "996" });
    roomSteps.createRoom({
        payload: {
            roomName: "997",
            type: "Family",
            accessible: false,
            description: "Family room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 400,
            features: ["Views"]
        }
    });
    roomSteps.getRoomId({ roomName: "997" });
    roomSteps.deleteRoom({ tempDataIndex: 0 });
    roomSteps.deleteRoom({ tempDataIndex: 1 });
    await stepSequenceHelper.stepSequence;
});