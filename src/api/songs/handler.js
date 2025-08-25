// const ClientError = require("../../exceptions/ClientError");
import ClientError from "../../exceptions/ClientError.js";

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongHandler = this.putSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre, duration } = request.payload;
      const songId = await this._service.addSong({
        title,
        year,
        performer,
        genre,
        duration,
      });
      const response = h.response({
        status: "success",
        message: "Song successfully added",
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // 500 Server ERROR!!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
    }
  }

  async getSongHandler(request, h) {}

  async getSongByIdHandler(request, h) {}

  async putSongHandler(request, h) {}

  async deleteSongHandler(request, h) {}
}

// module.exports = SongsHandler;
export default SongsHandler;
