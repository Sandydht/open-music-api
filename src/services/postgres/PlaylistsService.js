const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const playlistTransform = require('../../transformers/playlists');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist(name) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums (id, name, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, createdAt, updatedAt],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) throw new InvariantError('Album gagal ditambahkan');
    return result.rows[0].id;
  }

  async getPlaylists() {
    const query = '';

    const result = await this.pool.query(query);
    return result.rows.map(playlistTransform.playlistList);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = PlaylistsService;
