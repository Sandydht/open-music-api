const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor() {
    this.pool = new Pool();
  }

  async addUserAlbumLike(albumId, userId) {
    const id = `user-album-likes-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO user_album_likes (id, album_id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, albumId, userId, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Gagal menyukai album');
    return result.rows[0].id;
  }

  async getUserAlbumLike(albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this.pool.query(query);
    return result.rowCount;
  }

  async deleteUserAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Gagal membatalkan like album. Id tidak ditemukan');
  }

  async verifyUserAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this.pool.query(query);
    if (result.rowCount) throw new InvariantError('Gagal menyukai album');
  }
}

module.exports = UserAlbumLikesService;
