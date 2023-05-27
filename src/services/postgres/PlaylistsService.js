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
    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan');
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

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async addSongToPlaylists(playlistId, songId) {
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

  async getPlaylistByIdWithSongs(id) {
    const playlistsQuery = {
      text: 'SELECT * FROM users INNER JOIN playlists on users.id = playlists.owner WHERE playlists.id = $1',
      values: [id],
    };

    const plylistSongsQuery = {
      text: 'SELECT * FROM playlist_songs INNER JOIN songs on playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [id],
    };

    const [playlists, playlistSongs] = await Promise.all([
      this.pool.query(playlistsQuery),
      this.pool.query(plylistSongsQuery),
    ]);
    if (!playlists.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    playlists.rows[0].songs = playlistSongs.rows;
    const result = playlistsTransform.showPlaylistWithSongs(playlists.rows[0]);
    return result;
  }

  async deletePlaylistSong(songId) {
    const playlistSongsQuery = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING song_id',
      values: [songId],
    };

    const songsQuery = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const [playlistSongs, songs] = await Promise.all([
      this.pool.query(playlistSongsQuery),
      this.pool.query(songsQuery),
    ]);

    if (!playlistSongs.rows[0].song_id) throw new NotFoundError('Playlist song gagal dihapus. Song id tidak ditemukan');
    if (!songs.rows[0].id) throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
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
