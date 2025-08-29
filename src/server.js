import "dotenv/config";
import Hapi from "@hapi/hapi";
import songs from "./api/songs/index.js";
import SongsService from "./services/postgres/SongsService.js";
import SongsValidator from "./validator/songs/index.js";

import albums from "./api/albums/index.js";
import AlbumsService from "./services/postgres/AlbumsService.js";
import AlbumsValidator from "./validator/albums/index.js";

const { PORT, HOST } = process.env;

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: PORT,
    host: HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (!(response instanceof Error)) {
      return h.continue;
    }

    // Kalau error dari Hapi (Boom error)
    if (response.isBoom) {
      const { statusCode, payload } = response.output;

      // Biar respons selalu konsisten
      return h
        .response({
          status: statusCode >= 500 ? "error" : "fail",
          message: payload.message,
        })
        .code(statusCode);
    }

    // Fallback (kalau ada error lain yang ga ketangkap)
    return h
      .response({
        status: "error",
        message: "Terjadi kegagalan pada server.",
      })
      .code(500);
  });

  try {
    await server.register([
      {
        plugin: songs,
        options: {
          service: songsService,
          validator: SongsValidator,
        },
      },
      {
        plugin: albums,
        options: {
          service: albumsService,
          validator: AlbumsValidator,
        },
      },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (err) {
    console.error(`Gagal memulai server: ${err.message}`);
    process.exit(1);
  }
};

init();
