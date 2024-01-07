class UserInputError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserInputError";
	}
}

function throwError(message: string): never {
	throw new UserInputError(message);
}

export { UserInputError, throwError };
