const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const albumsTransform = require('../../transformers/albums');

class AlbumsService {
  constructor() {
    this.pool = new Pool();
  }

  async addAlbum(payload) {
    const { name, year } = payload;
    const id = nanoid(16);
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums (id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new InvariantError('Album gagal ditambahkan');
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const album = await this.pool.query(query);
    if (!album.rowCount) throw new NotFoundError('Album tidak ditemukan');

    const result = albumsTransform.showAlbum(album.rows[0]);
    return result;
  }

  async editAlbumById(id, payload) {
    const { name, year } = payload;
    const updatedAt = Math.floor(new Date().getTime() / 1000.0);
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }

  async updateAlbumCover(id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }
}

module.exports = AlbumsService;
