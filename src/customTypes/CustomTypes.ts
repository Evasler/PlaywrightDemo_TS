import { ServiceHelper } from "../helpers/ServiceHelper";
import { PageHelper } from "../helpers/PageHelper";

export type PageType = "BlankPage" | "Login" | "AdminPanel" | "Error" | "HomePage" | "AjaxPage";
export type LogLevel = "test" | "describe" | "specFile" | "fixture" | "projectDependency" | "reporter";
export type SharedUser = { sharedUser: string | undefined; };
export type ErrorListenerOptions = {
    failOnJsError: boolean;
    failOnConnectionError: boolean;
    failOnRequestError: boolean;
};
export type ErrorListenerOptionsObj = { errorListenerOptions: ErrorListenerOptions; };
export type PageHelperObj = { pageHelper: PageHelper; };
export type ServiceHelperObj = { serviceHelper: ServiceHelper; };