local RegisterCallback
local RegisterVehicle
local QBCore = exports['qb-core']:GetCoreObject()
local RCore = exports['roots-core']:GetCoreObject()
--local config = require('server.config_vehicles')
local config = require('modules.vehicles.config_vehicles')
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
RegisterVehicle = function(vehicleName, fn)
    QBCore.Functions.CreateUseableVehicle(vehicleName, fn)
end

RegisterCallback('roots-search:server:getVehicles', function(source, cb)
    if config.debugMode then
        print('Callback roots-search:server:getVehicles triggered')
    end
    RCore.Functions.Vehicles.fetchAllVehicles(function(vehicles)
        local vehicleCount = 0
        if vehicles ~= nil then
            -- Debugging: Ausgabe der Anzahl der Vehicles
            vehicleCount = getVehicleCount(vehicles)
        end
        if vehicleCount > 0 then
            local mappedResult = {}
            for k, v in pairs(vehicles) do
                local thisData = v
                thisData.id = v.name
                thisData.created = v.created
                table.insert(mappedResult, thisData)

                -- Debugging: Ausgabe der einzelnen Vehicles
                --print('Vehicle added:', json.encode(thisData))
            end
            cb(mappedResult)
        else
            print('No vehicles found')
            cb({})
        end
    end)
end)

