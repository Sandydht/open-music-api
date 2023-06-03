const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const playlistSongActivitiesTransform = require('../../transformers/playlist-song-activities');

class PlaylistSongActivitiesService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylistSongActivity(playlistId, songId, userId, action, time) {
    const id = `playlist-song-activity-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, playlistId, songId, userId, action, time, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Gagal menambah aktivitas');
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: 'SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities INNER JOIN users ON playlist_song_activities.user_id = users.id INNER JOIN songs ON playlist_song_activities.song_id = songs.id WHERE playlist_song_activities.playlist_id = $1',
      values: [playlistId],
    };

    const playlistSongActivities = await this.pool.query(query);
    if (!playlistSongActivities.rowCount) throw new NotFoundError('Aktifitas tidak ditemukan');

    const result = playlistSongActivitiesTransform.activityList(playlistSongActivities.rows);
    return result;
  }
}

module.exports = PlaylistSongActivitiesService;
