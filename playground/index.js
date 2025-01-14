import { HandlerError } from "../dist/index.js";

class AppError extends HandlerError {
  constructor(message) {
    super(message);
    this.name = "AppError";
  }
}

function method1() {
  method2();
}

function method2() {
  method3();
}

function method3() {
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
}

try {
  method1();
} catch (error) {
  console.error(error.name);
  console.error(error.message);
  console.error(error.library);
  console.error(error.errorCode);
  console.error(error.context);
  console.error(error.description);
  console.error(error.solution);
  console.error(error.values);
  console.error(error.example);
}
