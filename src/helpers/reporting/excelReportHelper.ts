/**
 * @description This module provides functionality for managing Excel-based test reporting.
 * It handles validating the Excel file structure, updating test results, and reporting errors
 * when test results cannot be properly recorded. The module enforces a specific worksheet
 * structure and naming convention to maintain consistent reporting.
 */

import type { Suite, TestCase, TestResult } from "@playwright/test/reporter";
import Excel from "exceljs";
import {
  errorHandlingUtils,
  fileUtils,
  generalUtils,
  terminalUtils,
  testUtils,
} from "../../utils/index.js";

/** Array to track tests that couldn't be reported to Excel */
const unreportedTestTitles: string[] = [];

/** Path to the Excel report file */
let filepath: string;

/** Allowed configuration names for test projects */
let configurationNames: string[] = [];

/**
 * Generates the worksheet name for a specific test type
 *
 * @param testType - The type of test (API or UI)
 * @returns The standardized worksheet name for the test type
 */
function getWorksheetName(testType: "API" | "UI") {
  return `FullScope (${testType})`;
}

/**
 * Validates that the Excel report file can be opened and written to
 *
 * This function attempts to read and write the Excel file to verify that it's not locked
 * by another process and has proper write permissions.
 *
 * @returns A boolean indicating whether the Excel file is writable
 */
