import { GraphQLError } from "graphql";

class UserInputError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserInputError";
	}
}

function throwError(message: string): never {
	throw new UserInputError(message);
}

function handleGraphQLError(error: Error) {
	console.error(error); // Log the error for debugging

	if (error instanceof UserInputError) {
		throw new GraphQLError(error.message, {
			extensions: { code: "BAD_USER_INPUT" },
		});
	}

	// For other types of errors (server errors)
	throw new GraphQLError("It's ain't you, it's me", {
		extensions: { code: "INTERNAL_SERVER_ERROR" },
	});
}

export { UserInputError, handleGraphQLError, throwError };