RegisterCallback('roots-search:server:createVehicle', function(source, cb, data)
    local src = source
    local PlayerVehicleName = GetPlayerVehicleName(src)
    if config.debugMode then
        print('roots-search:server:createVehicle')
        print(json.encode(data))
    end
    local vehicle = json.decode(data)
    local vehicleName
    if vehicle and vehicle.name then
        vehicleName = vehicle.name
    end
    local vehicleData = vehicle

    RCore.Functions.Vehicles.addVehicle(vehicleName, vehicleData, function(success)
        if success then
            print('Vehicles erfolgreich angelegt!')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:editVehicle', function(source, cb, data)
    if config.debugMode then
        print('roots-search:server:editVehicle')
        print(json.encode(data))
    end
    local vehicle = json.decode(data)
    local vehicleName
    if vehicle and vehicle.name then
        vehicleName = vehicle.name
    end
    local vehicleData = vehicle

    RCore.Functions.Vehicles.updateVehicle(vehicleName, vehicleData, function(success)
        if success then
            print('Vehicles erfolgreich aktualisiert!')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:deleteVehicle', function(source, cb, data)
    local vehicleName = data
    RCore.Functions.Vehicles.removeVehicle(vehicleName, function(success)
        if success then
            print('Vehicle wurde erfolgreich gelöscht')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterServerEvent('roots-search:server:giveVehicleYourself')
AddEventHandler('roots-search:server:giveVehicleYourself', function(data)
    local playerId = source
    local amount = data.quantity
    local vehicleData = QBCore.Shared.Vehicles[data.vehicleName]

    if config.debugMode then
        print('roots-search:server:giveVehicleYourself triggered')
        print('Data: ', json.encode(data))
        print('ID: ', playerId)
        print('Amount:', amount)
        print('AddVehicle:', json.encode(vehicleData))
    end

    local player = QBCore.Functions.GetPlayer(playerId)
    if vehicleData then
        -- check vehicleinfo
        local info = prepareVehicleInfo(player, vehicleData)

        local vehicleAdded = exports['qb-inventory']:AddVehicle(playerId, vehicleData['name'], amount, false, info, 'Roots Search')
        if vehicleAdded then
            local msg = string.format('Du hast dir %dx %s gegeben', amount, vehicleData['label'])
            QBCore.Functions.Notify(source, msg, 'success', 3500)
            TriggerClientEvent('qb-inventory:client:VehicleBox', playerId, vehicleData, 'add', amount)
            if Player(playerId).state.inv_busy then
                TriggerClientEvent('qb-inventory:client:updateInventory', playerId)
            end
        else
            local msg = string.format('%d x %s konnten nicht ins Inventar gelegt werden!', amount, vehicleData['name'])
            QBCore.Functions.Notify(source, msg, 'error', 3500)
        end
    else
        local msg = string.format('Fehler in VehicleData! %s Object leer. Kontaktiere ein Developer', data.vehicleName)
        QBCore.Functions.Notify(source, msg, 'error')
        QBCore.Functions.Notify(source, 'Warte bis zum nächsten Restart!', 'error', 3500)
        QBCore.Functions.Notify(source, msg, 'Dann sollte es da sein! ;-)', 3500)
    end

    --[[TriggerClientEvent("roots-search:client:client:vehicleGiven", src, data.name)]]
end)

RegisterServerEvent('roots-search:server:giveVehicle')
AddEventHandler('roots-search:server:giveVehicle', function(data)
    local playerId = source
    local targetPlayerId = data.targetPlayerId
    local targetPlayerName = data.targetPlayerName
    local amount = data.quantity
    local vehicleData = QBCore.Shared.Vehicles[data.vehicleName]

    if config.debugMode then
        print('roots-search:server:giveVehicle to Player triggered')
        print('Data: ', json.encode(data))
        print('ID: ', playerId)
        print('Amount:', amount)
        print('AddVehicle:', json.encode(vehicleData))
    end

    local targetPlayer = QBCore.Functions.GetPlayer(targetPlayerId)
    if vehicleData then
        -- check vehicleinfo
        local info = prepareVehicleInfo(targetPlayerId, vehicleData)
        local vehicleAdded = exports['qb-inventory']:AddVehicle(targetPlayerId, vehicleData['name'], amount, false, info, 'give vehicle command')
        if vehicleAdded then
            local msg = string.format('Du hast %s %dx %s gegeben', targetPlayerName, amount, vehicleData['label'])
            QBCore.Functions.Notify(source, msg, 'success', 3500)
            TriggerClientEvent('qb-inventory:client:VehicleBox', playerId, vehicleData, 'add', amount)
            if Player(playerId).state.inv_busy then
                TriggerClientEvent('qb-inventory:client:updateInventory', playerId)
            end
            TriggerClientEvent("roots-search:client:vehicleGiven", playerId, vehicleName)
            TriggerClientEvent("roots-search:client:vehicleReceived", targetPlayerId, vehicleName)
        else
            local msg = string.format('%d x %s konnten nicht ins Inventar gelegt werden!', amount, vehicleData['name'])
            QBCore.Functions.Notify(source, msg, 'error', 3500)
        end
    else
        local msg = string.format('Fehler in VehicleData! %s Object leer. Kontaktiere ein Developer', vehicleName)
        QBCore.Functions.Notify(source, msg, 'error')
    end
end)

function GetPlayer(src)
    return QBCore.Functions.GetPlayer(src)
end

function GetPlayerIdentifier(src)
    return QBCore.Functions.GetPlayer(src).PlayerData.citizenid
end

function GetPlayerVehicleName(src)
    return QBCore.Functions.GetPlayer(src).PlayerData.vehicle.name
end

-- Funktion zum Zählen der Anzahl der Vehicles
function getVehicleCount(vehicles)
    local vehicleCount = 0
    if vehicles == nil then
        return vehicleCount
    end
    for _ in pairs(vehicles) do
        vehicleCount = vehicleCount + 1
    end
    return vehicleCount
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

function prepareVehicleInfo(player, vehicleData)
    if vehicleData then
        -- check vehicleinfo
        local vehicleInfo = {}
        if vehicleData['name'] == 'id_card' then
            vehicleInfo.citizenid = player.PlayerData.citizenid
            vehicleInfo.firstname = player.PlayerData.charinfo.firstname
            vehicleInfo.lastname = player.PlayerData.charinfo.lastname
            vehicleInfo.birthdate = player.PlayerData.charinfo.birthdate
            vehicleInfo.gender = player.PlayerData.charinfo.gender
            vehicleInfo.nationality = player.PlayerData.charinfo.nationality
        elseif vehicleData['name'] == 'driver_license' then
            vehicleInfo.firstname = player.PlayerData.charinfo.firstname
            vehicleInfo.lastname = player.PlayerData.charinfo.lastname
            vehicleInfo.birthdate = player.PlayerData.charinfo.birthdate
            vehicleInfo.type = 'Class C Driver License'
        elseif vehicleData['type'] == 'weapon' then
            amount = 1
            vehicleInfo.serie = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
            vehicleInfo.quality = 100
        elseif vehicleData['name'] == 'harness' then
            vehicleInfo.uses = 20
        elseif vehicleData['name'] == 'markedbills' then
            vehicleInfo.worth = math.random(5000, 10000)
        end

        -- need to update the info that the player gets the right information about this changed vehicle
        --vehicleInfo.description = vehicleData.description

        --[[vehicleInfo.label = vehicleData.label
        vehicleInfo.weight = vehicleData.weight
        vehicleInfo.type = vehicleData.type
        vehicleInfo.unique = vehicleData.unique
        vehicleInfo.useable = vehicleData.useable
        vehicleInfo.image = vehicleData.image
        vehicleInfo.shouldClose = vehicleData.should
        vehicleInfo.combinable = vehicleData.combinable]]

        return vehicleInfo
    end
end