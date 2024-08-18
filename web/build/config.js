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
    roots_darkest_green: '#101b12',
    roots_dark_green: '#1f2e17',
    roots_middle_green: '#6A994E',
    roots_light_green: '#A7C957',
    roots_creme: '#F2E8CF',
    roots_red: '#BC4749',
    roots_beige: '#DDA15E',
    roots_brown: '#BC6C25',

    // Light Theme Colors
    lightPrimaryBackground: '#FAFAFA',  // Sehr helles Grau/Off-White für den Hintergrund
    lightSecondaryBackground: '#FFF8E1', // Weiches Creme für Container (Modal)
    lightInputBackground: '#f5f5f5', // Etwas dunkleres Beige/Grau für Eingabefelder
    lightTextPrimary: '#212121',  // Dunkelgrau für primäre Texte
    lightTextSecondary: '#757575',  // Mittelgrau für sekundäre Texte
    lightAccentPrimary: '#DDA15E',  // Grün für primäre Akzente (Buttons, Links)
    lightAccentSecondary: '#8D6E63', // Dezentes Braun für passive Elemente
    lightAccentTertiary: '#DDA15E', // Sanftes Blau für Hover-States
    lightBorderDark: '#B0B0B0', // Dunklerer Rahmen für Eingabefelder

    // Dark Theme Colors

    darkPrimaryBackground: '#1E1E1E',  // Primärer Hintergrund (Anthrazit)
    darkSecondaryBackground: '#2B2D42', // Sekundärer Hintergrund (Dunkelgrau)
    darkTextPrimary: '#E0E0E0',  // Primäre Textfarbe (Helles Grau)
    darkTextSecondary: '#A7C957',  // Sekundäre Textfarbe (Grün)
    darkAccentPrimary: '#A7C957',  // Primäre Akzentfarbe (Grün)
    darkAccentSecondary: '#DDA15E', // Sekundäre Akzentfarbe (Beige)
    darkAccentTertiary: '#BC6C25', // Tertiäre Akzentfarbe (Braun)

    roots_light_green: '#A7C957',
    roots_creme: '#F2E8CF',
    background_dark: '#2B2D42',
    text_light: '#F2E8CF',
    text_dark: '#2B2D42',


    // These two should stay RGBA to give them a 90% opacity. Only change the first 3 numbers with any RGB code
    // i.e. rgba([red], [green], [blue], 0.9)
    menuGradientBottom: 'rgb(221,161,94)',
    menuGradientTop: 'rgb(221,161,94)',
}

const ITEM_IMAGE_PREFIX = 'nui://ak47_qb_inventory/web/build/images/'
const JOB_IMAGE_PREFIX = 'nui://lb-phone/ui/dist/assets/img/icons/services/'

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
    setJob: 'Job setzen',
    setJobToPlayer: 'Spieler Job setzen',
    playerActions: 'Spieler Aktionen',

    /* Items*/
    itemImage: 'Bild',
    itemName: 'Name',
    itemLabel: 'Label',
    itemDescription: 'Beschreibung',
    itemWeight: 'Gewicht',
    itemWeightUnitG: 'g',
    itemWeightUnitKG: 'kg',
    itemType: 'Item Type',
    itemUnique: 'Einzigartig',
    itemUseable: 'Benutzbar',
    itemAmmoType: 'Ammo Type',
    itemCombinable: 'Kombinierbar',
    itemShouldClose: 'ShouldClose',
    itemCreateTime: 'Erstellt am',
    itemModifiedTime: 'Bearbeitet am',
    itemModifiedBy: 'Bearbeitet von',
    createItemTitle: 'Item erstellen',
    editItemTitle: 'Item bearbeiten',
    editItemBtn: 'Speichern',
    createItemBtn: 'Neu',
    saveCreateItemBtn: 'Erstellen',
    createBtn: 'Erstellen',
    deleteItemTitle: 'Item löschen',
    deleteItemQuestion: 'Willst du das Item wirklich löschen?',
    giveItemQuestion: 'Wie viel möchtest du dir geben?',
    giveItemToPlayerQuestion: 'Wie viel möchtest du dem Bürger geben?',
    itemQuantityToGive: 'Menge',
    giveItemTitle: 'Item geben',
    selectPlayers: 'Wähle ein Bürger',

    /* Jobs*/
    jobEdit: ' bearbeiten',
    jobImage: 'Bild',
    jobName: 'Name',
    jobLabel: 'Label',
    jobType: 'Job Type',
    jobGrades: 'Ränge',
    jobPayment: 'Bezahlung',
    jobIsBoss: 'Boss',
    jobAddGrade: 'Rang hinzufügen',
    jobGradesCount: 'Anzahl der Ränge',
    jobDefaultDuty: 'Standard im Dienst',
    jobOffDutyPay: 'Vergütung außerhalb des Dienstes',
    jobCreateTime: 'Erstellt am',
    jobModifiedTime: 'Bearbeitet am',
    jobModifiedBy: 'Bearbeitet von',
    createJobTitle: 'Job erstellen',
    editJobTitle: 'Job bearbeiten',
    editJobBtn: 'Speichern',
    createJobBtn: 'Neu',
    saveCreateJobBtn: 'Erstellen',
    createBtn: 'Erstellen',
    deleteJobTitle: 'Job löschen',
    deleteJobQuestion: 'Willst du das Job wirklich löschen?',
    setJobQuestion: 'Welchen Rang möchtest du dir geben?',
    setJobToPlayerQuestion: 'Welchen Rang möchtest du dem Bürger geben?',
    jobQuantityToGive: 'Menge',
    setJobTitle: 'Job setzen',
    selectJobGrade: 'Wähle ein Rang',
    isMultiJob: 'Als MultiJob hinzufügen',
    isMultiJobTooltip: 'Du kannst deinen Job wechseln indem du "J" drückst. Dort kannst du dann selektieren in welchem Job du sein möchtest',
    jobGradesMinPayment: 'Min. Gehalt',
    jobGradesMaxPayment: 'Max. Gehalt',


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
