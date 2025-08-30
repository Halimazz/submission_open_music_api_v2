import { songPayloadSchema } from "./schema.js";
import InvariantError from "../../exceptions/InvariantError.js";

const SongsValidator = {
  validateSongPayload: (payload) => {
    const { error } = songPayloadSchema.validate(payload, {
      abortEarly: false,
    });
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default SongsValidator;
