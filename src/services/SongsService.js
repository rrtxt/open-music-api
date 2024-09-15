const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { query_timeout } = require("pg/lib/defaults");

class SongsService {
  constructor() {
    this._pool = new Pool()
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16)
    console.log(this._pool)
    const query = {
      text: 'INSERT INTO songs values($1, $2, $3, $4, $5, $6, $7) returning id',
      values: [id, title, year, genre, performer, duration, albumId]
    }

    const result = await this._pool.query(query)
    console.log(result)
    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getSongs({ albumId, title, performer }) {
    let queryText = 'SELECT * FROM songs WHERE 1=1'
    const queryValues = []
    if (albumId) {
      queryValues.push(albumId)
      queryText += ` AND "albumId" = $${queryValues.length}`
    }
    if (title) {
      queryValues.push(`%${title}%`)
      queryText += ` AND title ILIKE $${queryValues.length}`
    }
    if (performer) {
      queryValues.push(`%${performer}%`)
      queryText += ` AND performer  ILIKE $${queryValues.length}`
    }
    const query = {
      text: queryText,
      values: queryValues
    }

    console.log(queryText, queryValues)
    const result = await this._pool.query(query)
    return result.rows
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    console.log(`Result untuk id ${id} adalah ${JSON.stringify(result.rows)}`);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan')
    }

    return result.rows[0]
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 returning id',
      values: [title, year, genre, performer, duration, albumId, id]
    }
    console.log(query)
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan')
    }

    return result.rows
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 returning id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Songs gagal dihapus. Id tidak ditemukan')
    }

    return result.rows
  }
}

module.exports = { SongsService }
