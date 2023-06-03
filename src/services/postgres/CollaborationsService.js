const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this.pool = new Pool();
  }

  async addCollaborator(payload) {
    const { playlistId, userId } = payload;
    const id = `collaboration-${nanoid(16)}`;
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, userId, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Kolaborator gagal ditambahkan');
    return result.rows[0].id;
  }

  async deleteCollaborator(payload) {
    const { playlistId, userId } = payload;
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Kolaborator gagal dihapus');
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new AuthorizationError('Kolaborator gagal diverifikasi');
  }
}

module.exports = CollaborationsService;
