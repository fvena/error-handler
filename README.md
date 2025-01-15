<br /><!-- markdownlint-disable-line -->

<p align="right">
  ⭐ &nbsp;&nbsp;<strong>to the project if you like it</strong> ↗️:
</p>

<h2 align="center">Handler Error</h2>
<p align="center">Handler Error is your go-to library for creating, managing, and logging errors effortlessly, whether you're working in Node.js or the browser. It standardizes error handling by adding rich context, metadata, and clean stack trace formatting to make debugging less of a headache.</p>

<br/>

<div align="center">

<!-- markdownlint-disable MD042 -->

[![SemVer](https://img.shields.io/npm/v/handler-error)](https://www.npmjs.com/package/handler-error)
[![npm bundle size](https://img.shields.io/bundlephobia/min/handler-error)](https://bundlephobia.com/package/handler-error)
[![Build Status](https://github.com/fvena/handler-error/workflows/CI%2FCD/badge.svg)](https://github.com/fvena/handler-error/actions)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/fvena/handler-error/actions)
[![Live Docs](https://img.shields.io/badge/docs-online-success.svg)](https://github.com/fvena/handler-error#readme)

<!-- markdownlint-enable MD042 -->

</div>

<br />

> **Want to write error messages that truly help developers?**
>
> Check out this [article](https://medium.com/@fvena32/como-escribir-mensajes-de-error-útiles-en-tus-librerías-04d0bb0f131d) where we explain best practices for creating useful error messages. This library is designed to follow those principles!

> **AI Assistant for Better Error Messages**
>
> I have developed a GPT-based assistant that follows these guidelines to help you write better error messages. You can access it [here](https://chatgpt.com/g/g-6773a5efd4688191b6fdc5268c4502f8-useful-error-message-guide)!

<br />

## ✨ Features

- **Custom Error Handling**: Create errors with detailed context, descriptions, solutions, and metadata.
- **Type Guards**: Check if an error is an instance of HandlerError using a type guard.

## 🚀 Getting Started

### Prerequisites

Ensure you have the latest version of npm installed and a supported version of Node.js:

- "Node.js": >=22.0.0
- "Browser Compatibility": Modern browsers (Chrome, Firefox, Edge, Safari)

### Installation

Install the library using npm:

```bash
npm install handler-error
```

Install the library using yarn:

```bash
yarn add handler-error
```

Install the library using pnpm:

```bash
pnpm add handler-error
```

## 🧑‍💻 Usage

### Create custom errors class

```typescript
import { HandlerError } from "handler-error";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";

    // Ensures the prototype chain is correctly set to HandlerError.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

### Type Guard

```typescript
function (error: Error): error is AppError {
  return error instanceof AppError;
}
```


### Catching and Handling errors

```typescript
function processRequest() {
  try {
    // Simulate an error
    throw new AppError("Request failed").setContext("API request");
  } catch (err) {
    if isAppError(err) {
      err.log("detail");
    } else {
      console.error("Unknown error:", err);
    }
  }
}
```

### Launch detailed custom error

```typescript
throw new AppError("Invalid email address provided.")
  .setLibrary("playground")
  .setErrorCode("INVALID_EMAIL")
  .setContext("The email entered during the registration process is invalid.")
  .setDescription("Emails must include username, domain and extension.")
  .setSolution(
    "1. Verify the email address entered.\n2. Correct the email address entered.\n3. Try again.",
  )
  .setValues({ email: "user@@example.com" })
  .setExample("user@example.com");
```

### Handling errors with a custom handler

```typescript
function handleError(error: Error) {
  if isAppError(err) {
    console.error("AppError:", error);
  } else {
    console.error("Unknown error:", error);
  }
}

try {
  throw new AppError("A critical error occurred")
    .setContext("Database operation")
    .setSeverity("critical");
} catch (error) {
  handleError(error);
}
```

## 📖 API Reference

### Properties

The Handler Error library provides a wide range of properties to enrich error handling and improve debugging.

- None of the properties are mandatory.
- Some properties have default values, while others are assigned a value when the error is thrown.
- For greater flexibility, almost properties are editable except:
  - `name`, which is defined when extending the class.
  - `message`, which is defined when throwing a new error.
  - `timestamp`, which is set when the error is thrown.
  - `stackTrace`, which is generated when the error is thrown.

> The properties are grouped into logical sections to make it easier for developers to understand their purpose and usage.

<br />

#### Identification

| Property    | Type     | Default     | Description                               |
| ----------- | -------- | ----------- | ----------------------------------------- |
| `id`        | `string` | `generated` | Unique identifier for the error.          |
| `file`      | `string` | `generated` | File in which the error occurred.         |
| `library`   | `string` |             | Library or package that caused the error. |
| `method`    | `string` | `generated` | Method in which the error occurred.       |
| `timestamp` | `Date`   | `generated` | Timestamp of when the error occurred.     |

<br />

#### Description

| Property   | Type     | Default | Description                                                             |
| ---------- | -------- | ------- | ----------------------------------------------------------------------- |
| `context`  | `string` |         | The context where the error occurred.                                   |
| `message`  | `string` |         | Message provided when the error is thrown, **not editable**.            |
| `name`     | `string` |         | Name of the error class, defined when creating it and **not editable**. |
| `solution` | `string` |         | Solution to resolve the error.                                          |

<br />

#### Categorization

| Property    | Type        | Default | Description                                    |
| ----------- | ----------- | ------- | ---------------------------------------------- |
| `errorCode` | `string`    |         | Custom error code.                             |
| `severity`  | `Severity`  |         | A custom error code for identifying the error. |
| `type`      | `ErrorType` | `error` | Type of error.                                 |

```typescript
/**
 * Represents the severity level of an error
 */
type Severity = "critical" | "high" | "medium" | "low";

/**
 * Represents the type of error
 */
type ErrorType = "error" | "warning";
```

<br />

#### Additional Information

| Property   | Type     | Default | Description                          |
| ---------- | -------- | ------- | ------------------------------------ |
| `example`  | `string` |         | Example of how to resolve the error. |
| `metadata` | `object` |         | Additional metadata for the error.   |
| `values`   | `object` |         | Values associated with the error.    |

---

### Setters

They allow developers to enrich the error with additional information.

#### Identification

| Method       | Type     | Description                                       |
| ------------ | -------- | ------------------------------------------------- |
| `setFile`    | `string` | Set the file in which the error occurred.         |
| `setLibrary` | `string` | Set the library or package that caused the error. |
| `setMethod`  | `string` | Set the method in which the error occurred.       |

<br />

#### Description

| Method        | Type     | Description                               |
| ------------- | -------- | ----------------------------------------- |
| `setContext`  | `string` | Set the context where the error occurred. |
| `setSolution` | `string` | Set a solution to resolve the error.      |

<br />

#### Categorization

| Method         | Type        | Description                                                                                      |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `setErrorCode` | `string`    | Set a custom error code.                                                                         |
| `setSeverity`  | `Severity`  | Set a custom error code for identifying the error. Accepts: `critical`, `high`, `medium`, `low`. |
| `setType`      | `ErrorType` | Set the type of error. Accepts: `error`, `warning`.                                              |

<br />

#### Additional Information

| Method        | Type     | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `setExample`  | `string` | Set an example of how to resolve the error. |
| `setMetadata` | `object` | Set additional metadata for the error.      |
| `setValues`   | `object` | Set values associated with the error.       |

---

## 🤝 Contributions

We welcome contributions! Here's how you can get involved:

1. Fork the repository.
1. Create a feature branch: `git checkout -b feature/<your-feature>`.
1. Install dependencies: `npm install`.
1. Make your changes.
1. Ensure tests pass: `npm test`.
1. Check code style: `npm run lint`.
1. Commit your changes: `git commit -m "feat: Add your feature"`.
1. Push to the branch: `git push origin feature/<your-feature>`.
1. Open a pull request.

**Note:** Please follow our commit message convention and ensure documentation is updated for new features.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<br />

<p align="center"> <strong>Thank you for using this library!</strong> <br /> <em>Made with ❤️ by [Francisco Vena](https://www.fvena.com)</em> </p>
