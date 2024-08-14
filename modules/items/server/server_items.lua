local RegisterCallback
local RegisterItem
local QBCore = exports['qb-core']:GetCoreObject()
local RCore = exports['roots-core']:GetCoreObject()
--local config = require('server.config_items')
local config = require('modules.items.config_items')
if config then
    print('Config geladen!!')
end
local CurrentFramework

if GetResourceState("qb-core") == "started" then
    CurrentFramework = "qb"
else
    print("^8ERROR: ^3This script only supports QBCore frameworks, but non of these are present. Unfortunatelly, you cannot use this script.^7")
    return
end

RegisterCallback = function(name, fn)
    QBCore.Functions.CreateCallback(name, fn)
end
RegisterItem = function(itemName, fn)
    QBCore.Functions.CreateUseableItem(itemName, fn)
end

RegisterCallback('roots-search:server:getItems', function(source, cb)
    if config.debugMode then
        print('Callback roots-search:server:getItems triggered')
    end
    RCore.Functions.Items.fetchAllItems(function(items)
        local itemCount = 0
        if items ~= nil then
            -- Debugging: Ausgabe der Anzahl der Items
            itemCount = getItemCount(items)
        end
        if itemCount > 0 then
            local mappedResult = {}
            for k, v in pairs(items) do
                local thisData = v
                thisData.id = v.name
                thisData.created = v.created
                table.insert(mappedResult, thisData)

                -- Debugging: Ausgabe der einzelnen Items
                --print('Item added:', json.encode(thisData))
            end
            cb(mappedResult)
        else
            print('No items found')
            cb({})
        end
    end)
end)

