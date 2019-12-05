function manifest (num, author) {
  const date = new Date('2019-01-30T10:00:00')
  date.setMinutes(num)

  return {
    id: num,
    name: `example_${num}.py`,
    creation_date: date,
    last_update: date,
    author,
    maintainer: author
  }
}

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('manifest').del()
    .then(() => {
      // Inserts seed entries
      return knex('manifest').insert([
        ...[1, 2, 3, 4, 5].map(i => manifest(i, 5)), // Tony Stark
        ...[6, 7, 8, 9, 10].map(i => manifest(i, 4)), // Jean Neige
        ...[11, 12, 13, 14, 15].map(i => manifest(i, 3)), // John Doe
        {
          ...manifest(16, 2), // Test Build
          name: 'zlib.py',
          creation_date: new Date('2019-09-30T10:36:00'),
          last_update: new Date('2019-10-20T20:36:00')
        },
        {
          ...manifest(17, 2),
          name: 'libtool.py',
          creation_date: new Date('2019-10-30T10:36:00'),
          last_update: new Date('2019-10-30T10:37:00')
        },
        {
          ...manifest(18, 2),
          name: 'readline.py',
          creation_date: new Date('2019-11-30T10:36:00'),
          last_update: new Date('2019-11-30T10:38:00')
        }
      ])
    })
}
