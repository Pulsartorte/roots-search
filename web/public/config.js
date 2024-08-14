// These are the jobs that can create documents. The ranks in templateGrades can create templates for this job.
const AVAILABLE_JOBS = [
  {
    job: 'police',
    templateGrades: [3, 4],
    logo: 'https://i.imgur.com/YsTyMCc.png',
  },
  {
    job: 'ambulance',
    templateGrades: [3],
    logo: 'https://i.pinimg.com/564x/6b/88/4f/6b884f7ebe28ff56a0e1fd9f5c47890a.jpg',
  },
  {
    job: 'mechanic',
    templateGrades: [4],
    logo: '/web/build/mechaniclogo.jpg',
  },
]

// These templates are visible to all players. If you don't want
// any citizen templates, delete everything inside the [] like this:
//    const CITIZEN_TEMPLATES = []
//
// If these templates are empty, the issued documents tab will
// not be visible to players who fon't have a specified job.
const CITIZEN_TEMPLATES = [
  {
    id: 'citizen_contract',
    documentName: 'Citizen Contract',
    documnetDescription:
      'This is a document between two citizens of Los Santos. This document is an official legal document.',
    fields: [
      {
        name: 'Firstname',
        value: '',
      },
      {
        name: 'Lastname',
        value: '',
      },
      {
        name: 'Valid Until',
        value: '',
      },
    ],
    infoName: 'INFORMATION',
    infoTemplate: '',
  },
]

const COLORS = {
  // These are hexadecimal color codes for the main theme. You can change them as you wish.
  // Primary colors are colors of buttons, and some texts, while secondary color is used for the cancel button.
  primary: '#A7C957',
  secondary: '#F2E8CF',
  roots_dark_green: '#386641',
  roots_middle_green: '#6A994E',
  roots_light_green: '#A7C957',
  roots_creme: '#F2E8CF',
  roots_red: '#BC4749',
  roots_beige: '#DDA15E',
  roots_brown: '#BC6C25',

  // These two should stay RGBA to give them a 90% opacity. Only change the first 3 numbers with any RGB code
  // i.e. rgba([red], [green], [blue], 0.9)
  menuGradientBottom: 'rgb(221,161,94)',
  menuGradientTop: 'rgb(221,161,94)',
}

const IMAGE_PREFIX = 'nui://ak47_qb_inventory/web/build/images/'

// These are the texts that show up on the NUI. Translate them as you wish. If you'd like to change
// the client texts, go to the config.lua file.

const TEXTS = {
  /*Pages Titles*/
  rootsJobTitle: 'Jobs',
  rootsItemsTitle: 'Items',
  rootsVehiclesTitle: 'Fahrzeuge',

  /* General*/
  edit: 'Bearbeiten',
  search: 'Suchen',
  giveInventory: 'Item geben',
  givePlayer: 'Item geben',
  giveYourself: 'Ins Inventar',
  playerActions: 'Spieler Aktionen',
  /* Items*/
  itemImage: 'Bild',
  itemName: 'Name',
  itemLabel: 'Label',
  itemDescription: 'Beschreibung',
  itemWeight: 'Gewicht',
  itemWeightUnit: 'g',
  itemType: 'Item Type',
  itemUnique: 'Einzigartig',
  itemUseable: 'Benutzbar',
  itemAmmoType: 'Ammo Type',
  itemCombinable: 'Kombinierbar',
  itemShouldClose: 'ShouldClose',
  itemCreateTime: 'Erstellt am',
  createItemTitle: 'Item erstellen',
  editItemTitle: 'Item bearbeiten',
  editItemBtn: 'Speichern',
  createItemBtn: 'Erstellen',
  createBtn: 'Erstellen',
  deleteItemTitle: 'Item löschen',
  deleteItemQuestion: 'Willst du das Item wirklich löschen?',
  giveItemQuestion: 'Wie viel möchtest du dir geben?',
  giveItemToPlayerQuestion: 'Wie viel möchtest du dem Bürger geben?',
  itemQuantityToGive: 'Menge',
  giveItemTitle: 'Item geben',
  selectPlayers: 'Wähle ein Bürger',

  /* Documents Translations*/
  myDocumentsTitle: 'My Documents',
  issuedDocumentsTitle: 'Issued Documents',
  templatesTitle: 'Templates',
  customDocumentName: 'Document Name',
  documentType: 'Type',
  documentName: 'Name',
  unnamed: 'Unnamed',
  actions: 'Aktionen',
  edit: 'Bearbeiten',
  save: 'Speichern',
  cancel: 'Abbrechen',
  delete: 'Löschen',
  view: 'Ansehen',
  show: 'Zeigen',
  copy: 'Kopieren',
  newTemplateBtn: 'Template erstellen',
  deleteTemplateTitle: 'Vorlage löschen',
  deleteTemplateQuestion: 'Willst du die Vorlage wirklich löschen?:',
  date: 'Datum',
  newDocumentBtn: 'Dokument erstellen',
  newCitizenDocumentBtn: 'Bürgerdokument erstellen',
  deleteDocumentTitle: 'Dokument löschen',
  deleteDocumentQuestion: 'Willst du das Dokument wirklich löschen?:',
  signHereText: 'Unterschreiben',
  selectDocumentType: 'Wähle ein Dokumenttyp',
  cannotIssueDocument: 'Du kannst mit deinem Job dieses Dokument nicht ausstellen!',
  issuerFirstname: 'Aussteller: Vorname',
  issuerLastname: 'Aussteller: Nachname',
  issuerDOB: 'Aussteller: Geburtsdatum',
  issuerJob: 'Ausssteller: Job',
  termsAndSigning: 'Bedingung und Unterschrift',
  terms1: 'Dieses Dokument wird mit seiner Unterschrift zu einem offiziellen Dokument.',
  terms2:
    'Mit der Unterzeichnung dieses Dokuments sind Sie rechtlich an dessen Inhalt gebunden und akzeptieren alle rechtlichen Konsequenzen, die sich daraus ergeben können.',
  terms3:
    'Jede Kopie dieses Dokuments hat den gleichen Wert wie das Original. Seien Sie bei der Übergabe von Kopien besonders vorsichtig.',
  terms4:
    "Vergewissern Sie sich vor Ihrer Unterschrift, dass Sie den Zusammenhang dieses Dokuments vollständig verstanden haben.",
  terms5: "Zögern Sie nicht, vor der Unterzeichnung einen Rechtsbeistand zu Rate zu ziehen.",
  requiredError: 'Dieses Feld ist erforderlich',
  docNameField: 'DOCUMENT NAME',
  docDescField: 'DOCUMENT DESCRIPTION',
  docFieldField: 'FIELD NAME',
  docAddField: 'Feld hinzufügen',
  docInfoNameField: 'INFORMATION TITLE',
  docInfoValueField: 'INFORMATION TEMPLATE',
  docMinGradeField: 'MINIMUM JOB GRADE',
  editTemplateBtn: 'EDIT TEMPLATE',
  createTemplateBtn: 'CREATE TEMPLATE',
  createDocumentBtn: 'CREATE DOCUMENT',
  documentCopy: 'COPY',
}
