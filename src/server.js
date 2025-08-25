// const Hapi = require("@hapi/hapi");
import dotenv from "dotenv";
import Hapi from "@hapi/hapi";
import songs from "./api/songs/index.js"; // Ganti './api/songs' dengan './api/songs/index.js' jika file tersebut
import SongsService from "./services/postgres/SongsService.js";
import SongsValidator from "./validator/songs/index.js";

// Menggunakan destrukturisasi untuk mengambil variabel lingkungan
const { PORT, HOST } = process.env;

const init = async () => {
  const songsService = new SongsService();

  const server = Hapi.server({
    port: PORT,
    host: HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  try {
    await server.register({
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (err) {
    console.error(`Gagal memulai server: ${err.message}`);
    process.exit(1);
  }
};

init();
