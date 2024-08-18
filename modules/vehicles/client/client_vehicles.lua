local QBCore = exports['qb-core']:GetCoreObject()
local config = require('modules.vehicles.config_vehicles')

local TriggerCallback
local Notification

TriggerCallback = function(name, cb, ...)
    QBCore.Functions.TriggerCallback(name, cb, ...)
end

Notification = function(msg)
    QBCore.Functions.Notify(msg)
end


-- Server-side callback registration
RegisterNUICallback('getVehicles', function(data, cb)
    if config.debugMode then
        print('NUICallback getVehicles triggered')
    end

    -- Trigger the QBCore callback to get vehicles
    TriggerCallback('roots-search:server:getVehicles', function(result)
        if config.debugMode then
            print('roots-search:server:getVehicles callback triggered')
            -- Print the result for debugging
            print('Result:', json.encode(result)) -- Prints the result in JSON format
        end
        cb(result)
    end)
end)


RegisterNUICallback('createVehicle', function(data, cb)
    if config.debugMode then
        print('NUICallback createVehicle triggered')
    end
    TriggerCallback('roots-search:server:createVehicle', function(result)
        local createdVehicle = json.decode(data)
        if config.debugMode then
            print('roots-search:server:createVehicle callback triggered')
            print('data: ', data)
        end
        QBCore.Functions.Notify(('Vehicle %s wurde erfolgreich angelegt!'):format(createdVehicle.label), 'success', 3500)
        cb(result)
    end,
            data)
end)

RegisterNUICallback('editVehicle', function(data, cb)
    if config.debugMode then
        print('NUICallback editVehicle triggered')
    end
    TriggerCallback('roots-search:server:editVehicle', function(result)
        local editVehicle = json.decode(data)
        if config.debugMode then
            print('roots-search:server:editVehicle callback triggered')
            print('data:', data)
        end
        QBCore.Functions.Notify(('Vehicle %s wurde erfolgreich aktualisiert!'):format(editVehicle.label), 'success', 3500)
        cb(result)
    end,
            data)
end)

RegisterNUICallback('deleteVehicle', function(data, cb)
    if config.debugMode then
        print('NUICallback deleteVehicle triggered')
    end
    TriggerCallback('roots-search:server:deleteVehicle', function(result)
        if config.debugMode then
            print('roots-search:server:deleteVehicle callback triggered')
        end
        cb(result)
    end,
            data)
end)

RegisterNUICallback('giveVehicleYourself', function(data, cb)
    if config.debugMode then
        print('giveVehicleYourself triggered')
    end
    TriggerServerEvent("roots-search:server:giveVehicleYourself", data)
end)

RegisterNUICallback('giveVehicle', function(data, cb)
    --[[CreateThread(function()
        local targetId = playerSelector(Config.Locale.giveCopy)
        if targetId == -1 then
            holdBag(false)
        else
            TriggerServerEvent("roots_search:giveVehicle", data, targetId)
        end
    end)]]
    if config.debugMode then
        print('giveVehicle to Player triggered')
    end
    TriggerServerEvent("roots-search:server:giveVehicle", data)
end)

RegisterNetEvent('roots-search:client:vehicleGiven')
AddEventHandler('roots-search:client:vehicleGiven', function(data)
--[[    holdBag(false)
    playAnim("mp_common", "givetake1_a", 1500)]]
    Notification(Config.Locale.giveNotification .. " " .. data)
end)

RegisterNetEvent('roots-search:client:vehicleReceived')
AddEventHandler('roots-search:client:vehicleReceived', function(data)
    Notification(Config.Locale.receiveNotification .. " " .. data)
end)
