const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const playlistsTransform = require('../../transformers/playlists');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist(payload, owner) {
    const { name } = payload;
    const id = `playlist-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Playlist gagal ditambahkan');
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT * FROM users INNER JOIN playlists ON users.id = playlists.owner WHERE playlists.owner = $1',
      values: [owner],
    };

    const playlists = await this.pool.query(query);
    const result = playlistsTransform.playlistList(playlists.rows);
    return result;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT * FROM users INNER JOIN playlists ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [id],
    };

    const playlist = await this.pool.query(query);
    if (!playlist.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const result = playlistsTransform.showPlaylist(playlist.rows[0]);
    return result;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async verifyPlaylistByOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const playlist = result.rows[0];
    if (playlist.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

module.exports = PlaylistsService;
