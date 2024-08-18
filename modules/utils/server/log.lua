local function getActionTranslation(action)
    if action == 'add' then
        return 'angelegt'
    elseif action == 'edit' then
        return 'bearbeitet'
    elseif action == 'remove' then
        return 'gelöscht'
    end
end

function logAction(playerId, action, entity, entityName)
    local accountName = GetPlayerAccountName(playerId)
    local timestamp = os.date("%Y-%m-%d %H:%M:%S")
    print(('%s : %s | %s %s wurde %s!'):format(timestamp, accountName, entity, entityName, getActionTranslation(action)))
end

