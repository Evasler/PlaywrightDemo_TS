import type { ExtraStepsArgs } from "./stepArgsTypes.js";

export type PageType = "BlankPage" | "LoginPage" | "AdminPanel" | "Error";
export type TestDataKeys =
  | "token"
  | "roomId"
  | "roomName"
  | "roomType"
  | "roomAccessible"
  | "roomPrice"
  | "roomFeatures";
export type LogLevel =
  | "test"
  | "describe"
  | "specFile"
  | "fixture"
  | "projectDependency"
  | "reporter";
export type SuiteTag = "@smoke" | "@regression" | "@fullScope";
export interface StorageState {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  }[];
  origins: [];
}
export interface ErrorListenerOptions {
  failOnJsError: boolean;
  failOnConnectionError: boolean;
  failOnRequestError: boolean;
}
export interface ErrorListenerOptionsObj {
  errorListenerOptions: ErrorListenerOptions;
}
export interface TestDetailsObj {
  testDetails: {
    id: number;
    title: string;
    suiteTags?: SuiteTag[];
  };
}
export interface FakerConfigArgs {
  seed?: number;
  defaultRefDateISO?: string;
}
export interface FakerConfigArgsObj {
  fakerConfigArgs: FakerConfigArgs;
}
export interface SetupStepsArgsObj {
  setupData?: ExtraStepsArgs[];
}
export interface TeardownStepsArgsObj {
  teardownData?: ExtraStepsArgs[];
}
export interface ExcelReporterOptions {
  enabled: boolean;
  mandatoryReporting: boolean;
  filepath: string;
  configurationNames: string[];
}
export interface AzureReporterOptions {
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
type AzureTestRunState =
  | "Unspecified"
  | "NotStarted"
  | "InProgress"
  | "Completed"
  | "Aborted"
  | "Waiting"
  | "NeedsInvestigation";
export interface RunDetails {
  name: string;
  automated: boolean;
  plan: { id: number };
  pointIds: number[];
  state: AzureTestRunState;
  startedDate: string;
  completedDate?: string;
}
export interface ResultDetails {
  id: number;
  outcome:
    | "Unspecified"
    | "None"
    | "Passed"
    | "Failed"
    | "Inconclusive"
    | "Timeout"
    | "Aborted"
    | "Blocked"
    | "NotExecuted"
    | "Warning"
    | "Error"
    | "NotApplicable"
    | "Paused"
    | "InProgress"
    | "NotImpacted";
  state: AzureTestRunState;
  startedDate: string;
  durationInMs: number;
  errorMessage?: string;
}
