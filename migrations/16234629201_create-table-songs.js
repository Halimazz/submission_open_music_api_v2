exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
    },
    duration: {
      type: "INT",
    },
    album_id: {
      type: "VARCHAR(50)",
      references: '"albums"',
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
}
exports.down = (pgm) => {
    pgm.dropTable("songs");
}
