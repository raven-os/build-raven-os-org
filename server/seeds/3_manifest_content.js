const fs = require('fs')
const path = require('path')

function manifestContent (manifestID) {
  const date = new Date('2019-01-30T10:00:00')
  date.setMinutes(manifestID)

  return {
    id: manifestID,
    manifest_id: manifestID,
    content: `This is an example of content ${manifestID}`,
    edition_date: date
  }
}

function content (filepath) {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8')
}

exports.seed = (knex) => {
  // Deletes ALL existing entries and set auto-increment to 25
  return knex('manifest_content').del()
    .then(() => {
      return knex.raw('ALTER SEQUENCE manifest_content_id_seq RESTART WITH 25')
    })
    .then(() => {
      // Inserts seed entries
      return knex('manifest_content').insert([
        // Generate a manifest_content of each manifest
        ...[...Array(19).keys()].slice(1).map(manifestContent),
        // Fill real manifests
        {
          id: 19,
          manifest_id: 16, // zlib.py
          content: '# this is a comment #1\n' + content('./fixtures/zlib.py'),
          edition_date: new Date('2019-09-30T10:36:00')
        },
        {
          id: 20,
          manifest_id: 16, // zlib.py
          content: '# this is a comment #2\n' + content('./fixtures/zlib.py'),
          edition_date: new Date('2019-10-02T12:36:00')
        },
        {
          id: 21,
          manifest_id: 16, // zlib.py
          content: '# this is a comment #3\n' + content('./fixtures/zlib.py'),
          edition_date: new Date('2019-10-04T04:36:00')
        },
        {
          id: 22,
          manifest_id: 16, // zlib.py
          content: content('./fixtures/zlib.py'),
          edition_date: new Date('2019-10-20T20:36:00')
        },
        {
          id: 23,
          manifest_id: 17, // libtool.py
          content: content('./fixtures/libtool.py'),
          edition_date: new Date('2019-10-30T10:37:00')
        },
        {
          id: 24,
          manifest_id: 18, // readline.py
          content: content('./fixtures/readline.py'),
          edition_date: new Date('2019-11-30T10:38:00')
        }
      ])
    })
}
