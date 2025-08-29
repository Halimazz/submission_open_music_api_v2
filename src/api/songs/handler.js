class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // binding semua method dengan benar
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      const payload = request.payload;

      // validasi payload
      if (Array.isArray(payload)) {
        payload.forEach((song) => this._validator.validateSongPayload(song));
      } else {
        this._validator.validateSongPayload(payload);
      }

      // simpan lagu (single atau bulk)
      const songIds = await this._service.addMusic(payload);

      // response sukses
      const response = h.response({
        status: "success",
        message: Array.isArray(payload)
          ? "Songs successfully added"
          : "Song successfully added",
        data: { songIds },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error("🔥 ERROR in postSongHandler:", error);

      // kalau error dari client (bad request / invariant / not found)
      if (error.name === "InvariantError" || error.name === "ClientError") {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode || 400);
        return response;
      }

      // kalau error internal server
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }

  async getSongHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getMusics({ title, performer });
    const response = h.response({
      status: "success",
      data: { songs },
    });
    return response;
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getMusicById(id);
    return {
      status: "success",
      data: { song },
    };
  }

  async putSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, performer, genre, duration, albumId } =
      request.payload;
    const response = h.response({
      status: "success",
      message: "Song successfully updated",
    });

    await this._service.editMusicById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    return {
      status: "success",
      message: "Song successfully updated",
    };
  }

  async deleteSongHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteMusicById(id);
    const response = h.response({
      status: "success",
      message: "Song successfully deleted",
    });
    return response;
  }
}

export default SongsHandler;
