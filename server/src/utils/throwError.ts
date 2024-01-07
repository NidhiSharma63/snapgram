import { GraphQLError } from "graphql";

function throwError(message: string, code = "BAD_REQUEST"): never {
	throw new GraphQLError(message, {
		extensions: { code },
	});
}

export default throwError;
