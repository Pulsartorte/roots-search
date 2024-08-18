local TriggerCallback
local Notification

local QBCore = exports['qb-core']:GetCoreObject()
local CurrentFramework

if GetResourceState("qb-core") == "started" then
    CurrentFramework = "qb"
else
    print("^8ERROR: ^3This script only supports QBCore frameworks, but non of these are not present. Unfortunatelly, you cannot use this script.^7")
    return
end

TriggerCallback = function (name, cb, ...)
    QBCore.Functions.TriggerCallback(name, cb, ...)
end

Notification = function (msg)
    QBCore.Functions.Notify(msg)
end

