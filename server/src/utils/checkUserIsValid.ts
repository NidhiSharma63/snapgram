import mongoose from "mongoose";

function isValidObjectId(id: string) {
	return mongoose.Types.ObjectId.isValid(id);
}
export default isValidObjectId;
