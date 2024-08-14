fx_version "cerulean"

description "A better admin management script"
author "Pulsartorte"
version '1.0.0'

repository 'https://github.com/'

lua54 'yes'

games {
    "gta5",
}

dependencies {
    'ox_lib'
}

ui_page 'web/build/index.html'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
}

client_scripts {
    "modules/**/client/**/*"
}
server_scripts {
    'init.lua',
    "modules/**/server/**/*"
}

files {
    'web/build/index.html',
    'web/build/**/*'
}