async function excelIsWritable() {
  try {
    const workbook = await new Excel.Workbook().xlsx.readFile(filepath);
    await workbook.xlsx.writeFile(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates the Excel report file's existence and structure
 *
 * This function checks if:
 * 1. The Excel file exists in the specified location
 * 2. The file is writable (not locked by another process)
 * 3. Required worksheets exist with the correct column headers
 *
 * @returns An array of error messages, or an empty array if no errors were found
 */
async function getExcelFileErrors() {
  const excelFileErrors = [];
  if (!fileUtils.fileExists(filepath))
    excelFileErrors.push(`Filepath "${filepath}" not found`);
  else if (!(await excelIsWritable()))
    excelFileErrors.push(`Excel Report is locked or not writable`);
  else {
    excelFileErrors.push(
      ...(await getWorksheetErrors(getWorksheetName("API"))),
    );
    excelFileErrors.push(...(await getWorksheetErrors(getWorksheetName("UI"))));
  }
  return excelFileErrors;
}

/**
 * Validates that a worksheet exists and has the expected column headers
 *
 * This function verifies that:
 * 1. The specified worksheet exists in the Excel file
 * 2. The worksheet's first row contains the expected column headers in the correct order
 *
 * @param worksheetName - The name of the worksheet to validate
 * @returns An array of error messages, or an empty array if no errors were found
 */
async function getWorksheetErrors(worksheetName: string) {
  const worksheetErrors = [];
  const worksheet = await getWorksheet(worksheetName);
  if (!worksheet)
    worksheetErrors.push(`Worksheet "${worksheetName}" not found`);
  else {
    const expectedHeaders = [
      "ID",
      "Title",
      "Configuration",
      "Result",
      "Error",
      "Duration",
      "Date",
      "Issue",
      "Note",
    ];
    for (let i = 1; i <= expectedHeaders.length; i++) {
      const actualValue = worksheet.getRow(1).getCell(i).text;
      const expectedValue = expectedHeaders[i - 1];
      if (actualValue !== expectedValue)
        worksheetErrors.push(
          `Cell [${i},1] of Worksheet "${worksheetName}" should be "${expectedValue}" instead of "${actualValue}"`,
        );
    }
  }
  return worksheetErrors;
}

/**
 * Validates that a project name includes exactly one configuration
 *
 * This function checks if the project name contains exactly one of the configured
 * configuration names. This ensures that test results can be properly categorized in the Excel report.
 *
 * @param projectName - The Playwright project name to validate
 * @returns An array of error messages, or an empty array if no errors were found
 */
function getProjectErrors(projectName: string) {
  const projectErrors = [];
  const projectConfigurations = configurationNames.filter((configuration) =>
    projectName.includes(configuration),
  );
  if (projectConfigurations.length === 0)
    projectErrors.push(
      `Project "${projectName}" does not specify the configuration (${configurationNames.join("|")})`,
    );
  else if (projectConfigurations.length > 1)
    projectErrors.push(
      `Project "${projectName}" specifies multiple configurations (${configurationNames.join("|")})`,
    );
  return projectErrors;
}

/**
 * Validates a test case's file path, title format, and existence in the Excel report
 *
 * This function performs multiple validations:
 * 1. Verifies the test file path correctly indicates the test type (API or UI)
 * 2. Ensures the test title follows the required format (containing a numeric ID)
 * 3. Checks that a matching test point exists in the Excel report (if the Excel file is valid)
 *
 * @param test - The Playwright test case to validate
 * @param projectName - The name of the project the test belongs to
 * @param excelFileIsValid - Flag indicating if the Excel file passed basic validation
 * @returns An array of error messages, or an empty array if no errors were found
 */
async function getTestErrors(
  test: TestCase,
  projectName: string,
  excelFileIsValid: boolean,
) {
  const testFileErrors: string[] = [];
  const titleErrors: string[] = [];
  const testPointErrors: string[] = [];

  let testType: "API" | "UI" | undefined = undefined;
  const testFilepathSpecifiesUi = /(\\|\/)ui(\\|\/)/.test(test.location.file);
  const testFilepathSpecifiesApi = /(\\|\/)api(\\|\/)/.test(test.location.file);
  if (testFilepathSpecifiesUi && !testFilepathSpecifiesApi) testType = "UI";
  else if (!testFilepathSpecifiesUi && testFilepathSpecifiesApi)
    testType = "API";
  else if (testFilepathSpecifiesUi && testFilepathSpecifiesApi)
    testFileErrors.push(
      `Filepath "${test.location.file}" specifies multiple Test Types (api|ui)`,
    );
  else
    testFileErrors.push(
      `Filepath "${test.location.file}" should include a directory that specifies the Test Type (api|ui)`,
    );

  if (!test.title.includes(":"))
    titleErrors.push(`Title "${test.title}" should include a ":"`);
  const testId = test.title.substring(0, test.title.indexOf(":"));
  if (titleErrors.length === 0 && !/\d+/.test(testId))
    titleErrors.push(`TestId "${testId}" should be a number`);

  if (excelFileIsValid && testFileErrors.length === 0 && testType) {
    const projectConfigurations = configurationNames.filter((configuration) =>
      projectName.includes(configuration),
    );
    if (titleErrors.length === 0 && projectConfigurations.length === 1)
      if (!(await testPointExists(test)))
        testPointErrors.push(
          `Test Point [${testId},${projectConfigurations[0]}] not found in "${getWorksheetName(testType)}"`,
        );
  }
  return [...testFileErrors, ...titleErrors, ...testPointErrors];
}

/**
 * Retrieves a worksheet from the Excel report file
 *
 * @param worksheetName - The name of the worksheet to retrieve
 * @returns The worksheet object, or undefined if not found
 */
async function getWorksheet(worksheetName: string) {
  const workbook = await new Excel.Workbook().xlsx.readFile(filepath);
  const worksheet = workbook.getWorksheet(worksheetName);
  return worksheet;
}

/**
 * Checks if a test point exists in the Excel report
 *
 * This function searches for a row in the appropriate worksheet that matches
 * the test ID and configuration of the provided test case.
 *
 * @param test - The Playwright test case to check for
 * @returns A boolean indicating whether the test point exists in the Excel report
 */
async function testPointExists(test: TestCase) {
  let _testId;
  let _projectConfiguration;
  let _testType: "API" | "UI";
  try {
    _testId = testUtils.id(test);
    _projectConfiguration = testUtils.projectConfiguration(
      test,
      configurationNames,
    );
    _testType = testUtils.type(test);
  } catch {
    return false;
  }
  const worksheet = await getWorksheet(getWorksheetName(_testType));
  if (!worksheet) return false;
  for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
    const row = worksheet.getRow(rowIndex);
    const testIdCellValue = row.getCell(1).text;
    const configurationCellValue = row.getCell(3).text;
    if (
      testIdCellValue === _testId &&
      configurationCellValue === _projectConfiguration
    )
      return true;
  }
  return false;
}

/**
 * Helper module for managing Excel-based test reporting.
 *
 * This module provides functionality to validate, update, and maintain an Excel report
 * for test results. It ensures that the Excel file structure is valid and that each test
 * has a corresponding entry in the report. When tests are executed, it updates the
 * appropriate cells with results, error messages, and timing information.
 */
const excelReportHelper = {
  /**
   * Initializes the Excel reporter with file path and configuration information
   *
   * @param excelData - Configuration object containing file path and configuration names
   * @param excelData.filepath - Path to the Excel report file
   * @param excelData.configurationNames - Array of configuration names used in the test run
   */
  init(excelData: { filepath: string; configurationNames: string[] }) {
    filepath = excelData.filepath;
    configurationNames = excelData.configurationNames;
  },

  /**
   * Updates the test result in the Excel report
   *
   * This method:
   * 1. Locates the appropriate row in the Excel file for the test
   * 2. Updates result, error message, duration, and date cells
   * 3. Saves the Excel file with the updated information
   * 4. Tracks tests that couldn't be reported for later warning
   *
   * @param test - The Playwright test case that was executed
   * @param result - The test execution result
   */
  async updateResult(test: TestCase, result: TestResult) {
    let _testId;
    let _projectConfiguration;
    let _testType: "API" | "UI";
    let workbook;
    let worksheet;
    try {
      _testId = testUtils.id(test);
      _projectConfiguration = testUtils.projectConfiguration(
        test,
        configurationNames,
      );
      _testType = testUtils.type(test);
      workbook = await new Excel.Workbook().xlsx.readFile(filepath);
      const worksheetName = getWorksheetName(_testType);
      const worksheetErrors = await getWorksheetErrors(worksheetName);
      if (worksheetErrors.length > 0)
        throw new Error(
          `Worksheet "${worksheetName}" has errors: ${worksheetErrors.join(", ")}`,
        );
      worksheet = workbook.getWorksheet(worksheetName);
      if (!worksheet) throw new Error(`Worksheet "${worksheetName}" not found`);
    } catch {
      unreportedTestTitles.push(test.title);
      return;
    }
    let testPointExists = false;
    for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      const testIdCellValue = row.getCell(1).text;
      const configurationCellValue = row.getCell(3).text;
      if (
        testIdCellValue === _testId &&
        configurationCellValue === _projectConfiguration
      ) {
        const resultCell = row.getCell(4);
        const errorCell = row.getCell(5);
        const durationCell = row.getCell(6);
        const dateCell = row.getCell(7);
        if (result.status !== "skipped") {
          resultCell.value = testUtils.status(result);
          if (result.error?.message)
            errorCell.value = terminalUtils.clearOutput(result.error.message);
          durationCell.value = generalUtils.millisToString(result.duration);
          dateCell.value = generalUtils.getCurrentDate();
        }
        testPointExists = true;
        break;
      }
    }
    if (testPointExists) await workbook.xlsx.writeFile(filepath);
    else unreportedTestTitles.push(test.title);
  },

  /**
   * Logs warnings for tests that couldn't be reported to Excel
   *
   * This method generates warning messages for any tests that couldn't be properly
   * reported to the Excel file, typically due to missing test points or Excel file errors.
   */
  printUnreportedTestResultsWarning() {
    if (unreportedTestTitles.length > 0)
      errorHandlingUtils.reportWarnings(
        "Excel",
        unreportedTestTitles.map(
          (title) => `Test result not reported: ${title}`,
        ),
      );
  },

  /**
   * Validates all test cases in a test suite against the Excel report
   *
   * This method performs comprehensive validation for all tests:
   * 1. Checks Excel file structure and permissions
   * 2. Validates the project's configuration naming
   * 3. Verifies each test case has a corresponding entry in the Excel report
   *
   * If any validation errors are found, they are reported and the test execution stops.
   *
   * @param rootSuite - The Playwright root suite containing all test projects and tests
   * @throws If any validation errors are found, preventing test execution
   */
  async throwReportingErrors(rootSuite: Suite) {
    const excelFileErrors: string[] = [];
    const projectErrors: string[] = [];
    const testErrors: string[] = [];
    excelFileErrors.push(...(await getExcelFileErrors()));
    for (const projectSuite of rootSuite.suites) {
      const project = projectSuite.project();
      if (!project) {
        projectErrors.push(
          `Suite "${projectSuite.title}" does not have a project defined.`,
        );
        continue;
      }
      projectErrors.push(...getProjectErrors(project.name));
      for (const test of projectSuite.allTests())
        testErrors.push(
          ...(await getTestErrors(
            test,
            project.name,
            excelFileErrors.length === 0,
          )),
        );
    }
    const uniqueReportingErrors = [
      ...new Set([...excelFileErrors, ...projectErrors, ...testErrors]),
    ];
    if (uniqueReportingErrors.length > 0)
      errorHandlingUtils.reportErrors("Excel", uniqueReportingErrors);
  },
};

export default excelReportHelper;
