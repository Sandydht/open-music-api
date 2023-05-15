const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan');

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT pl.id, pl.name, users.username FROM playlists pl INNER JOIN users ON pl.owner = users.id WHERE pl.owner = $1',
      values: [owner],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async addSongToPlaylists({ playlistId, songId }) {
    const id = `playlist-songs-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].id) throw new InvariantError('Song gagal ditambahkan ke playlist');
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

  async verifySongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Song tidak ditemukan');
  }
}

module.exports = PlaylistsService;
