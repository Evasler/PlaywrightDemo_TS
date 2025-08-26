# Test Automation Framework for Playwright

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logoColor=white)
![Faker.js](https://img.shields.io/badge/Faker.js-57AC70?style=for-the-badge&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

## 📋 Overview

This project is a **Test Automation Framework** for Playwright.\
It showcases modern testing practices and patterns for both **UI** and **API** testing.\
With a heavy focus on **maintainability**, **readability**, and **scalability**, a plethora of techniques is employed to create a powerful yet easy-to-use testing solution.

## 🛠️ Technical Stack

- **TypeScript**: Type-safe JavaScript
- **Playwright**: Core testing framework
- **Zod**: Schema validation
- **Faker.js**: Test data generation
- **Enforce Unique**: Unique test data generation
- **dotenv**: Environment configuration
- **Prettier**: Code formatting
- **ESLint**: Code quality
- **Madge**: Circular dependency detection
- **ExcelJS**: Excel report generation
- **GitHub Actions**: CI/CD integration

## ✨ Key Features

- **Multi-browser Support**: Tests run on multiple browsers with minimal configuration
- **Configuration Management**: Environment-based configurations
- **Comprehensive Reporting**: Custom reporters for Excel and Azure DevOps integration
- **Storage State Management**: Efficient authentication handling with storage states
- **Parameterized Tests**: Data-driven testing capabilities
- **Error Listeners**: Error detections occurring at any point during test execution

## 🏗️ Key Design Patterns

- **Page Object Model**: Encapsulates page interactions
- **Service Object Model**: Encapsulates service interactions
- **Modular Architecture**: Clear separation of concerns with dedicated modules
- **Fluent Interface**: Enables method chaining for readable and easy-to-write UI tests
- **Observer Pattern**: Listeners for event handling

## 🔐 Best Practices Demonstrated

- **Type Safety**: Extensive use of Zod, TypeScript interfaces and types
- **Clean Code**: Consistent code style and organization
- **Test Isolation**: Tests are independent and repeatable

## 📂 Project Structure

```
PlaywrightDemo_TS/
├── src/
│   ├── azureServices/      # Azure DevOps API integration
│   ├── fixtures/           # Custom test fixtures
│   ├── helpers/            # Helper functions grouped by domain
│   │   ├── chaining/       # Support for step chaining
│   │   ├── channel/        # Browser and request helpers
│   │   ├── data/           # Test data management
│   │   └── reporting/      # Reporting utilities
│   ├── listeners/          # Event listeners
│   ├── pages/              # Page objects and step definitions
│   │   ├── base/           # Base page functionality
│   │   └── restfulBooker/  # Application-specific pages
│   ├── reporters/          # Custom test reporters
│   ├── services/           # Application-specific API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── tests/
│   ├── api/                # API tests
│   ├── executionOrder/     # Tests demonstrating execution order
│   └── ui/                 # UI tests
├── resources/              # Test resources and configurations
├── excel-report/           # Excel report output
└── test-results/           # Test execution results
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Evasler/PlaywrightDemo_TS.git
cd PlaywrightDemo_TS

# Install dependencies
npm install

# Install browsers
npx playwright install
```

### Configure Environment

Create a `.env` file in the root directory:

```
GREP="@fullScope"
HEADLESS="false"
RETRIES="0"
WORKERS="1"
EXCEL_REPORTER_ENABLED="true"
EXCEL_REPORTER_MANDATORY="true"
AZURE_REPORTER_ENABLED="false"
AZURE_REPORTER_MANDATORY="false"
```

### Code Quality Checks

```bash
# TypeScript type checking
npm run tscAnalysis

# ESLint analysis
npm run eslintAnalysis

# Prettier formatting check
npm run prettierAnalysis

# Circular dependency check
npm run madgeAnalysis
```

### Running Tests

```bash
# Run tests in Chromium
npm run chromium-prod

# Run tests in Firefox
npm run firefox-prod

# Run the execution order project
npm run executionOrder

# Run robustness verification (repeat tests)
npm run robustnessVerification
```
