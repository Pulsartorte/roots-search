local QBCore = exports['qb-core']:GetCoreObject()
local RCore = exports['roots-core']:GetCoreObject()

local config = require('modules.jobs.config_jobs')

local RegisterCallback

RegisterCallback = function(name, fn)
    QBCore.Functions.CreateCallback(name, fn)
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
            logAction(source,'add', 'Job', jobName)
            QBCore = RefreshQBCore()
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
            logAction(source,'edit', 'Job', jobName)
            QBCore = RefreshQBCore()
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
            logAction(source,'remove', 'Job', jobName)
            QBCore = RefreshQBCore()
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
        local msg = string.format('Job %s %s nicht verfügbar!', jobName, jobGrade)
        QBCore.Functions.Notify(source, msg, 'success', 3500)
        return
    end

    local jobLabel = job.label
    local jobGrades = job.grades
    local jobGradeName = jobGrades[tostring(jobGrade)].name
    print('Job Label: ', jobLabel)
    print('Grade Label: ', jobGradeName)

    if config.debugMode then
        print('roots-search:server:setJob to Player triggered')
        print('Data: ', json.encode(jobData))
        print('PlayerId: ', playerId)
        print('TargetPlayerId:', targetPlayerId)
        print('AddJob: for ', jobData.jobName, jobData.jobGrade)
    end

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
        local targetPlayer = QBCore.Functions.GetPlayer(targetPlayerId)
        if targetPlayer then
            targetPlayer.Functions.SetJob(jobName, jobGrade)
            local msg = string.format('Du hast %s | Job: %s Rang: %s zugewiesen', targetPlayerName, jobLabel, jobGradeName)
            QBCore.Functions.Notify(playerId, msg, 'success', 3500)
            local msg = string.format('Dir wurde Job: %s Rang: %s gesetzt', jobLabel, jobGradeName)
            QBCore.Functions.Notify(targetPlayerId, msg, 'success', 3500)
        else
            TriggerClientEvent('QBCore:Notify', source, Lang:t('error.not_online'), 'error')
        end

        if isMultiJob then
            local citizenid = targetPlayer.PlayerData.citizenid
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