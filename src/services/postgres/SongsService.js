const { Pool } = require("./pool");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotfoundError");
const { mappingDBToModel } = require("../../utils");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }
  async addMusic({ title, year, performer, genre, duration, albumId }) {
    const id = "song-" + nanoid(16);
    insertedAt = new Date().toISOString();
    updatedAt = insertedAt;
    const query = {
      text: "INSERT INTO songs (id, title, year, performer, genre, duration, album_id, inserted_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        insertedAt,
        updatedAt,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Song failed to add");
    }
    return result.rows[0].id;
  }
  async getMusics() {
    const result = await this._pool.query(
      "SELECT id, title, performer FROM songs"
    );
    return result.rows;
  }

  async getMusicById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Song not found");
    }
    return mappingDBToModel(result.rows[0]);
  }
  async editMusicById(
    id,
    { title, year, performer, genre, duration, albumId }
  ) {
    updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to update. Id not found");
    }
    return result.rows[0].id;
  }

  async deleteMusicById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to delete. Id not found");
    }
    return result.rows[0].id;
  }
}

module.exports = { SongsService };
