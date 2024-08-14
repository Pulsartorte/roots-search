--          ██████╗  ██████╗  ██████╗ ████████╗███████╗    ███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗
--          ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔════╝    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║
--          ██████╔╝██║   ██║██║   ██║   ██║   ███████╗    ███████╗█████╗  ███████║██████╔╝██║     ███████║
--          ██╔══██╗██║   ██║██║   ██║   ██║   ╚════██║    ╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║
--          ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████║    ███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║
--          ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝

Config = {}

Config.Command = "search" -- If nil, the command won't work
Config.RegisterKey = "k" -- example: "k". If nil, there won't be a key registered. "Config.Command" has to be set to work.

Config.DocumentItemName = nil -- The name of the item you want to open the documents. If nil, no item will be registered. Example: "wallet"
Config.BirthdateFormat = "DD/MM/YYYY" -- The date format your framework uses. By default, ESX: 'DD/MM/YYYY' QB: 'YYYY-MM-DD' Check your identity/multicharacter config!

Config.PaperProp = {
  name = "prop_cd_paper_pile1",
  xRot = -130.0, 
  yRot = -50.0,
  zRot = 0.0
}

Config.BagProp = {
  name = "prop_security_case_01",
  xRot = 0.0,
  yRot = 280.0,
  zRot = 53.0,
  suitcase2 = {
    dict = 'missheistdocksprep1hold_cellphone',
    anim = 'static',
    bone = 'right_hand',
    attaching_position = {
      x = 0.10,
      y = 0.0,
      z = 0.0,
      xRotation = 0.0,
      yRotation = 280.0,
      zRotation = 53.0,
    }
  }
}

-- These texts only show up on client side. To change texts in the NUI,
-- go to the web/build/config.js file
Config.Locale = {
  ["receiveNotification"] = "You received a document: ",
  ["giveNotification"] = "You gave a document: ",
  ["cancel"] = "Cancel",
  ["noPlayersAround"] = "Es ist keiner in der Nähe!",
  ["showDocument"] = "Show Document",
  ["giveCopy"] = "Give Copy",
  ["giveItem"] = "Item geben",
  ["registerMapDescription"] = "Open documents"
}