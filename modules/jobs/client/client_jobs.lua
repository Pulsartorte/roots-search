local QBCore = exports['qb-core']:GetCoreObject()
local config = require('modules.jobs.config_jobs')

local TriggerCallback
local Notification

TriggerCallback = function(name, cb, ...)
    QBCore.Functions.TriggerCallback(name, cb, ...)
end

Notification = function(msg)
    QBCore.Functions.Notify(msg)
end

-- Server-side callback registration
RegisterNUICallback('getJobs', function(data, cb)
    if config.debugMode then
        print('NUICallback getJobs triggered')
    end

    -- Trigger the QBCore callback to get jobs
    TriggerCallback('roots-search:server:getJobs', function(result)
        if config.debugMode then
            print('roots-search:server:getJobs callback triggered')
            -- Print the result for debugging
            print('Result:', json.encode(result)) -- Prints the result in JSON format
        end
        cb(result)
    end)
end)

RegisterNUICallback('createJob', function(data, cb)
    if config.debugMode then
        print('NUICallback createJob triggered')
    end
    TriggerCallback('roots-search:server:createJob', function(result)
        local createdJob = json.decode(data)
        if config.debugMode then
            print('roots-search:server:createJob callback triggered')
            print('data: ', data)
        end
        QBCore.Functions.Notify(('Job %s wurde erfolgreich angelegt!'):format(createdJob.label), 'success', 3500)
        cb(result)
    end,
            data)
end)

RegisterNUICallback('editJob', function(data, cb)
    if config.debugMode then
        print('NUICallback editJob triggered')
    end
    TriggerCallback('roots-search:server:editJob', function(result)
        local editJob = json.decode(data)
        if config.debugMode then
            print('roots-search:server:editJob callback triggered')
            print('data:', data)
        end
        QBCore.Functions.Notify(('Job %s wurde erfolgreich aktualisiert!'):format(editJob.label), 'success', 3500)
        cb(result)
    end,
            data)
end)

RegisterNUICallback('deleteJob', function(data, cb)
    if config.debugMode then
        print('NUICallback deleteJob triggered')
    end
    TriggerCallback('roots-search:server:deleteJob', function(result)
        if config.debugMode then
            print('roots-search:server:deleteJob callback triggered')
        end
        cb(result)
    end,
            data)
end)

RegisterNUICallback('setJob', function(jobData, cb)
    if config.debugMode then
        print('setJob to Player triggered')
    end
    TriggerServerEvent("roots-search:server:setJob", jobData)
end)

RegisterNetEvent('roots-search:client:jobGiven')
AddEventHandler('roots-search:client:jobGiven', function(msg)
    --[[    holdBag(false)
        playAnim("mp_common", "givetake1_a", 1500)]]
    Notification(msg)
end)

RegisterNetEvent('roots-search:client:jobReceived')
AddEventHandler('roots-search:client:jobReceived', function(msg)
    Notification(msg)
end)