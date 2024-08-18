local QBCore = exports['qb-core']:GetCoreObject()
local config = require('modules.items.config_items')


local TriggerCallback
local Notification

TriggerCallback = function(name, cb, ...)
    QBCore.Functions.TriggerCallback(name, cb, ...)
end

Notification = function(msg)
    QBCore.Functions.Notify(msg)
end

-- Server-side callback registration
RegisterNUICallback('getItems', function(data, cb)
    if config.debugMode then
        print('NUICallback getItems triggered')
    end

    -- Trigger the QBCore callback to get items
    TriggerCallback('roots-search:server:getItems', function(result)
        if config.debugMode then
            print('roots-search:server:getItems callback triggered')
            -- Print the result for debugging
            print('Result:', json.encode(result)) -- Prints the result in JSON format
        end
        cb(result)
    end)
end)

RegisterNUICallback('createItem', function(data, cb)
    if config.debugMode then
        print('NUICallback createItem triggered')
    end
    TriggerCallback('roots-search:server:createItem', function(result)
        local createdItem = json.decode(data)
        if config.debugMode then
            print('roots-search:server:createItem callback triggered')
            print('data: ', data)
        end
        QBCore.Functions.Notify(('Item %s wurde erfolgreich angelegt!'):format(createdItem.label), 'success', 3500)
        cb(result)
    end,
            data)
end)

RegisterNUICallback('editItem', function(data, cb)
    if config.debugMode then
        print('NUICallback editItem triggered')
    end
    TriggerCallback('roots-search:server:editItem', function(result)
        local editItem = json.decode(data)
        if config.debugMode then
            print('roots-search:server:editItem callback triggered')
            print('data:', data)
        end
        QBCore.Functions.Notify(('Item %s wurde erfolgreich aktualisiert!'):format(editItem.label), 'success', 3500)
        cb(result)
    end,
            data)
end)

RegisterNUICallback('deleteItem', function(data, cb)
    if config.debugMode then
        print('NUICallback deleteItem triggered')
    end
    TriggerCallback('roots-search:server:deleteItem', function(result)
        if config.debugMode then
            print('roots-search:server:deleteItem callback triggered')
            print('data:', data)
        end
        cb(result)
    end,
            data)
end)

RegisterNUICallback('giveItemYourself', function(data, cb)
    if config.debugMode then
        print('giveItemYourself triggered')
    end
    TriggerServerEvent("roots-search:server:giveItemYourself", data)
end)

RegisterNUICallback('giveItem', function(data, cb)
    --[[CreateThread(function()
        local targetId = playerSelector(Config.Locale.giveCopy)
        if targetId == -1 then
            holdBag(false)
        else
            TriggerServerEvent("roots_search:giveItem", data, targetId)
        end
    end)]]
    if config.debugMode then
        print('giveItem to Player triggered')
    end
    TriggerServerEvent("roots-search:server:giveItem", data)
end)

RegisterNetEvent('roots-search:client:itemGiven')
AddEventHandler('roots-search:client:itemGiven', function(data)
    --[[    holdBag(false)
        playAnim("mp_common", "givetake1_a", 1500)]]
    Notification(Config.Locale.giveNotification .. " " .. data)
end)

RegisterNetEvent('roots-search:client:itemReceived')
AddEventHandler('roots-search:client:itemReceived', function(data)
    Notification(Config.Locale.receiveNotification .. " " .. data)
end)
