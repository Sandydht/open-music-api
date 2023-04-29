const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('~/exceptions/InvariantError');
const NotFoundError = require('~/exceptions/NotFoundError');
const albumsTransform = require('~/transformers/albums');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = Math.floor(new Date().getTime() / 1000.0);
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums (id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) throw new InvariantError('Album gagal ditambahkan');

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Album tidak ditemukan');

    const album = result.rows.map(albumsTransform.albumDetail)[0];
    return album;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = Math.floor(new Date().getTime() / 1000.0);
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = AlbumsService;