local RegisterCallback
local RegisterItem

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
RegisterItem = function(itemName, fn)
    QBCore.Functions.CreateUseableItem(itemName, fn)
end


CreateThread(function()
    Wait(5000)
    local resource = GetCurrentResourceName()
    local currentVersion = GetResourceMetadata(resource, 'version', 0)
    local update = 'A management Tool for better & faster Support'

    local roots1 = '^4|                                  ██████╗  ██████╗  ██████╗ ████████╗███████╗                                          |'
    local roots2 = '^4|                                  ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔════╝                                          |'
    local roots3 = '^4|                                  ██████╔╝██║   ██║██║   ██║   ██║   ███████╗                                          |'
    local roots4 = '^4|                                  ██╔══██╗██║   ██║██║   ██║   ██║   ╚════██║                                          |'
    local roots5 = '^4|                                  ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████║                                          |'
    local roots6 = '^4|                                  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝                                          |'
    local message = '^4|^0                                  Version ^1' .. currentVersion .. '^0'
    local messageLength = #(message) - 8
    local updateMessage = '^4|                              ^3Update: ^2' .. update
    local updateMessageLength = #(updateMessage) - 6

    local length = 120

    for i = 1, length - updateMessageLength do
        updateMessage = updateMessage .. " "
    end
    updateMessage = updateMessage .. "^4|^0"

    for i = 1, length - messageLength do
        message = message .. " "
    end
    message = message .. "^4|^0"

    local border = "^4="
    for i = 1, length do
        border = border .. "="
    end

    print(border)
    print(roots1)
    print(roots2)
    print(roots3)
    print(roots4)
    print(roots5)
    print(roots6)
    print(message)
    print(updateMessage)
    print(border .. "^0")

end)