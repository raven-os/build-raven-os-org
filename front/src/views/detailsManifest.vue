<template>
  <div id="app">
    <b-container class="top-container">
      <b-row>
        <b-col>
          <div class="manifest-name">{{ name }}</div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mid-container">
      <b-table
        id="date-table"
        :items="dateProvider"
        :fields="dateFields"
        tbody-tr-class="table-row-nohover"
        thead-class="list-thead"
        responsive
      />
      <div class="manifest-space">
        <div class="manifest-thead">Manifest</div>
        <prism language="python">{{ manifestBody }}</prism>
      </div>
    </b-container>
  </div>
</template>

<script>
import Prism from 'vue-prism-component'

const manifest = `#!/usr/bin/env python3.6
# -*- coding: utf-8 -*-
"""
Build manifest for the GNU libc
"""

import os
from textwrap import dedent
from nbuild.cmd import cmd
from nbuild.log import ilog
from nbuild.pushd import pushd
from nbuild.pushenv import pushenv
from nbuild.stdenv.package import package, get_package
from nbuild.stdenv.fetch import fetch_urls
from nbuild.stdenv.install import install_file, make_keeper
from nbuild.stdenv.extract import extract_tarballs
from nbuild.stdenv.autotools import build_autotools_package
from nbuild.stdenv.autotools.make import do_make
from nbuild.stdenv.autotools.autoconf import do_configure


def install_libc():
    package = get_package()

    # Install most parts of glibc
    do_make(target='install')

    # Install nscd
    with pushd(package.source_dir):
        install_file('nscd/nscd.conf', '/etc/nscd.conf')
        install_file('nscd/nscd.tmpfiles', '/usr/lib/tmpfiles.d/nscd.conf')
        install_file('nscd/nscd.service', '/lib/systemd/system/nscd.service')
    make_keeper('/var/cache/nscd')

    # Install locales
    do_make(target='localedata/install-locales')

    # Setup a default /etc/nsswitch.conf
    with open(f'{package.install_dir}/etc/nsswitch.conf', 'w+') as ld_conf:
        content = """\
        #
        # Raven-OS - /etc/nsswitch.conf
        #

        passwd:         compat files
        group:          compat files
        shadow:         compat files

        hosts:          files dns
        networks:       files dns

        services:       db files
        protocols:      db files
        rpc:            db files
        ethers:         db files
        netmasks:       files
        netgroup:       files
        bootparams:     files

        automount:      files
        aliases:        files
        """
        ld_conf.write(dedent(content))

    # Setup a default /etc/ld.so.conf
    with open(f'{package.install_dir}/etc/ld.so.conf', 'w+') as ld_conf:
        content = """\
        #
        # Raven-OS - /etc/ld.so.conf
        #

        include /etc/ld.so.conf.d/*.conf
        /usr/local/lib
        /opt/lib
        """
        ld_conf.write(dedent(content))


@package(
    id="stable::sys-lib/libc#2.27.0",
    run_dependencies={
        "stable::kernel/linux-headers": "=4.15.3",
    },
)
def build_libc():
    package = get_package()
    version = package.version.split('.0')[0]

    os.environ['libc_cv_c_cleanup'] = 'yes'
    os.environ['libc_cv_forced_unwind'] = 'yes'
    os.environ['libc_cv_rootsbindir'] = '/sbin'
    os.environ['libc_cv_slibdir'] = '/lib64'

    build_autotools_package(
        fetch=lambda: fetch_urls([
            {
                'url': f"http://ftp.gnu.org/gnu/glibc/glibc-{version}.tar.xz",
                'md5': "898cd5656519ffbc3a03fe811dd89e82",
            },
            # Fixes some FHS compliency-issues.
            {
                'url': f"http://www.linuxfromscratch.org/patches/lfs/8.2/glibc-{version}-fhs-1.patch",
                'md5': "9a5997c3452909b1769918c759eff8a2",
            },
        ]),
        configure=lambda: do_configure(
            extra_configure_flags=[
                '--enable-kernel=3.2',
                '--with-headers=/usr/include',
            ]
        ),
        install=install_libc,
    )
`

export default {
  components: {
    Prism
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: '',
      created_at: '',
      updated_at: '',
      manifestBody: manifest,
      dateFields: [
        {
          key: 'created_at',
          label: 'Creation date',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: value => {
            if (value) {
              return moment(value).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        },
        {
          key: 'updated_at',
          label: 'Update date',
          class: 'td-date',
          tdClass: 'list-table-cell',
          formatter: value => {
            if (value) {
              return moment(value).format('MMMM Do YYYY, HH:mm:ss')
            } else {
              return ''
            }
          }
        }
      ]
    }
  },
  computed: {
    manifest () {
      return (this.build && this.build.manifest) || null
    }
  },
  created () {
    this.name = this.$route.params.name
    this.created_at = this.$route.params.created_at
    this.updated_at = this.$route.params.updated_at

    // WE NEED TO FETCH THE MANIFEST FROM THE DATABASE INSTEAD OF GETTING
    // ITS PARAMS FROM THE HOME VUE
  },
  mounted () {},
  methods: {
    dateProvider (ctx) {
      let items = []
      var newItem = {
        created_at: this.created_at,
        state: this.state,
        started_at: this.started_at,
        ended_at: this.ended_at
      }
      items.push(newItem)
      return items
    }
  }
}
</script>

<style scoped>
.top-container {
  margin-top: 150px;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 30px;
}

.mid-container {
  margin-top: 50px;
}

.manifest-name {
  text-align: center;
  font-size: 45px;
  color: var(--accent);
}

.manifest-space {
  border-bottom: 1px solid var(--accent);
}

.manifest-thead {
  background-color: rgba(52, 52, 50, 0.9);
  color: var(--primary) !important;
  font-weight: bold;
  padding: 14px;
  font-size: 16px;
}
</style>
