const fs = require('fs')
const path = require('path')

function content (filepath) {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8')
}

const manifestContent = {
  manifest_id: [1],
  exit_status: null,
  stdout: '',
  stderr: '',
  creation_date: new Date('2019-01-30T10:00:00'),
  start_date: null,
  end_date: null,
  state: 'queuing',
  packages: []
}

const queued = { ...manifestContent }
const running = {
  ...queued,
  state: 'running',
  start_date: new Date('2019-01-30T10:02:00'),
  stdout: 'some output log\nanother output log',
  stderr: 'some error log'
}
const failed = {
  ...running,
  state: 'finished',
  end_date: new Date('2019-01-30T10:10:00'),
  exit_status: 42,
  stderr: 'some error log\nan error occured'
}
const success = {
  ...failed,
  exit_status: 0,
  stderr: '',
  stdout: 'some output log\nCompilation succeeded',
  packages: ['https://beta.raven-os.org/']
}

function dates (date, state) {
  const creation = new Date(date)
  const start = new Date(date)
  const end = new Date(date)

  start.setMinutes(start.getMinutes() + 2)
  end.setMinutes(end.getMinutes() + 5)

  return {
    creation_date: creation,
    start_date: state !== 'queuing' ? start : null,
    end_date: state === 'finished' ? end : null
  }
}

exports.seed = (knex) => {
  // Deletes ALL existing entries and reset auto-increment
  return knex.raw('TRUNCATE TABLE build RESTART IDENTITY CASCADE')
    .then(() => {
      // Inserts seed entries
      return knex('build').insert([
        // Add example of each states
        { ...queued, manifest_id: [1], ...dates('2019-01-30T10:00:00', 'queuing') },
        { ...running, manifest_id: [1], ...dates('2019-01-30T11:00:00', 'running') },
        { ...failed, manifest_id: [1], ...dates('2019-01-30T12:00:00', 'finished') },
        { ...success, manifest_id: [1], ...dates('2019-01-30T13:00:00', 'finished') },
        { ...success, manifest_id: [1, 2], ...dates('2019-01-30T14:00:00', 'finished') },

        // Alternate success and failed
        ...[...Array(30).keys()].map(i => {
          const base = i % 2 ? success : failed
          const date = new Date('2019-09-01T15:00:00')
          date.setDate(date.getDate() + i)

          return {
            ...base,
            manifest_id: [5],
            ...dates(date, 'finished')
          }
        }),

        // Add only failed
        ...[...Array(30).keys()].map(i => {
          const date = new Date('2019-10-01T16:00:00')
          date.setDate(date.getDate() + i)

          return {
            ...failed,
            manifest_id: [7],
            ...dates(date, 'finished')
          }
        }),

        // Add only success
        ...[...Array(30).keys()].map(i => {
          const date = new Date('2019-11-01T22:00:00')
          date.setDate(date.getDate() + i)

          return {
            ...success,
            manifest_id: [14],
            ...dates(date, 'finished')
          }
        }),

        // Add zlib compilation failing
        {
          ...failed,
          manifest_id: [16],
          creation_date: new Date('2019-12-01T05:00:00'),
          start_date: new Date('2019-12-01T05:00:25'),
          end_date: new Date('2019-12-01T05:00:30'),
          stdout: '',
          stderr: content('./fixtures/zlib.err'),
          exit_status: 1,
          packages: []
        },

        // Add zlib compilation success
        {
          ...success,
          manifest_id: [16],
          creation_date: new Date('2019-12-01T14:00:00'),
          start_date: new Date('2019-12-01T14:01:00'),
          end_date: new Date('2019-12-01T14:03:00'),
          stdout: content('./fixtures/zlib.log'),
          packages: [
            'https://beta.raven-os.org/p/sys-libs/zlib',
            'https://beta.raven-os.org/p/sys-libs/zlib-dev'
          ]
        },

        // Add libtool compilation
        {
          ...success,
          manifest_id: [17],
          creation_date: new Date('2019-12-02T19:30:00'),
          start_date: new Date('2019-12-02T19:35:00'),
          end_date: new Date('2019-12-02T19:59:59'),
          stdout: content('./fixtures/libtool.log'),
          packages: [
            'https://beta.raven-os.org/p/sys-libs/libtool',
            'https://beta.raven-os.org/p/sys-libs/libtool-dev',
            'https://beta.raven-os.org/p/sys-libs/libtool-doc'
          ]
        },

        // Add readline compilation
        {
          ...success,
          manifest_id: [18],
          creation_date: new Date('2019-12-03T08:45:00'),
          start_date: new Date('2019-12-03T08:45:30'),
          end_date: new Date('2019-12-03T08:50:00'),
          stdout: content('./fixtures/readline.log'),
          stderr: content('./fixtures/readline.err'),
          packages: [
            'https://beta.raven-os.org/p/sys-libs/readline',
            'https://beta.raven-os.org/p/sys-libs/readline-dev',
            'https://beta.raven-os.org/p/sys-libs/readline-doc'
          ]
        }
      ])
    })
}
