import AuthSteps from "../services/Auth/AuthSteps";
import RoomSteps from "../services/Room/RoomSteps";
import StepSequenceHelper from "./StepSequenceHelper";
import RequestHelper from "./RequestHelper";
import TempDataHelper from "./TempDataHelper";

export default class ServiceHelper {

    private _authService?: AuthSteps;
    private _roomService?: RoomSteps;

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper, private readonly _baseUrl: string) { }
    
    get authService() {
        if (this._authService === undefined) {
            this._authService = new AuthSteps(this._requestHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._authService;
    }
    
    get roomService() {
        if (this._roomService === undefined) {
            this._roomService = new RoomSteps(this._requestHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._roomService;
    }
}