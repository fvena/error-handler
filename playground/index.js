import { HandlerError } from "../dist/index.js";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";
    this.fetchEnvironmentInfo();
  }
}

function method1() {
  method2();
}

function method2() {
  method3();
}

function method3() {
  throw new AppError("Emails must include username, domain and extension.")
    .setLibrary("playground")
    .setErrorCode("INVALID_EMAIL")
    .setContext("The email entered during the registration process is invalid.")
    .setSolution(
      "1. Verify the email address entered.\n2. Correct the email address entered.\n3. Try again.",
    )
    .setValues({ email: "user@@example.com" })
    .setExample("user@example.com");
}

try {
  method1();
} catch (error) {
  if (error instanceof AppError) {
    error.log();
    console.log("");
    error.log("detail");
    console.log("");
    error.log("compact");
    console.log("");
    // eslint-disable-next-line unicorn/no-null -- It is a test
    console.log(JSON.stringify(error.environmentInfo, null, 2));
  } else {
    console.log("It is not an instance of AppError");
  }
}
