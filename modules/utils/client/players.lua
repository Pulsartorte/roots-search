local QBCore = exports['qb-core']:GetCoreObject()

TriggerCallback = function(name, cb, ...)
    QBCore.Functions.TriggerCallback(name, cb, ...)
end


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