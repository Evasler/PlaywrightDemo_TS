import extendedTest from "../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../src/helpers/channel/requestHelper.js";
import authSteps from "../../../src/services/auth/authSteps.js";
import roomSteps from "../../../src/services/room/roomSteps.js";
import testUtils from "../../../src/utils/testUtils.js";

extendedTest(testUtils.fullTitle(1, "Temporary Data"), async() => {
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
    await roomSteps.createRoom({
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
    await roomSteps.getRoomId({ roomName: "996" });
    await roomSteps.createRoom({
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
    await roomSteps.getRoomId({ roomName: "997" });
    await roomSteps.deleteRoom({ tempDataIndex: 0 });
    await roomSteps.deleteRoom({ tempDataIndex: 1 });
});