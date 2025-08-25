// const SongHandlers = require("./handler");
import SongHandlers from "./handler.js";
// const routes = require("./routes");
import routes from "./routes.js";

const songs = {
  name: "songs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const songHandlers = new SongHandlers(service, validator);
    server.route(routes(songHandlers));
  },
};
// exports.songs = songs;
export default songs;
