#!/usr/bin/env python3.6
# -*- coding: utf-8 -*-

import stdlib
from stdlib.template import autotools
from stdlib.manifest import manifest


@manifest(
    name='libtool',
    category='sys-libs',
    description='''
    A generic library to hide the complexity of using shared libraries behind a consistent, portable interface.
    ''',
    tags=['gnu', 'tools', 'shared', 'library'],
    maintainer='grange_c@raven-os.org',
    licenses=[stdlib.license.License.GPL],
    upstream_url='https://www.gnu.org/software/libtool/',
    kind=stdlib.kind.Kind.EFFECTIVE,
    versions_data=[
        {
            'semver': '2.4.6',
            'fetch': [{
                    'url': 'https://ftp.nluug.nl/pub/gnu/libtool/libtool-2.4.6.tar.xz',
                    'sha256': '7c87a8c2c8c0fc9cd5019e402bed4292462d00a718a7cd5f11218153bf28b26f',
                },
            ],
        },
    ],
)
def build(build):

    packages = autotools.build()

    packages['sys-libs/libtool'].drain(
        'usr/share/libtool/',
    )

    # Packages member of `raven-os/essentials` should explicitly state all
    # of their dependencies, including indirect ones.
    packages['sys-libs/libtool'].requires('raven-os/corefs')

    return packages