RegisterCallback('roots-search:server:createItem', function(source, cb, data)
    local src = source
    local PlayerJobName = GetPlayerJobName(src)
    if config.debugMode then
        print('roots-search:server:createItem')
        print(json.encode(data))
    end
    local item = json.decode(data)
    local itemName
    if item and item.name then
        itemName = item.name
    end
    local itemData = item

    RCore.Functions.Items.addItem(itemName, itemData, function(success)
        if success then
            print('Items erfolgreich angelegt!')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:editItem', function(source, cb, data)
    if config.debugMode then
        print('roots-search:server:editItem')
        print(json.encode(data))
    end
    local item = json.decode(data)
    local itemName
    if item and item.name then
        itemName = item.name
    end
    local itemData = item

    RCore.Functions.Items.updateItem(itemName, itemData, function(success)
        if success then
            print('Items erfolgreich aktualisiert!')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:deleteItem', function(source, cb, data)
    local itemName = data
    RCore.Functions.Items.removeItem(itemName, function(success)
        if success then
            print('Item wurde erfolgreich gelöscht')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:getPlayers', function(source, cb)
    print('roots-search:server:getPlayers triggered, returning all online players')
    -- TODO build players ID, Firstname, Lastname
    local players = GetQBPlayers()
    cb(players)
end)

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

RegisterServerEvent('roots-search:server:giveItemYourself')
AddEventHandler('roots-search:server:giveItemYourself', function(data)
    local playerId = source
    local amount = data.quantity
    local itemData = QBCore.Shared.Items[data.itemName]

    if config.debugMode then
        print('roots-search:server:giveItemYourself triggered')
        print('Data: ', json.encode(data))
        print('ID: ', playerId)
        print('Amount:', amount)
        print('AddItem:', json.encode(itemData))
    end

    local player = QBCore.Functions.GetPlayer(playerId)
    if itemData then
        -- check iteminfo
        local info = prepareItemInfo(player, itemData)

        local itemAdded = exports['qb-inventory']:AddItem(playerId, itemData['name'], amount, false, info, 'Roots Search')
        if itemAdded then
            local msg = string.format('Du hast dir %dx %s gegeben', amount, itemData['label'])
            QBCore.Functions.Notify(source, msg, 'success', 3500)
            TriggerClientEvent('qb-inventory:client:ItemBox', playerId, itemData, 'add', amount)
            if Player(playerId).state.inv_busy then
                TriggerClientEvent('qb-inventory:client:updateInventory', playerId)
            end
        else
            local msg = string.format('%d x %s konnten nicht ins Inventar gelegt werden!', amount, itemData['name'])
            QBCore.Functions.Notify(source, msg, 'error', 3500)
        end
    else
        local msg = string.format('Fehler in ItemData! %s Object leer. Kontaktiere ein Developer', data.itemName)
        QBCore.Functions.Notify(source, msg, 'error')
        QBCore.Functions.Notify(source, 'Warte bis zum nächsten Restart!', 'error', 3500)
        QBCore.Functions.Notify(source, msg, 'Dann sollte es da sein! ;-)', 3500)
    end

    --[[TriggerClientEvent("roots-search:client:client:itemGiven", src, data.name)]]
end)

RegisterServerEvent('roots-search:server:giveItem')
AddEventHandler('roots-search:server:giveItem', function(data)
    local playerId = source
    local targetPlayerId = data.targetPlayerId
    local targetPlayerName = data.targetPlayerName
    local amount = data.quantity
    local itemData = QBCore.Shared.Items[data.itemName]

    if config.debugMode then
        print('roots-search:server:giveItem to Player triggered')
        print('Data: ', json.encode(data))
        print('ID: ', playerId)
        print('Amount:', amount)
        print('AddItem:', json.encode(itemData))
    end

    local targetPlayer = QBCore.Functions.GetPlayer(targetPlayerId)
    if itemData then
        -- check iteminfo
        local info = prepareItemInfo(targetPlayerId, itemData)
        local itemAdded = exports['qb-inventory']:AddItem(targetPlayerId, itemData['name'], amount, false, info, 'give item command')
        if itemAdded then
            local msg = string.format('Du hast %s %dx %s gegeben', targetPlayerName, amount, itemData['label'])
            QBCore.Functions.Notify(source, msg, 'success', 3500)
            TriggerClientEvent('qb-inventory:client:ItemBox', playerId, itemData, 'add', amount)
            if Player(playerId).state.inv_busy then
                TriggerClientEvent('qb-inventory:client:updateInventory', playerId)
            end
            TriggerClientEvent("roots-search:client:itemGiven", playerId, itemName)
            TriggerClientEvent("roots-search:client:itemReceived", targetPlayerId, itemName)
        else
            local msg = string.format('%d x %s konnten nicht ins Inventar gelegt werden!', amount, itemData['name'])
            QBCore.Functions.Notify(source, msg, 'error', 3500)
        end
    else
        local msg = string.format('Fehler in ItemData! %s Object leer. Kontaktiere ein Developer', itemName)
        QBCore.Functions.Notify(source, msg, 'error')
    end
end)

function GetPlayer(src)
    return QBCore.Functions.GetPlayer(src)
end

function GetPlayerIdentifier(src)
    return QBCore.Functions.GetPlayer(src).PlayerData.citizenid
end

function GetPlayerJobName(src)
    return QBCore.Functions.GetPlayer(src).PlayerData.job.name
end

-- Funktion zum Zählen der Anzahl der Items
function getItemCount(items)
    local itemCount = 0
    if items == nil then
        return itemCount
    end
    for _ in pairs(items) do
        itemCount = itemCount + 1
    end
    return itemCount
end

-- Summarize all Online Players

function GetQBPlayers()
    print('GetQBPlayers triggered')
    local playerReturn = {}
    local players = QBCore.Functions.GetQBPlayers()

    for id, player in pairs(players) do
        local name = (player.PlayerData.charinfo.firstname or '') .. ' ' .. (player.PlayerData.charinfo.lastname or '')
        playerReturn[#playerReturn + 1] = {
            id = id,
            name = name .. ' | (' .. (player.PlayerData.name or '') .. ')',
            cid = name,
            citizenid = player.PlayerData.citizenid,
        }
        print(json.encode(playerReturn[#playerReturn]))
    end
    return playerReturn
end

function prepareItemInfo(player, itemData)
    if itemData then
        -- check iteminfo
        local itemInfo = {}
        if itemData['name'] == 'id_card' then
            itemInfo.citizenid = player.PlayerData.citizenid
            itemInfo.firstname = player.PlayerData.charinfo.firstname
            itemInfo.lastname = player.PlayerData.charinfo.lastname
            itemInfo.birthdate = player.PlayerData.charinfo.birthdate
            itemInfo.gender = player.PlayerData.charinfo.gender
            itemInfo.nationality = player.PlayerData.charinfo.nationality
        elseif itemData['name'] == 'driver_license' then
            itemInfo.firstname = player.PlayerData.charinfo.firstname
            itemInfo.lastname = player.PlayerData.charinfo.lastname
            itemInfo.birthdate = player.PlayerData.charinfo.birthdate
            itemInfo.type = 'Class C Driver License'
        elseif itemData['type'] == 'weapon' then
            amount = 1
            itemInfo.serie = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
            itemInfo.quality = 100
        elseif itemData['name'] == 'harness' then
            itemInfo.uses = 20
        elseif itemData['name'] == 'markedbills' then
            itemInfo.worth = math.random(5000, 10000)
        end

        -- need to update the info that the player gets the right information about this changed item
        --itemInfo.description = itemData.description

        --[[itemInfo.label = itemData.label
        itemInfo.weight = itemData.weight
        itemInfo.type = itemData.type
        itemInfo.unique = itemData.unique
        itemInfo.useable = itemData.useable
        itemInfo.image = itemData.image
        itemInfo.shouldClose = itemData.should
        itemInfo.combinable = itemData.combinable]]

        return itemInfo
    end
end