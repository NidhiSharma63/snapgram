class CustomError extends Error {
	code: string;

	constructor(message: string, code: string = "GENERIC_ERROR") {
		super(message);
		this.code = code;
	}
}

function handleError(error: CustomError): CustomError {
	if (error.code === "USER_INPUT_ERROR") {
		return error;
	}
	// Log the full error for internal debugging
	console.error(error);
	// Return a generic error message for unknown server errors
	return new CustomError("Something went wrong, please try again");
}
