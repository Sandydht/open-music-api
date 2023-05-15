const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const songTransform = require('../../transformers/songs');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].id) throw new InvariantError('Song gagal ditambahkan');

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    const query = {
      text: 'SELECT * FROM songs',
      values: [],
    };

    if (title && performer) {
      query.text = 'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)';
      query.values = [`%${title}%`, `%${performer}%`];
    } else if (title) {
      query.text = 'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1)';
      query.values = [`%${title}%`];
    } else if (performer) {
      query.text = 'SELECT * FROM songs WHERE LOWER(performer) LIKE LOWER($1)';
      query.values = [`%${performer}%`];
    }

    const result = await this.pool.query(query);
    return result.rows.map(songTransform.songList);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Song tidak ditemukan');

    return result.rows.map(songTransform.songDetail)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration,
  }) {
    const updatedAt = Math.floor(new Date().getTime() / 1000.0);
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, updatedAt, id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = SongsService;
