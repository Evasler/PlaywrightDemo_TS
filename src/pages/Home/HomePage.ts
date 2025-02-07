import { BasePage } from "../Base/BasePage";
import { TestManager } from "../../managers/TestManager";
import { HomePageLocators } from "./HomeLocators";
import { AjaxDataPage } from "../AjaxData/AjaxDataPage";

export class HomePage extends BasePage {

    private readonly homePageLocators: HomePageLocators;

    constructor(testManager: TestManager) {
        super("HomePage", testManager);
        this.homePageLocators = new HomePageLocators(testManager.workingPage);
    }

    clickAjaxData(ajaxDataPage: AjaxDataPage) {
        this.addStep(async() => {
            await this.homePageLocators.ajaxDataLink.click();
        });
        return ajaxDataPage;
    }
}