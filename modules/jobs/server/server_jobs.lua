local RegisterCallback
local RegisterJob
local QBCore = exports['qb-core']:GetCoreObject()
local RCore = exports['roots-core']:GetCoreObject()
--local config = require('server.config_jobs')
local config = require('modules.jobs.config_jobs')
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
RegisterJob = function(jobName, fn)
    QBCore.Functions.CreateUseableJob(jobName, fn)
end

RegisterCallback('roots-search:server:getJobs', function(source, cb)
    if config.debugMode then
        print('Callback roots-search:server:getJobs triggered')
    end
    RCore.Functions.Jobs.fetchAllJobs(function(jobs)
        local jobCount = 0
        if jobs ~= nil then
            -- Debugging: Ausgabe der Anzahl der Jobs
            jobCount = getJobCount(jobs)
        end
        if jobCount > 0 then
            local mappedResult = {}
            for k, v in pairs(jobs) do
                local thisData = v
                thisData.id = v.name
                thisData.created = v.created
                table.insert(mappedResult, thisData)

                -- Debugging: Ausgabe der einzelnen Jobs
                --print('Job added:', json.encode(thisData))
            end
            cb(mappedResult)
        else
            print('No jobs found')
            cb({})
        end
    end)
end)

RegisterCallback('roots-search:server:createJob', function(source, cb, data)
    local src = source
    local PlayerJobName = GetPlayerJobName(src)
    if config.debugMode then
        print('roots-search:server:createJob')
        print(json.encode(data))
    end
    local job = json.decode(data)
    local jobName
    if job and job.name then
        jobName = job.name
    end
    local jobData = job

    RCore.Functions.Jobs.addJob(jobName, jobData, function(success)
        if success then
            print('Jobs erfolgreich angelegt!')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:editJob', function(source, cb, data)
    if config.debugMode then
        print('roots-search:server:editJob')
        print(json.encode(data))
    end
    local job = json.decode(data)
    local jobName
    if job and job.name then
        jobName = job.name
    end
    local jobData = job

    RCore.Functions.Jobs.updateJob(jobName, jobData, function(success)
        if success then
            print('Jobs erfolgreich aktualisiert!')
        end
        if cb then
            cb(success)
        end
    end)
end)

RegisterCallback('roots-search:server:deleteJob', function(source, cb, data)
    local jobName = data
    RCore.Functions.Jobs.removeJob(jobName, function(success)
        if success then
            print('Job wurde erfolgreich gelöscht')
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


RegisterServerEvent('roots-search:server:giveJobYourself')
AddEventHandler('roots-search:server:giveJobYourself', function(data)
    local playerId = source
    local amount = data.quantity
    local jobData = QBCore.Shared.Jobs[data.jobName]

    if config.debugMode then
        print('roots-search:server:giveJobYourself triggered')
        print('Data: ', json.encode(data))
        print('ID: ', playerId)
        print('Amount:', amount)
        print('AddJob:', json.encode(jobData))
    end

    local player = QBCore.Functions.GetPlayer(playerId)
    if jobData then
        -- check jobinfo
        local info = prepareJobInfo(player, jobData)

        local jobAdded = exports['qb-inventory']:AddJob(playerId, jobData['name'], amount, false, info, 'Roots Search')
        if jobAdded then
            local msg = string.format('Du hast dir %dx %s gegeben', amount, jobData['label'])
            QBCore.Functions.Notify(source, msg, 'success', 3500)
            TriggerClientEvent('qb-inventory:client:JobBox', playerId, jobData, 'add', amount)
            if Player(playerId).state.inv_busy then
                TriggerClientEvent('qb-inventory:client:updateInventory', playerId)
            end
        else
            local msg = string.format('%d x %s konnten nicht ins Inventar gelegt werden!', amount, jobData['name'])
            QBCore.Functions.Notify(source, msg, 'error', 3500)
        end
    else
        local msg = string.format('Fehler in JobData! %s Object leer. Kontaktiere ein Developer', data.jobName)
        QBCore.Functions.Notify(source, msg, 'error')
        QBCore.Functions.Notify(source, 'Warte bis zum nächsten Restart!', 'error', 3500)
        QBCore.Functions.Notify(source, msg, 'Dann sollte es da sein! ;-)', 3500)
    end

    --[[TriggerClientEvent("roots-search:client:client:jobGiven", src, data.name)]]
end)

RegisterServerEvent('roots-search:server:giveJob')
AddEventHandler('roots-search:server:giveJob', function(data)
    local playerId = source
    local targetPlayerId = data.targetPlayerId
    local targetPlayerName = data.targetPlayerName
    local amount = data.quantity
    local jobData = QBCore.Shared.Jobs[data.jobName]

    if config.debugMode then
        print('roots-search:server:giveJob to Player triggered')
        print('Data: ', json.encode(data))
        print('ID: ', playerId)
        print('Amount:', amount)
        print('AddJob:', json.encode(jobData))
    end

    local targetPlayer = QBCore.Functions.GetPlayer(targetPlayerId)
    if jobData then
        -- check jobinfo
        local info = prepareJobInfo(targetPlayerId, jobData)
        local jobAdded = exports['qb-inventory']:AddJob(targetPlayerId, jobData['name'], amount, false, info, 'give job command')
        if jobAdded then
            local msg = string.format('Du hast %s %dx %s gegeben', targetPlayerName, amount, jobData['label'])
            QBCore.Functions.Notify(source, msg, 'success', 3500)
            TriggerClientEvent('qb-inventory:client:JobBox', playerId, jobData, 'add', amount)
            if Player(playerId).state.inv_busy then
                TriggerClientEvent('qb-inventory:client:updateInventory', playerId)
            end
            TriggerClientEvent("roots-search:client:jobGiven", playerId, jobName)
            TriggerClientEvent("roots-search:client:jobReceived", targetPlayerId, jobName)
        else
            local msg = string.format('%d x %s konnten nicht ins Inventar gelegt werden!', amount, jobData['name'])
            QBCore.Functions.Notify(source, msg, 'error', 3500)
        end
    else
        local msg = string.format('Fehler in JobData! %s Object leer. Kontaktiere ein Developer', jobName)
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

-- Funktion zum Zählen der Anzahl der Jobs
function getJobCount(jobs)
    local jobCount = 0
    if jobs == nil then
        return jobCount
    end
    for _ in pairs(jobs) do
        jobCount = jobCount + 1
    end
    return jobCount
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

function prepareJobInfo(player, jobData)
    if jobData then
        -- check jobinfo
        local jobInfo = {}
        if jobData['name'] == 'id_card' then
            jobInfo.citizenid = player.PlayerData.citizenid
            jobInfo.firstname = player.PlayerData.charinfo.firstname
            jobInfo.lastname = player.PlayerData.charinfo.lastname
            jobInfo.birthdate = player.PlayerData.charinfo.birthdate
            jobInfo.gender = player.PlayerData.charinfo.gender
            jobInfo.nationality = player.PlayerData.charinfo.nationality
        elseif jobData['name'] == 'driver_license' then
            jobInfo.firstname = player.PlayerData.charinfo.firstname
            jobInfo.lastname = player.PlayerData.charinfo.lastname
            jobInfo.birthdate = player.PlayerData.charinfo.birthdate
            jobInfo.type = 'Class C Driver License'
        elseif jobData['type'] == 'weapon' then
            amount = 1
            jobInfo.serie = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
            jobInfo.quality = 100
        elseif jobData['name'] == 'harness' then
            jobInfo.uses = 20
        elseif jobData['name'] == 'markedbills' then
            jobInfo.worth = math.random(5000, 10000)
        end

        -- need to update the info that the player gets the right information about this changed job
        --jobInfo.description = jobData.description

        --[[jobInfo.label = jobData.label
        jobInfo.weight = jobData.weight
        jobInfo.type = jobData.type
        jobInfo.unique = jobData.unique
        jobInfo.useable = jobData.useable
        jobInfo.image = jobData.image
        jobInfo.shouldClose = jobData.should
        jobInfo.combinable = jobData.combinable]]

        return jobInfo
    end
end