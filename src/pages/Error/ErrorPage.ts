import { BrowserHelper } from "../../helpers/BrowserHelper";
import { StorageStateHelper } from "../../helpers/StorageStateHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BasePage } from "../Base/BasePage";

export class ErrorPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, storageStateHelper: StorageStateHelper) {
        super("Error", browserHelper, stepSequenceHelper, storageStateHelper);
    }
}