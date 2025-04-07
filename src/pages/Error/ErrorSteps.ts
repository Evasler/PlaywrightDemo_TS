import BrowserHelper from "../../helpers/BrowserHelper";
import TempDataHelper from "../../helpers/TempDataHelper";
import StepSequenceHelper from "../../helpers/StepSequenceHelper";
import BasePageSteps from "../Base/BasePageSteps";

export default class ErrorSteps extends BasePageSteps {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("Error", browserHelper, stepSequenceHelper, tempDataHelper);
    }
}