import { ApiHelper } from "../helpers/ApiHelper";
import { UiHelper } from "../helpers/UiHelper";

export type ErrorListenerOptions = {
    failOnJsError: boolean;
    failOnConnectionError: boolean;
    failOnRequestError: boolean;
};
export type ErrorListenerOptionsObj = { errorListenerOptions: ErrorListenerOptions; };
export type UiHelperObj = { ui: UiHelper; };
export type ApiHelperObj = { api: ApiHelper; };