import { StepSequenceManager } from "../../managers/StepSequenceManager";
import { BrowserManager } from "../../managers/BrowserManager";
import { BasePage } from "../Base/BasePage";

export class AjaxDataPage extends BasePage {

    constructor(browserManager: BrowserManager, stepSequenceManager: StepSequenceManager) {
        super("AjaxPage", browserManager, stepSequenceManager);
    }
}