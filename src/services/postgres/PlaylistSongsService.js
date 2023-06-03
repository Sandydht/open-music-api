const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const songsTransform = require('../../transformers/songs');

class PlaylistSongsService {
  constructor(playlistsService, collaborationsService) {
    this.pool = new Pool();
    this.playlistsService = playlistsService;
    this.collaborationsService = collaborationsService;
  }

  async addSongToPlaylist(playlistId, payload) {
    const { songId } = payload;
    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    return result.rows[0].id;
  }

  async getPlaylistSongsByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT * FROM songs INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const playlistSongs = await this.pool.query(query);
    const result = songsTransform.songList(playlistSongs.rows);
    return result;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Lagu gagal dihapus dari playlist');
  }

  async verifyPlaylistSongAccess(playlistId, userId) {
    await this.playlistsService.verifyPlaylistByOwner(playlistId, userId)
      .catch(async (error) => {
        if (error instanceof NotFoundError) {
          throw error;
        }

        await this.collaborationsService.verifyCollaborator(playlistId, userId)
          .catch((err) => {
            throw err;
          });
      });
  }
}

module.exports = PlaylistSongsService;
