import { GraphQLScalarType } from "graphql";

export const dateScalar = new GraphQLScalarType({
	name: "Date",
	// parseValue converts the client input to a Date object
	parseValue(value: unknown): Date {
		if (typeof value !== "string") {
			throw new TypeError(`Value is not a string: ${value}`);
		}

		return new Date(value); // value from the client input
	},

	serialize(value: unknown): string {
		if (value instanceof Date) {
			return value.toISOString();
		}
		throw new Error("serialize function received a non-Date value");
	},
});
