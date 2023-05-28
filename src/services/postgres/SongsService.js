const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const songsTransform = require('../../transformers/songs');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong(payload) {
    const {
      title, year, genre, performer, duration, albumId,
    } = payload;
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

  async getSongs(queryParams) {
    const { title, performer } = queryParams;

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

    const songs = await this.pool.query(query);
    const result = songsTransform.songList(songs.rows);
    return result;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const song = await this.pool.query(query);
    if (!song.rowCount) throw new NotFoundError('Song tidak ditemukan');

    const result = songsTransform.showSong(song.rows[0]);
    return result;
  }

  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const songs = await this.pool.query(query);
    const result = songsTransform.songList(songs.rows);
    return result;
  }

  async editSongById(id, payload) {
    const {
      title, year, genre, performer, duration,
    } = payload;
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
