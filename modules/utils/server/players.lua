local QBCore = exports['qb-core']:GetCoreObject()

RegisterCallback = function(name, fn)
    QBCore.Functions.CreateCallback(name, fn)
end

RegisterCallback('roots-search:server:getPlayers', function(source, cb)
    print('roots-search:server:getPlayers triggered, returning all online players')
    -- TODO build players ID, Firstname, Lastname
    local players = GetQBPlayers()
    cb(players)
end)

function GetQBPlayers()
    local playerReturn = {}
    local players = QBCore.Functions.GetQBPlayers()

    for id, player in pairs(players) do
        local playerPed = GetPlayerPed(id)
        local name = (player.PlayerData.charinfo.firstname or '') .. ' ' .. (player.PlayerData.charinfo.lastname or '')
        playerReturn[#playerReturn + 1] = {
            name = name .. ' | (' .. (player.PlayerData.name or '') .. ')',
            id = id,
            coords = GetEntityCoords(playerPed),
            cid = name,
            citizenid = player.PlayerData.citizenid,
            sources = playerPed,
            sourceplayer = id
        }
    end
    return playerReturn
end

function GetPlayerAccountName(playerId)
    local player = QBCore.Functions.GetPlayer(playerId)
    if player then
        -- Angenommen, der Accountname ist der Spielername, den du abrufen möchtest
        local accountName = player.PlayerData.name
        return accountName
    else
        print("Spieler nicht gefunden")
        return nil
    end
end

--[[RegisterCallback('roots-search:server:getPlayerData', function(source, cb)
    local src = source
    local PlayerIdentifier = GetPlayerIdentifier(src)
    -- TODO CHECK THE PLAYER DATA
    MySQL.query(
            'SELECT firstname, lastname, dateofbirth FROM users WHERE identifier = @identifier', {
                ['@identifier'] = PlayerIdentifier
            }, function(result)
                cb({
                    firstname = result[1].firstname,
                    lastname = result[1].lastname,
                    dateofbirth = result[1].dateofbirth,
                    dateformat = Config.BirthdateFormat,
                })
            end)
end)]]