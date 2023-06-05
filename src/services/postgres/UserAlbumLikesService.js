const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
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

    await this.cacheService.delete(`user-album-like:${albumId}`);
    return result.rows[0].id;
  }

  async getUserAlbumLike(albumId) {
    try {
      const result = await this.cacheService.get(`user-album-like:${albumId}`);
      return {
        source: 'cache',
        likes: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this.pool.query(query);
      await this.cacheService.set(`user-album-like:${albumId}`, JSON.stringify(result.rowCount));
      return {
        source: 'database',
        likes: result.rowCount,
      };
    }
  }

  async deleteUserAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Batal suka album gagal. Id tidak ditemukan');
    await this.cacheService.delete(`user-album-like:${albumId}`);
  }

  async verifyUserAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this.pool.query(query);
    if (result.rowCount) throw new InvariantError('Gagal menyukai album. Anda sudah menyukainya');
  }
}

module.exports = UserAlbumLikesService;
