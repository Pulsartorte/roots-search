local QBCore = exports['qb-core']:GetCoreObject()
local selectingPlayer = false
local prop = nil

local function toggleNuiFrame(shouldShow, shouldHoldBag)
    holdClipboard(shouldHoldBag)
    SetNuiFocus(shouldShow, shouldShow)
    SendReactMessage('setVisible', shouldShow)
end

local function toggleDocumentFrame(shouldShow, document)
    holdDocument(shouldShow)
    SetNuiFocus(shouldShow, shouldShow)
    SendReactMessage('setDocument', document)
end

RegisterNUICallback('hideDocument', function(_, cb)
    toggleDocumentFrame(false, nil)
    cb({})
end)

RegisterNUICallback('hideFrame', function(_, cb)
    toggleNuiFrame(false, false)
    cb({})
end)

RegisterNUICallback('getPlayers', function(data, cb)
    print('getPlayers triggered')
    TriggerCallback('roots-search:server:getPlayers', function(result)
        print('roots-search:getPlayers callback triggered')
        local createdItem = json.encode(result)
        if #result == 1 then
            QBCore.Functions.Notify(('%d Bürger erfolgreich geladen!'):format(#result), 'success', 3000)
        elseif #result > 1 then
            QBCore.Functions.Notify(('%d Bürger erfolgreich geladen!'):format(#result), 'success', 3000)
        end
        cb(result)
    end,
            data)
end)

RegisterNUICallback('getPlayerJob', function(data, cb)
    if CurrentFramework == "qb" then
        local PlayerJob = QBCore.Functions.GetPlayerData().job
        local retData = {
            grade = PlayerJob.grade.level,
            grade_label = PlayerJob.grade.name,
            grade_name = PlayerJob.grade.name,
            grade_salary = PlayerJob.payment,
            label = PlayerJob.label,
            name = PlayerJob.name,
        }
        retData.isBoss = PlayerJob.isboss
        cb(retData)
    end
end)

function holdClipboard(shouldHold)
    if shouldHold then
        detachClipboard()

        playAnim("missfam4", "base")

        attachClipboard()

    else
        ClearPedTasks(GetPlayerPed(-1))
        detachClipboard()
    end
end

function playAnim(dict, anim, duration)
    duration = duration or -1
    while not HasAnimDictLoaded(dict) do
        RequestAnimDict(dict)
        Wait(10)
    end

    TaskPlayAnim(GetPlayerPed(-1), dict, anim, 2.0, 2.0, duration, 51, 0, false, false, false)
    RemoveAnimDict(dict)
end

function attachClipboard()
    local player = PlayerPedId()
    local x, y, z = table.unpack(GetEntityCoords(player))

    while not HasModelLoaded(GetHashKey(Config.PaperProp.name)) do
        RequestModel(GetHashKey(Config.PaperProp.name))
        Wait(10)
    end

    prop = CreateObject(GetHashKey(Config.PaperProp.name), x, y, z + 0.2, true, true, true)
    SetEntityCompletelyDisableCollision(prop, false, false)
    AttachEntityToEntity(prop, player, GetPedBoneIndex(player, 36029), 0.16, 0.08, 0.1, Config.PaperProp.xRot, Config.PaperProp.yRot, Config.PaperProp.zRot, true, true, false, true, 1, true)
    SetModelAsNoLongerNeeded(Config.PaperProp.name)
end

function detachClipboard()
    DeleteEntity(prop)
end

function playerSelector(confirmText)
    toggleNuiFrame(false, true, nil)
    selectingPlayer = true

    while selectingPlayer do
        local closestPlayer, closestPlayerDistance
        if CurrentFramework == "esx" then
            closestPlayer, closestPlayerDistance = ESX.Game.GetClosestPlayer()
        elseif CurrentFramework == "qb" then
            closestPlayer, closestPlayerDistance = QBCore.Functions.GetClosestPlayer()
        end
        local closestPlayerCoords = GetEntityCoords(GetPlayerPed(closestPlayer))

        DisableControlAction(2, 200, true)

        if IsControlJustReleased(0, 202) then
            selectingPlayer = false
            return -1
        end

        BeginTextCommandDisplayHelp('main')
        AddTextEntry('main', "~INPUT_CONTEXT~ " .. confirmText .. "  ~INPUT_FRONTEND_PAUSE_ALTERNATE~ " .. Config.Locale.cancel)
        EndTextCommandDisplayHelp(0, 0, 1, -1)

        if closestPlayer ~= -1 and closestPlayerDistance < 2.0 then
            DrawMarker(20, closestPlayerCoords.x, closestPlayerCoords.y, closestPlayerCoords.z + 1.2, 0.0, 0.0, 0.0, 0, 0.0, 0.0, 0.4, 0.4, -0.4, 255, 255, 255, 100, false, true, 2, false, false, false, false)
            DrawMarker(25, closestPlayerCoords.x, closestPlayerCoords.y, closestPlayerCoords.z - 0.95, 0.0, 0.0, 0.0, 0, 0.0, 0.0, 1.0, 1.0, 1.0, 255, 255, 255, 100, false, true, 2, false, false, false, false)
            if IsControlJustReleased(0, 38) then
                selectingPlayer = false
                local targetId = GetPlayerServerId(closestPlayer)
                return targetId
            end
        else
            if IsControlJustReleased(0, 38) then
                Notification(Config.Locale.noPlayersAround)
            end
        end
        Wait(1)
    end
end



if Config.RegisterKey then
    if Config.Command then
        RegisterKeyMapping(Config.Command, Config.Locale.registerMapDescription, "keyboard", Config.RegisterKey)
    else
        print("^8ERROR: ^3No search command found. Please provide a \"Config.Command\" value.^7")
    end
end

-- Register Command
if Config.Command then
    RegisterCommand(Config.Command, function()
        toggleNuiFrame(true, true)
    end)
end