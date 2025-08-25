const SongHandlers = require("./handler");
const routes = require("./routes");

const songs = {
  name: "songs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const songHandlers = new SongHandlers(service, validator);
    server.route(routes(songHandlers));
  },
};
exports.songs = songs;
