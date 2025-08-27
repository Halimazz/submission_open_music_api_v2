// const ClientError = require("../../exceptions/ClientError");
import ClientError from "../../exceptions/ClientError.js";

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongHandler.bind(this);
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

  async getSongHandler() {
    const songs = await this._service.getSongs();
    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    try {
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: {
          song,
        },
      };
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
        message: "Sorry, there was a failure on our server.",
      });
      response.code(500);
      console.error(error);
    }
  }

  async putSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.editSongById(id, request.payload);
      return {
        status: "success",
        message: "Song successfully updated",
      };
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
        message: "Sorry, there was a failure on our server.",
      });
      response.code(500);
      console.error(error);
    }
  }

  async deleteSongHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: "success",
        message: "Song successfully deleted",
      };
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
        message: "Sorry, there was a failure on our server.",
      });
      response.code(500);
      console.error(error);
    }
  }
}

// module.exports = SongsHandler;
export default SongsHandler;
