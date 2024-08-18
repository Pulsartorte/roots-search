function RefreshQBCore()
    return exports['qb-core']:GetCoreObject()
end

function GetPlayer(src)
    return QBCore.Functions.GetPlayer(src)
end

function GetPlayerIdentifier(src)
    return QBCore.Functions.GetPlayer(src).PlayerData.citizenid
end

function GetPlayerJobName(src)
    return QBCore.Functions.GetPlayer(src).PlayerData.job.name
end