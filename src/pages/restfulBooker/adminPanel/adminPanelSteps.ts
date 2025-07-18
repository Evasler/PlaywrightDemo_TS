import { expect } from "@playwright/test";
import adminPanelLocators from "./adminPanelLocators.js";
import BaseSteps from "../../base/baseSteps.js";

class AdminPanelSteps extends BaseSteps {

    verifyLinkIsVisible(name: string) {
        this.addStep("verifyLinkIsVisible", async() => {
            console.log(`Verifying "${name}" link is visible`);
            await expect(adminPanelLocators.link(name)).toBeVisible();
        });
        return this;
    }
    
    deleteRoom(roomInfo: { roomName: string, type: string, accessible: string, price: string, roomDetails: string }) {
        this.addStep("deleteRoom", async() => {
            console.log(`deleteRoom`);
            await adminPanelLocators.deleteButton(roomInfo.roomName, roomInfo.type, roomInfo.accessible, roomInfo.price, roomInfo.roomDetails).click();
        });
        return this;
    }
    
    verifyRoomVisibility(roomInfo: { roomName: string, type: string, accessible: string, price: string, roomDetails: string }, shouldBeVisible: boolean) {
        this.addStep("verifyRoomVisibility", async() => {
            console.log(`verifyRoomVisibility`);
            if (shouldBeVisible)
                await expect(adminPanelLocators.row(roomInfo.roomName, roomInfo.type, roomInfo.accessible, roomInfo.price, roomInfo.roomDetails)).toBeVisible();
            else
                await expect(adminPanelLocators.row(roomInfo.roomName, roomInfo.type, roomInfo.accessible, roomInfo.price, roomInfo.roomDetails)).toBeHidden();
        });
        return this;
    }
}

export default new AdminPanelSteps("AdminPanel");