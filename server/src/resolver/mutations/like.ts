import { handleGraphQLError, throwError } from "../../middleware/ErrorHandler";
import Like from "../../models/likesSchema";

async function getLike(post) {
	try {
		if (!userId) throwError("User id is Missiing");
		return await Like.find({ userId }).setOptions({ lean: true });
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}
