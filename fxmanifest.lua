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
    'init/client/init.lua',
    "modules/**/client/**/*"
}
server_scripts {
    'init/server/init.lua',
    "modules/**/server/**/*"
}

files {
    'web/build/index.html',
    'web/build/**/*',
    -- for ox_lib we need to provide the config file as files to require them!
    'modules/items/config_items.lua',
    'modules/jobs/config_jobs.lua',
    'modules/vehicles/config_vehicles.lua',
}
