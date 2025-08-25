import { songPayloadSchema } from "./schema.js";
import InvariantError from "../../exceptions/InvariantError.js";

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

// module.exports = SongsValidator;
export default SongsValidator;
