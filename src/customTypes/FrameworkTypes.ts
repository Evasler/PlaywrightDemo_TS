import UiHelper from "../helpers/testInitiation/UiHelper";
import ApiHelper from "../helpers/testInitiation/ApiHelper";
import { ExtraStepsArgs } from "./StepArgsTypes";

export type PageType = "BlankPage" | "LoginPage" | "AdminPanel" | "Error";
export type LogLevel = "test" | "describe" | "specFile" | "fixture" | "projectDependency" | "reporter";
export type SuiteTag = "@smoke" | "@regression" | "@fullScope";
export type StorageState = {
    cookies: {
        name: string,
        value: string,
        domain: string,
        path: string,
        expires: number,
        httpOnly: boolean,
        secure: boolean,
        sameSite: string
    }[],
    origins: []
}
export type ErrorListenerOptions = {
    failOnJsError: boolean;
    failOnConnectionError: boolean;
    failOnRequestError: boolean;
};
export type ErrorListenerOptionsObj = { errorListenerOptions: ErrorListenerOptions };
export type UiHelperObj = { ui: UiHelper; };
export type ApiHelperObj = { api: ApiHelper };
export type TestDetailsObj = {
    testDetails: {
        id: number;
        title: string;
        suiteTags?: SuiteTag[];
    };
}
export type SetupStepsArgsObj = { setupStepsArgsArray?: ExtraStepsArgs[] };
export type TeardownStepsArgsObj = { teardownStepsArgsArray?: ExtraStepsArgs[] };
export type ExcelReporterOptions = {
    enabled: boolean;
    mandatoryReporting: boolean;
    filepath: string;
    configurations: string[];
}
export type AzureReporterOptions = {
    enabled: boolean;
    mandatoryReporting: boolean;
    azureBaseUrl: string;
    organizationName: string;
    projectName: string;
    personalAccessToken: string;
    runName: string;
    planId: number;
    suiteIds: number[];
    configurationNames: string[];
}
type AzureTestRunState = "Unspecified" | "NotStarted" | "InProgress" | "Completed" | "Aborted" | "Waiting" | "NeedsInvestigation";
export type RunDetails = {
    name: string;
    automated: boolean;
    plan: { id: number };
    pointIds: number[];
    state: AzureTestRunState;
    startedDate: string;
}
export type ResultDetails = {
    id: number;
    outcome: "Unspecified" | "None" | "Passed" | "Failed" | "Inconclusive" | "Timeout" | "Aborted" | "Blocked" | "NotExecuted" | "Warning" | "Error" | "NotApplicable" | "Paused" | "InProgress" | "NotImpacted";
    state: AzureTestRunState;
    startedDate: string;
    durationInMs: number;
    errorMessage: string | undefined;
}