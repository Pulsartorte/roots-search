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
                --[[      thisData.grades = json.decode(v.grades)
                      thisData.created = v.createDate
                      thisData.modified = v.modifiedDate
                      thisData.lastTouched = v.lastTouched]]

                -- Umwandlung von grades in ein Array und Berechnung von Min/Max Payment
                local gradesArray = {}
                local minPayment, maxPayment = nil, nil

                for key, grade in pairs(json.decode(v.grades)) do
                    grade.order = tonumber(key)
                    table.insert(gradesArray, grade)

                    -- Berechnung von minPayment und maxPayment
                    if not minPayment or grade.payment < minPayment then
                        minPayment = grade.payment
                    end
                    if not maxPayment or grade.payment > maxPayment then
                        maxPayment = grade.payment
                    end
                end

                -- Sortieren der Grades
                table.sort(gradesArray, function(a, b)
                    return a.order < b.order
                end)

                -- Setzen des umgewandelten grades Arrays und der Min/Max Werte
                thisData.grades = gradesArray
                thisData.minPayment = minPayment
                thisData.maxPayment = maxPayment

                -- Hinzufügen des verarbeiteten Datensatzes zur Ergebnisliste
                table.insert(mappedResult, thisData)

                -- Debugging: Ausgabe der einzelnen Jobs
                if config.debugMode then
                    --print('Job:', json.encode(thisData))
                end
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

    jobData.lastTouched = GetPlayerAccountName(source)

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

    jobData.lastTouched = GetPlayerAccountName(source)

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

RegisterServerEvent('roots-search:server:setJob')
AddEventHandler('roots-search:server:setJob', function(jobData)
    local playerId = source
    local jobName = jobData.jobName
    local jobGrade = jobData.jobGrade
    local targetPlayerId = jobData.targetPlayerId
    local targetPlayerName = jobData.targetPlayerName
    local isMultiJob = jobData.isMultiJob
    local job = QBCore.Shared.Jobs[jobName]

    if not job then
        print('Job nicht verfügbar.')
        local msg = string.format('Job %s %s nicht verfügbar!', job.label, job.grades[jobGrade] )
        QBCore.Functions.Notify(source, msg, 'success', 3500)
        return
    end
    if config.debugMode then
        print('roots-search:server:setJob to Player triggered')
        print('Data: ', json.encode(jobData))
        print('PlayerId: ', playerId)
        print('TargetPlayerId:', targetPlayerId)
        print('AddJob: for ', jobData.jobName, jobData.jobGrade)
    end

    local jobLabel = job.label
    local jobGrades = job.grades
    local jobGradeName = jobGrades[tostring(jobGrade)].name
    print('Job Label: ', jobLabel)
    print('Grade Label: ', jobGradeName)
    if not targetPlayerId then
        local Player = QBCore.Functions.GetPlayer(playerId)
        if Player then
            Player.Functions.SetJob(jobName, jobGrade)
            local msg = string.format('Du hast dir Job: %s Rang: %s gesetzt', jobLabel, jobGradeName)
            QBCore.Functions.Notify(source, msg, 'success', 3500)
        else
            TriggerClientEvent('QBCore:Notify', source, Lang:t('error.not_online'), 'error')
        end
        -- Set Multi Job
        if isMultiJob then
            local citizenid = Player.PlayerData.citizenid
            print(citizenid)
            local success = exports['ps-multijob']:AddJob(citizenid, jobName, jobGrade)
            if success then
                local msg = string.format('Du hast dir Job: %s Rang: %s im MultiJob zugewiesen', jobLabel, jobGradeName)
                QBCore.Functions.Notify(source, msg, 'success', 3500)
            end
        end
    else
        local Player = QBCore.Functions.GetPlayer(targetPlayerId)
        if Player then
            Player.Functions.SetJob(jobName, jobGrade)
            local msg = string.format('Du hast %s | Job: %s Rang: %s zugewiesen', targetPlayerName, jobLabel,jobGradeName)
            QBCore.Functions.Notify(playerId, msg, 'success', 3500)
            local msg = string.format('Dir wurde Job: %s Rang: %s gesetzt', jobLabel, jobGradeName )
            QBCore.Functions.Notify(targetPlayerId, msg, 'success', 3500)
        else
            TriggerClientEvent('QBCore:Notify', source, Lang:t('error.not_online'), 'error')
        end

        if isMultiJob then
            local citizenid = Player.PlayerData.citizenid
            local success = exports['ps-multijob']:AddJob(citizenid, jobName, jobGrade)
            if success then
                local msg = string.format('Du hast %s | Job: %s Rang: %s im MultiJob zugewiesen', targetPlayerName, jobLabel, jobGradeName)
                QBCore.Functions.Notify(playerId, msg, 'success', 3500)
                local msg = string.format('Dir wurde Job: %s Rang: %s im MultiJob zugewiesen', jobLabel, jobGradeName)
                QBCore.Functions.Notify(targetPlayerId, msg, 'success', 3500)
            end
        end
        --TriggerClientEvent("roots-search:client:jobGiven", playerId, jobName)
        --TriggerClientEvent("roots-search:client:jobReceived", targetPlayerId, jobName)
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