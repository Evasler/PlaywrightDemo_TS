import { expect } from "@playwright/test";
import BrowserHelper from "../../../helpers/BrowserHelper";
import StepSequenceHelper from "../../../helpers/StepSequenceHelper";
import BasePage from "../../Base/BasePage";
import AdminPanelLocators from "./AdminPanelLocators";
import TempDataHelper from "../../../helpers/TempDataHelper";

export default class AdminPanelPage extends BasePage {

    private readonly _adminPanelLocators: AdminPanelLocators;

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("AdminPanel", browserHelper, stepSequenceHelper, tempDataHelper);
        this._adminPanelLocators = new AdminPanelLocators(browserHelper);
    }
    
    verifyLinkIsVisible(name: string) {
        this.addStep("verifyLinkIsVisible", async() => {
            console.log(`Verifying \"${name}\" link is visible`);
            await expect(this._adminPanelLocators.link(name)).toBeVisible();
        });
        return this;
    }
    
    deleteRoom(roomInfo: { roomName: string, type: string, accessible: string, price: string, roomDetails: string }) {
        this.addStep("deleteRoom", async() => {
            console.log(`deleteRoom`);
            await this._adminPanelLocators.deleteButton(roomInfo.roomName, roomInfo.type, roomInfo.accessible, roomInfo.price, roomInfo.roomDetails).click();
        });
        return this;
    }
    
    verifyRoomVisibility(roomInfo: { roomName: string, type: string, accessible: string, price: string, roomDetails: string }, shouldBeVisible: boolean) {
        this.addStep("verifyRoomVisibility", async() => {
            console.log(`verifyRoomVisibility`);
            if (shouldBeVisible)
                await expect(this._adminPanelLocators.row(roomInfo.roomName, roomInfo.type, roomInfo.accessible, roomInfo.price, roomInfo.roomDetails)).toBeVisible();
            else
                await expect(this._adminPanelLocators.row(roomInfo.roomName, roomInfo.type, roomInfo.accessible, roomInfo.price, roomInfo.roomDetails)).not.toBeVisible();
        });
        return this;
    }
}