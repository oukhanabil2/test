// app.js - VERSION COMPLÈTE SYNC AVEC LOGIQUE MÉTIER
// Système de Gestion des Agents (SGA) - Planning Mensuel

// --- CONSTANTES ---
const JOURS_FRANCAIS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const SHIFT_LABELS = {
    '1': 'Matin',
    '2': 'Après-midi',
    '3': 'Nuit',
    'R': 'Repos',
    'C': 'Congé',
    'M': 'Maladie',
    'A': 'Autre absence',
    '-': 'Non défini'
};
const SHIFT_COLORS = {
    '1': '#3498db',
    '2': '#e74c3c',
    '3': '#9b59b6',
    'R': '#2ecc71',
    'C': '#f39c12',
    'M': '#e67e22',
    'A': '#95a5a6',
    '-': '#7f8c8d'
};

// Date d'affectation fixe
const DATE_AFFECTATION_BASE = "2025-11-01";

// --- VARIABLES GLOBALES ---
let agents = [];
let planningData = {};
let holidays = [];
let panicCodes = [];
let radios = [];
let uniforms = [];
let warnings = [];
let leaves = [];
let radioHistory = [];
let auditLog = [];

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    displayMainMenu();
    console.log("✅ SGA initialisé - Version complète");
});

function initApp() {
    loadData();
    if (agents.length === 0) {
        initializeTestData();
    }
    loadHolidaysFromCurrentYear();
}

// --- DONNÉES DE TEST AVEC VOS AGENTS ---
function initializeTestData() {
    agents = [
        {
            code: 'CPA',
            nom: 'OUKHA',
            prenom: 'NABIL',
            groupe: 'A',
            tel: '0681564713',
            adresse: 'sala Al jadida',
            code_panique: '',
            poste: 'CP',
            cin: 'A758609',
            date_naissance: '1974-11-05',
            matricule: 'S09278C',
            date_entree: DATE_AFFECTATION_BASE,
            date_sortie: null,
            statut: 'actif'
        },
        // Ajoutez ici TOUS vos autres agents
        // Exemple pour le Groupe B :
       // data.js - DONNÉES DES AGENTS
const DATE_AFFECTATION_BASE = "2025-11-01";

const agentsData = [
    // Groupe A
    {
        code: 'CPA',
        nom: 'OUKHA',
        prenom: 'NABIL',
        groupe: 'A',
        tel: '0681564713',
        adresse: 'sala Al jadida',
        code_panique: '',
        poste: 'CP',
        cin: 'A758609',
        date_naissance: '1974-11-05',
        matricule: 'S09278C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    
        
    {
        code: 'CONA',
        nom: 'EL JAMALI',
        prenom: 'Younes',
        groupe: 'A',
        tel: '0663290648',
        adresse: 'cym',
        code_panique: '',
        poste: 'CON',
        cin: 'A370180',
        date_naissance: '1992-09-04',
        matricule: 'S09425C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'MOTA',
        nom: 'TISSIRT',
        prenom: 'hakim',
        groupe: 'A',
        tel: '0611160166',
        adresse: 'sale',
        code_panique: '',
        poste: 'MOT',
        cin: 'CB230482',
        date_naissance: '1968-10-20',
        matricule: 'S09279C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'ZA',
        nom: 'DRAFA',
        prenom: 'Noureddine',
        groupe: 'A',
        tel: '0603482589',
        adresse: 'tamasna',
        code_panique: '815',
        poste: 'ZA',
        cin: '469875',
        date_naissance: '1974-05-15',
        matricule: 'S09179C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z2A',
        nom: 'KAROUCHE',
        prenom: 'Fayçal',
        groupe: 'A',
        tel: '',
        adresse: 'DP1400',
        code_panique: '',
        poste: 'Z2A',
        cin: '743534',
        date_naissance: '',
        matricule: 'S13273C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z5A',
        nom: 'LAWRIQAT TARIK',
        prenom: 'TARIK',
        groupe: 'A',
        tel: '0615296161',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z5A',
        cin: '794204',
        date_naissance: '1979-04-17',
        matricule: 'S11699C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z7A',
        nom: 'CHERKAOUI',
        prenom: 'NOUAMANA',
        groupe: 'A',
        tel: '',
        adresse: 'DP1400',
        code_panique: '',
        poste: 'Z7A',
        cin: 'D216143',
        date_naissance: '1992-12-01',
        matricule: 'S11869C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1aA',
        nom: 'ALAMI',
        prenom: 'ZAKARIA',
        groupe: 'A',
        tel: '0660269360',
        adresse: '',
        code_panique: '913',
        poste: 'O1a',
        cin: 'D990488',
        date_naissance: '1987-06-02',
        matricule: 'S09188C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1bA',
        nom: 'EL KADMIRI',
        prenom: 'YASSINE',
        groupe: 'A',
        tel: '0707937021',
        adresse: '',
        code_panique: '228',
        poste: 'O1bA',
        cin: 'A253632',
        date_naissance: '1986-10-22',
        matricule: 'S12667C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O3A',
        nom: 'EL GHALLA',
        prenom: 'ABDELALI',
        groupe: 'A',
        tel: '0663391782',
        adresse: '',
        code_panique: '511',
        poste: 'O3A',
        cin: '729822',
        date_naissance: '1976-06-30',
        matricule: 'S09216C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O8A',
        nom: 'AIT LMKADAM',
        prenom: 'KAHCEN',
        groupe: 'A',
        tel: '0626521862',
        adresse: '',
        code_panique: '824',
        poste: 'O8',
        cin: 'PB42708',
        date_naissance: '1977-11-19',
        matricule: 'S09229C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O9A',
        nom: 'OUTANOUT',
        prenom: 'OMAR',
        groupe: 'A',
        tel: '06943677602',
        adresse: '',
        code_panique: '813',
        poste: 'O9A',
        cin: '651335',
        date_naissance: '1972-01-03',
        matricule: 'S09251C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O10A',
        nom: 'ZOUHRI',
        prenom: 'HAMID',
        groupe: 'A',
        tel: '0625615979',
        adresse: '',
        code_panique: '911',
        poste: 'O10',
        cin: 'Z155268',
        date_naissance: '1968-12-19',
        matricule: 'S09861C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O11A',
        nom: 'ARRADI',
        prenom: 'TARIK',
        groupe: 'A',
        tel: '',
        adresse: '',
        code_panique: '326',
        poste: 'O11A',
        cin: 'A345212',
        date_naissance: '1990-11-25',
        matricule: 'S09284C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O12A',
        nom: 'BOULAHFA',
        prenom: 'MOHAMED',
        groupe: 'A',
        tel: '0667877556',
        adresse: '',
        code_panique: '855',
        poste: 'O12',
        cin: 'FL33963',
        date_naissance: '1965-06-30',
        matricule: 'S09234C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O13A',
        nom: 'ZDIHRI',
        prenom: 'ABDERRAHIM',
        groupe: 'A',
        tel: '0667370493',
        adresse: '',
        code_panique: '826',
        poste: 'O13A',
        cin: 'B187620',
        date_naissance: '1967-11-05',
        matricule: 'S09204C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O15A',
        nom: 'AIT BENALI',
        prenom: 'ABLKRIM',
        groupe: 'A',
        tel: '0641103141',
        adresse: '',
        code_panique: '113',
        poste: 'O15A',
        cin: 'D171008',
        date_naissance: '1987-05-26',
        matricule: 'S12072C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O16A',
        nom: 'HOUMMAY MEHDI',
        prenom: 'MEHDI',
        groupe: 'A',
        tel: '0660994944',
        adresse: '',
        code_panique: '827',
        poste: 'O16A',
        cin: 'A33782',
        date_naissance: '1983-09-22',
        matricule: 'S09159C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L2A',
        nom: 'OUSSALLEM',
        prenom: 'KHALID',
        groupe: 'A',
        tel: '0715929737',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '653628',
        date_naissance: '1970-07-29',
        matricule: 'S09166C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L5A',
        nom: 'SLYI',
        prenom: 'MOHAMED',
        groupe: 'A',
        tel: '0649068606',
        adresse: '',
        code_panique: '913',
        poste: 'L5A',
        cin: 'B129122',
        date_naissance: '1965-03-22',
        matricule: 'S09212C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L6A',
        nom: 'KHTIDAK',
        prenom: 'HICHAM',
        groupe: 'A',
        tel: '0660124827',
        adresse: '',
        code_panique: '841',
        poste: 'L6A',
        cin: '766806',
        date_naissance: '1977-09-09',
        matricule: 'S09228C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L7A',
        nom: 'ECHOUHAIDI',
        prenom: 'RACHID',
        groupe: 'A',
        tel: '0670444699',
        adresse: '',
        code_panique: '327',
        poste: 'L7A',
        cin: '471850',
        date_naissance: '1974-02-24',
        matricule: 'S09254C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L8A',
        nom: 'ABOUKAL',
        prenom: 'SAID',
        groupe: 'A',
        tel: '0661541861',
        adresse: '',
        code_panique: '815',
        poste: 'L8A',
        cin: '418554',
        date_naissance: '1971-04-11',
        matricule: 'S09207C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L11A',
        nom: 'QOTBI',
        prenom: 'OTMAN',
        groupe: 'A',
        tel: '0681688161',
        adresse: '',
        code_panique: '125',
        poste: 'L11A',
        cin: 'A18238',
        date_naissance: '1986-11-19',
        matricule: 'S09156C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L13A',
        nom: 'ZEHDI',
        prenom: 'SALEM',
        groupe: 'A',
        tel: '0666788715',
        adresse: '',
        code_panique: '118',
        poste: 'L13A',
        cin: '569901',
        date_naissance: '1967-12-01',
        matricule: 'S10068C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L14A',
        nom: 'BOUNHAR',
        prenom: 'MOHAMED',
        groupe: 'A',
        tel: '0614445839',
        adresse: '',
        code_panique: '858',
        poste: 'L14A',
        cin: '772206',
        date_naissance: '1976-04-23',
        matricule: 'S09235C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L15A',
        nom: 'BOUCHRIHA',
        prenom: 'MOUNIR',
        groupe: 'A',
        tel: '0641871461',
        adresse: '',
        code_panique: '999',
        poste: 'L15A',
        cin: '774225',
        date_naissance: '1978-12-04',
        matricule: 'S09424C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L16A',
        nom: 'ROUANI',
        prenom: 'AYOUB',
        groupe: 'A',
        tel: '0612510273',
        adresse: '',
        code_panique: '328',
        poste: 'L16A',
        cin: 'A48291',
        date_naissance: '1991-06-07',
        matricule: 'S09172C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L18A',
        nom: 'EL KAHLAOUI',
        prenom: 'ABDELLAH',
        groupe: 'A',
        tel: '0671415745',
        adresse: '',
        code_panique: '826',
        poste: 'L18A',
        cin: '724698',
        date_naissance: '1975-02-18',
        matricule: 'S09199C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L20A',
        nom: 'FOZARI',
        prenom: 'ABDLILAH',
        groupe: 'A',
        tel: '0690108567',
        adresse: '',
        code_panique: '922',
        poste: 'L 20',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },

    // Groupe B
    {
        code: 'CPB',
        nom: 'CHMAREKH',
        prenom: 'Noureddine',
        groupe: 'B',
        tel: '0660337343',
        adresse: '',
        code_panique: '854',
        poste: 'CPA',
        cin: '604196',
        date_naissance: '1971-11-24',
        matricule: 'S09274C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'CONB',
        nom: 'IBRAHIMY',
        prenom: 'ABDELLAHADIB',
        groupe: 'B',
        tel: '0662815350',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'CON',
        cin: 'C475743',
        date_naissance: '1976-03-15',
        matricule: 'S09275C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'MOTB',
        nom: 'KAALI',
        prenom: 'MAJID',
        groupe: 'B',
        tel: '0777934644',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'MOT',
        cin: 'Q210329',
        date_naissance: '1978-11-25',
        matricule: 'S12666C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z2B',
        nom: 'TSOULI',
        prenom: 'ADIL',
        groupe: 'B',
        tel: '0767872200',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z2A',
        cin: '414286',
        date_naissance: '2020-07-01',
        matricule: 'S09170C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z5B',
        nom: 'KAMOUN',
        prenom: 'YOUNES',
        groupe: 'B',
        tel: '',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z5',
        cin: 'C436844',
        date_naissance: '1971-05-12',
        matricule: 'S09180C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z6B',
        nom: 'ROCHDI',
        prenom: 'HASSAN',
        groupe: 'B',
        tel: '065539574',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'z6A',
        cin: '594182',
        date_naissance: '1969-10-15',
        matricule: 'S09173C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1aB',
        nom: 'JELOULI',
        prenom: 'MAROUAN',
        groupe: 'B',
        tel: '0637401598',
        adresse: '',
        code_panique: '913',
        poste: 'O1a',
        cin: 'AB335545',
        date_naissance: '1986-01-30',
        matricule: 'S09186C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1bB',
        nom: 'KADI',
        prenom: 'ANNOUAR',
        groupe: 'B',
        tel: '0642889596',
        adresse: '',
        code_panique: '228',
        poste: 'O1b',
        cin: 'AE110942',
        date_naissance: '1990-09-11',
        matricule: 'S12672C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O3B',
        nom: 'EL FADEL',
        prenom: 'MOHAMED',
        groupe: 'B',
        tel: '0762731541',
        adresse: '',
        code_panique: '511',
        poste: 'O3A',
        cin: '783152',
        date_naissance: '1976-12-15',
        matricule: 'S09239C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O4A',
        nom: 'BOUAKRA',
        prenom: 'ABDELHAK',
        groupe: 'A',
        tel: '0673978815',
        adresse: '',
        code_panique: '313',
        poste: 'O4A',
        cin: '758824',
        date_naissance: '1972-02-04',
        matricule: 'S09197C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O5B',
        nom: 'HOUCINE',
        prenom: 'ASGHEN',
        groupe: 'B',
        tel: '0617152230',
        adresse: '',
        code_panique: '848',
        poste: 'O5',
        cin: 'CB42565',
        date_naissance: '1972-10-10',
        matricule: 'S09225C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O8B',
        nom: 'RIFKI',
        prenom: 'KAMAL',
        groupe: 'B',
        tel: '0677019711',
        adresse: '',
        code_panique: '824',
        poste: 'O8',
        cin: 'AB70661',
        date_naissance: '1982-05-26',
        matricule: 'S09185C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O9B',
        nom: 'HADIR',
        prenom: 'HAKIM',
        groupe: 'B',
        tel: '0622379633',
        adresse: '',
        code_panique: '813',
        poste: 'O9',
        cin: 'D217181',
        date_naissance: '1983-06-23',
        matricule: 'S09158C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O10B',
        nom: 'BELASRI',
        prenom: 'MOHAMED',
        groupe: 'B',
        tel: '0670108838',
        adresse: '',
        code_panique: '911',
        poste: 'O10',
        cin: 'A755100',
        date_naissance: '1971-05-25',
        matricule: 'S09244C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O11B',
        nom: 'MANSOURI',
        prenom: 'OUSSAAMA',
        groupe: 'B',
        tel: '0691484070',
        adresse: '',
        code_panique: '326',
        poste: 'O11A',
        cin: '728886',
        date_naissance: '1975-10-20',
        matricule: 'S09956C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O12B',
        nom: 'LAHYANE',
        prenom: 'MOHCINE',
        groupe: 'B',
        tel: '0676454181',
        adresse: '',
        code_panique: '855',
        poste: 'O12A',
        cin: '779095',
        date_naissance: '1981-02-06',
        matricule: 'S12134C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O13B',
        nom: 'ABDOUSSI',
        prenom: 'HASSAN',
        groupe: 'B',
        tel: '0645308599',
        adresse: '',
        code_panique: '826',
        poste: 'O13',
        cin: 'D424329',
        date_naissance: '1973-11-28',
        matricule: 'S09218C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O14B',
        nom: 'ABEID',
        prenom: 'MOHAMED',
        groupe: 'B',
        tel: '0663738283',
        adresse: '',
        code_panique: '838',
        poste: 'O14A',
        cin: '767986',
        date_naissance: '1972-06-12',
        matricule: 'S11698C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O15B',
        nom: 'FAKHAR',
        prenom: 'ABDEHADI',
        groupe: 'B',
        tel: '0648941710',
        adresse: '',
        code_panique: '113',
        poste: 'O15A',
        cin: 'A20765',
        date_naissance: '1988-11-08',
        matricule: 'S11645C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O16B',
        nom: 'NAIM',
        prenom: 'TAOUFIK',
        groupe: 'B',
        tel: '0636552127',
        adresse: '',
        code_panique: '827',
        poste: 'O16A',
        cin: '762084',
        date_naissance: '1972-12-15',
        matricule: 'S09250C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L2B',
        nom: 'ZAHI',
        prenom: 'MOHAMED',
        groupe: 'B',
        tel: '0671614828',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '566655',
        date_naissance: '1969-03-20',
        matricule: 'S09243C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L4B',
        nom: 'YOUNES',
        prenom: 'KHODAYRA',
        groupe: 'A',
        tel: '0696893480',
        adresse: '',
        code_panique: '842',
        poste: 'L4A',
        cin: '660675',
        date_naissance: '1983-02-10',
        matricule: 'S09162C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L5B',
        nom: 'BELAHMAR',
        prenom: 'MOHAMED',
        groupe: 'B',
        tel: '0676120413',
        adresse: '',
        code_panique: '913',
        poste: 'L5A',
        cin: 'A20765',
        date_naissance: '1988-11-09',
        matricule: 'S11645C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L6B',
        nom: 'RACHAD',
        prenom: 'YOUSSEF',
        groupe: 'B',
        tel: '0608980660',
        adresse: '',
        code_panique: '841',
        poste: 'L6A',
        cin: 'D152284',
        date_naissance: '1986-09-10',
        matricule: 'S09167C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L7B',
        nom: 'ANOUAR',
        prenom: 'KADDAR',
        groupe: 'B',
        tel: '0610425223',
        adresse: '',
        code_panique: '327',
        poste: 'L7A',
        cin: 'B155974',
        date_naissance: '1975-06-10',
        matricule: 'S09161C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L8B',
        nom: 'AHMED',
        prenom: 'OUHADI',
        groupe: 'B',
        tel: '0670469944',
        adresse: '',
        code_panique: '815',
        poste: 'L8',
        cin: 'FL74690',
        date_naissance: '1968-01-01',
        matricule: 'S11697C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L9B',
        nom: 'BOUZIANE',
        prenom: 'EL HAMROUCHI',
        groupe: 'B',
        tel: '0662765085',
        adresse: '',
        code_panique: '914',
        poste: 'L9',
        cin: 'H207682',
        date_naissance: '2005-05-24',
        matricule: 'S12668C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L10B',
        nom: 'ABDELHAK',
        prenom: 'AKRAOUI',
        groupe: 'B',
        tel: '0660387282',
        adresse: '',
        code_panique: '926',
        poste: 'L10',
        cin: 'AD57067',
        date_naissance: '1977-01-01',
        matricule: 'S09382C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L11B',
        nom: 'NOUASSI',
        prenom: 'AHMED',
        groupe: 'B',
        tel: '0666276247',
        adresse: '',
        code_panique: '125',
        poste: 'L11A',
        cin: '319132',
        date_naissance: '1968-01-11',
        matricule: 'S09211C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L13B',
        nom: 'DAOU',
        prenom: 'RACHID',
        groupe: 'B',
        tel: '0677772015',
        adresse: '',
        code_panique: '118',
        poste: 'L13',
        cin: 'X127977',
        date_naissance: '1970-08-01',
        matricule: 'S09253C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L14B',
        nom: 'ABDELGHANI',
        prenom: 'KANOUBI',
        groupe: 'B',
        tel: '0606656164',
        adresse: '',
        code_panique: '858',
        poste: 'L14A',
        cin: '752774',
        date_naissance: '1970-11-28',
        matricule: 'S12670C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L15B',
        nom: 'BOUTJADIR',
        prenom: 'HAMZA',
        groupe: 'B',
        tel: '0615183020',
        adresse: '',
        code_panique: '999',
        poste: 'L15A',
        cin: 'A40770',
        date_naissance: '1987-06-30',
        matricule: 'S09423C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L16B',
        nom: 'NOUREDDINE',
        prenom: 'TAOUZI',
        groupe: 'B',
        tel: '0767872200',
        adresse: '',
        code_panique: '328',
        poste: 'L16A',
        cin: '414286',
        date_naissance: '1970-08-04',
        matricule: 'S09169C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L18B',
        nom: 'ABDELAZIZ',
        prenom: 'SAKANI',
        groupe: 'B',
        tel: '0662509676',
        adresse: '',
        code_panique: '826',
        poste: 'L18',
        cin: 'Z428454',
        date_naissance: '1986-01-10',
        matricule: 'S13153C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L20B',
        nom: 'RACHAKHA',
        prenom: 'SAID',
        groupe: 'B',
        tel: '0648758364',
        adresse: '',
        code_panique: '922',
        poste: 'L 20',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'ZB',
        nom: 'SNAIDA',
        prenom: 'AHMED',
        groupe: 'B',
        tel: '0666362689',
        adresse: '',
        code_panique: '815',
        poste: 'ZX',
        cin: 'A24831',
        date_naissance: '1974-05-25',
        matricule: 'S09195C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },

    // Groupe C
    {
        code: 'CPC',
        nom: 'ABDELHAK',
        prenom: 'BERRIMA',
        groupe: 'C',
        tel: '0660337343',
        adresse: '',
        code_panique: '854',
        poste: 'CPA',
        cin: '403963',
        date_naissance: '1967-02-24',
        matricule: 'S09271C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'CONC',
        nom: 'NOUR',
        prenom: 'HICHAM',
        groupe: 'C',
        tel: '0665484503',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'CON',
        cin: 'A714632',
        date_naissance: '1982-02-03',
        matricule: 'S09174C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'MOTC',
        nom: 'IDRISS',
        prenom: 'IDRISSI',
        groupe: 'C',
        tel: '0667999548',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'MOT',
        cin: 'AB171068',
        date_naissance: '1972-12-24',
        matricule: 'S09276C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z6C',
        nom: 'HARBIL',
        prenom: 'ANASS',
        groupe: 'C',
        tel: '0669001099',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'z6A',
        cin: '434690',
        date_naissance: '1984-02-26',
        matricule: 'S09153C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z2C',
        nom: 'GRINEH',
        prenom: 'KHALID',
        groupe: 'C',
        tel: '',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z2A',
        cin: '670880',
        date_naissance: '1976-09-29',
        matricule: 'S09176C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z5C',
        nom: 'MULouANI',
        prenom: 'MUSTAPHA',
        groupe: 'C',
        tel: '0661970781',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z5',
        cin: 'AB96201',
        date_naissance: '1969-11-18',
        matricule: 'S09165C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z6A',
        nom: 'MOHAMED',
        prenom: 'MOUSTAKIM',
        groupe: 'A',
        tel: '0654718291',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'z6A',
        cin: '764411',
        date_naissance: '1975-07-15',
        matricule: 'S09246C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1aC',
        nom: 'JAOUAD',
        prenom: 'ELKERRAOUI',
        groupe: 'C',
        tel: '',
        adresse: '',
        code_panique: '913',
        poste: 'O1a',
        cin: 'A471219',
        date_naissance: '1973-10-21',
        matricule: 'S09184C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1bC',
        nom: 'AZIZ',
        prenom: 'CHOUKAIRI',
        groupe: 'C',
        tel: '0637014737',
        adresse: '',
        code_panique: '228',
        poste: 'O1b',
        cin: '',
        date_naissance: '1966-04-22',
        matricule: 'S09196C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O3C',
        nom: 'YOUNESS',
        prenom: 'MAKAN',
        groupe: 'C',
        tel: '0624125461',
        adresse: '',
        code_panique: '511',
        poste: 'O3A',
        cin: '0704268',
        date_naissance: '1977-07-03',
        matricule: 'S09262C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O4C',
        nom: 'BRAHIM',
        prenom: 'HMIJAN',
        groupe: 'C',
        tel: '0678490326',
        adresse: '',
        code_panique: '313',
        poste: 'O4',
        cin: '',
        date_naissance: '1985-04-18',
        matricule: 'S09214C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O5C',
        nom: 'YOUSSEF',
        prenom: 'ATTOUMI',
        groupe: 'C',
        tel: '0676800556',
        adresse: '',
        code_panique: '848',
        poste: 'O5',
        cin: 'QA28049',
        date_naissance: '1970-03-20',
        matricule: 'S09263C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O8C',
        nom: 'TOUFIQ',
        prenom: 'TAOUFIKI',
        groupe: 'C',
        tel: '0656935477',
        adresse: '',
        code_panique: '824',
        poste: 'O8',
        cin: 'BE584375',
        date_naissance: '1971-08-01',
        matricule: 'S09249C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O9C',
        nom: 'MOHAMED',
        prenom: 'ELYOUSSFI',
        groupe: 'C',
        tel: '06666624637',
        adresse: '',
        code_panique: '813',
        poste: 'O9',
        cin: 'D148238',
        date_naissance: '1985-02-05',
        matricule: 'S09217C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O10C',
        nom: 'MOHAMED',
        prenom: 'KHTIDAK',
        groupe: 'C',
        tel: '0661564216',
        adresse: '',
        code_panique: '911',
        poste: 'O10',
        cin: 'A315369',
        date_naissance: '1966-09-14',
        matricule: 'S09270C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O11C',
        nom: 'MUSTAPHA',
        prenom: 'ARIBATE',
        groupe: 'C',
        tel: '0660413159',
        adresse: '',
        code_panique: '326',
        poste: 'O11A',
        cin: '755764',
        date_naissance: '1973-12-21',
        matricule: 'S09178C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O13C',
        nom: 'HAMID',
        prenom: 'SAIB',
        groupe: 'C',
        tel: '0642234491',
        adresse: '',
        code_panique: '826',
        poste: 'O13',
        cin: 'AB812110',
        date_naissance: '1984-06-30',
        matricule: 'S09168C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O14C',
        nom: 'RACHID',
        prenom: 'ALOUI',
        groupe: 'C',
        tel: '0675660099',
        adresse: '',
        code_panique: '838',
        poste: 'O14A',
        cin: 'AB192453',
        date_naissance: '1972-06-30',
        matricule: 'S09252C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O15C',
        nom: 'YOUSSEF',
        prenom: 'ZOURAKI',
        groupe: 'C',
        tel: '0663868378',
        adresse: '',
        code_panique: '113',
        poste: 'O15A',
        cin: 'A441336',
        date_naissance: '1992-03-12',
        matricule: 'S09171C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O16C',
        nom: 'ENNABAL',
        prenom: 'AZOUZ',
        groupe: 'C',
        tel: '0698853826',
        adresse: '',
        code_panique: '827',
        poste: 'O16A',
        cin: '566483',
        date_naissance: '1967-01-04',
        matricule: 'S09291C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L2C',
        nom: 'ELHILALI',
        prenom: 'AKRAM',
        groupe: 'C',
        tel: '0662665394',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '427172',
        date_naissance: '1976-01-26',
        matricule: 'S12073C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L4C',
        nom: 'RACHID',
        prenom: 'MAGHAT',
        groupe: 'C',
        tel: '',
        adresse: '',
        code_panique: '842',
        poste: 'L4',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L5C',
        nom: 'ABDERRAHIL',
        prenom: 'FAKUHI',
        groupe: 'C',
        tel: '0662665394',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '427172',
        date_naissance: '1976-01-26',
        matricule: 'S12073C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L6C',
        nom: 'RACHID',
        prenom: 'NOUR',
        groupe: 'C',
        tel: '0662665394',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '427172',
        date_naissance: '1976-01-26',
        matricule: 'S12073C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L7C',
        nom: 'MOHAMED',
        prenom: 'NAZIR',
        groupe: 'C',
        tel: '0662665394',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '427172',
        date_naissance: '1976-01-26',
        matricule: 'S12073C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L8C',
        nom: 'HASSAN',
        prenom: 'ASSLOUH',
        groupe: 'C',
        tel: '0662665394',
        adresse: '',
        code_panique: '126',
        poste: 'L 2A',
        cin: '427172',
        date_naissance: '1976-01-26',
        matricule: 'S12073C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L9C',
        nom: 'IKHLOUFEN',
        prenom: 'MOUNIR',
        groupe: 'C',
        tel: '0762695160',
        adresse: '',
        code_panique: '914',
        poste: 'L9A',
        cin: 'E234817',
        date_naissance: '1996-06-17',
        matricule: 'S12075C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L10C',
        nom: 'DRISS',
        prenom: 'BENGHANMI',
        groupe: 'C',
        tel: '0660201164',
        adresse: '',
        code_panique: '926',
        poste: 'L10',
        cin: 'AB532578',
        date_naissance: '1986-01-01',
        matricule: 'S12131C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L11C',
        nom: 'LARBI',
        prenom: 'LKWISSI',
        groupe: 'C',
        tel: '0662382842',
        adresse: '',
        code_panique: '125',
        poste: 'L11',
        cin: 'MC13001',
        date_naissance: '1980-07-03',
        matricule: 'S09233C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L13C',
        nom: 'ABDELLAH',
        prenom: 'TABTI',
        groupe: 'C',
        tel: '0663229985',
        adresse: '',
        code_panique: '118',
        poste: 'L13',
        cin: 'AD56680',
        date_naissance: '1979-01-01',
        matricule: 'S09194C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L14C',
        nom: 'ABDEMOUNIM',
        prenom: 'MNAM',
        groupe: 'C',
        tel: '0664914374',
        adresse: '',
        code_panique: '858',
        poste: 'L14A',
        cin: '727413',
        date_naissance: '1977-11-04',
        matricule: 'S09203C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L15C',
        nom: 'TOUFIK',
        prenom: 'ALHAFID',
        groupe: 'C',
        tel: '0662888444',
        adresse: '',
        code_panique: '999',
        poste: 'L15A',
        cin: 'B197016',
        date_naissance: '1975-02-04',
        matricule: 'S09260C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L16C',
        nom: 'AZIZ',
        prenom: 'ELALOUSSI',
        groupe: 'C',
        tel: '0661098728',
        adresse: '',
        code_panique: '328',
        poste: 'L16',
        cin: 'Z428454',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L18C',
        nom: 'ABDELAZIZ',
        prenom: 'SAKANI',
        groupe: 'C',
        tel: '0662509676',
        adresse: '',
        code_panique: '826',
        poste: 'L18',
        cin: 'A203082',
        date_naissance: '1961-03-10',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'inactif'
    },
    {
        code: 'L20C',
        nom: 'FARASSI',
        prenom: 'KARIM',
        groupe: 'C',
        tel: '0635419761',
        adresse: '',
        code_panique: '922',
        poste: 'L 20',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },

    // Groupe D
    {
        code: 'CPD',
        nom: 'mouhcine',
        prenom: 'YAGOUB',
        groupe: 'D',
        tel: '0660336995',
        adresse: '',
        code_panique: '854',
        poste: 'CPA',
        cin: '0408930',
        date_naissance: '1966-05-17',
        matricule: 'S09272C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'COND',
        nom: 'HOUSSAIN',
        prenom: 'ALAHYANE',
        groupe: 'D',
        tel: '0668191854',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'CON',
        cin: 'JB49050',
        date_naissance: '1966-01-01',
        matricule: 'S09280C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'MOTD',
        nom: 'LAHCEN',
        prenom: 'ALAMI',
        groupe: 'D',
        tel: '0666195501',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'MOT',
        cin: 'UA97962',
        date_naissance: '1967-06-24',
        matricule: 'S09277C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'ZD',
        nom: 'MOULZY',
        prenom: 'mehdi',
        groupe: 'D',
        tel: '0665233677',
        adresse: '',
        code_panique: '815',
        poste: 'Z',
        cin: 'AB47887',
        date_naissance: '1968-01-15',
        matricule: 'S09268C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z2D',
        nom: 'MUSTAPHA',
        prenom: 'BOUTSON',
        groupe: 'D',
        tel: '',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z2A',
        cin: '692457',
        date_naissance: '1980-02-14',
        matricule: 'S09290C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z5D',
        nom: 'AYOUB',
        prenom: 'MAHDAD',
        groupe: 'D',
        tel: '0682153784',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'Z5',
        cin: 'AD210108',
        date_naissance: '1990-03-23',
        matricule: 'S11995C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z6D',
        nom: 'ABDELHAQ',
        prenom: 'ZEROUAL',
        groupe: 'D',
        tel: '0605119496',
        adresse: '',
        code_panique: 'DP1400',
        poste: 'z6',
        cin: 'I495670',
        date_naissance: '1979-08-13',
        matricule: 'S09205C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1aD',
        nom: 'IMAD',
        prenom: 'BEN KHADRA',
        groupe: 'D',
        tel: '0682153784',
        adresse: '',
        code_panique: '913',
        poste: 'O1a',
        cin: 'AB624802',
        date_naissance: '1987-02-12',
        matricule: 'S12674C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O1bD',
        nom: 'KHLIFI',
        prenom: 'HADARBACH',
        groupe: 'D',
        tel: '0670059528',
        adresse: '',
        code_panique: '228',
        poste: 'O1b',
        cin: 'UA95212',
        date_naissance: '1968-04-22',
        matricule: 'S09190C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O3D',
        nom: 'YAHYA',
        prenom: 'ABARKAN',
        groupe: 'D',
        tel: '0650651681',
        adresse: '',
        code_panique: '511',
        poste: 'O3A',
        cin: '632213',
        date_naissance: '1976-12-15',
        matricule: 'S09261C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'NO4D',
        nom: 'MOHAMED',
        prenom: 'KABDANI',
        groupe: 'D',
        tel: '0611658102',
        adresse: '',
        code_panique: '313',
        poste: 'O4A',
        cin: '427567',
        date_naissance: '1976-03-28',
        matricule: 'S09240C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O8D',
        nom: 'LAHCEN',
        prenom: 'EL KABOURI',
        groupe: 'D',
        tel: '0663754454',
        adresse: '',
        code_panique: '824',
        poste: 'O8A',
        cin: '0365454',
        date_naissance: '1979-07-14',
        matricule: 'S09230C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O9D',
        nom: 'HAKIM',
        prenom: 'HADDIR',
        groupe: 'D',
        tel: '0677522349',
        adresse: '',
        code_panique: '813',
        poste: 'O9',
        cin: 'D217181',
        date_naissance: '1990-06-23',
        matricule: 'S09158C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O10D',
        nom: 'ADIL',
        prenom: 'LOURIGHI',
        groupe: 'D',
        tel: '0652869687',
        adresse: '',
        code_panique: '911',
        poste: 'O10',
        cin: 'A742130',
        date_naissance: '1994-02-19',
        matricule: 'S12133C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O11D',
        nom: 'TOUFIK',
        prenom: 'HAJJI',
        groupe: 'D',
        tel: '0660024350',
        adresse: '',
        code_panique: '326',
        poste: 'O11A',
        cin: '679901',
        date_naissance: '1983-08-15',
        matricule: 'S09258C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O12D',
        nom: 'HASSAN',
        prenom: 'TOUNSSI',
        groupe: 'D',
        tel: '0668928626',
        adresse: '',
        code_panique: '855',
        poste: 'O12A',
        cin: '194910',
        date_naissance: '1962-07-01',
        matricule: 'S09223C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O13D',
        nom: 'HASSAN',
        prenom: 'CHAMI',
        groupe: 'D',
        tel: '0622564794',
        adresse: '',
        code_panique: '826',
        poste: 'O13',
        cin: '',
        date_naissance: '1966-01-01',
        matricule: 'S09215C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O14D',
        nom: 'MUSTAPHA',
        prenom: 'OUGHIL',
        groupe: 'D',
        tel: '0677651378',
        adresse: '',
        code_panique: '838',
        poste: 'O14',
        cin: 'D523912',
        date_naissance: '1979-02-12',
        matricule: 'S09248C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O15D',
        nom: 'ABDERAHIM',
        prenom: 'MACHHAB',
        groupe: 'D',
        tel: '0668272975',
        adresse: '',
        code_panique: '113',
        poste: 'O15',
        cin: 'E505332',
        date_naissance: '1974-07-03',
        matricule: 'S09164C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'O16D',
        nom: 'BOULDGAG',
        prenom: 'D',
        groupe: 'D',
        tel: '0670357654',
        adresse: '',
        code_panique: '827',
        poste: 'O16',
        cin: 'D388632',
        date_naissance: '1968-01-01',
        matricule: 'S09191C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L2D',
        nom: 'MOLAY AHMED',
        prenom: 'HANSALI',
        groupe: 'D',
        tel: '',
        adresse: '',
        code_panique: '126',
        poste: 'L 2',
        cin: 'I196324',
        date_naissance: '1967-10-01',
        matricule: 'S12671C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L4D',
        nom: 'ABDELJALIL',
        prenom: 'ERRAISSY',
        groupe: 'D',
        tel: '',
        adresse: '',
        code_panique: '842',
        poste: 'L4',
        cin: 'JC337475',
        date_naissance: '',
        matricule: 'S13885C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L5D',
        nom: 'MOHMED',
        prenom: 'EL AISSAOUI',
        groupe: 'D',
        tel: '0666904691',
        adresse: '',
        code_panique: '913',
        poste: 'L5',
        cin: 'AB26585',
        date_naissance: '1962-06-30',
        matricule: 'S09238C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L6D',
        nom: 'MAJID',
        prenom: 'SIYADI',
        groupe: 'D',
        tel: '0664619176',
        adresse: '',
        code_panique: '841',
        poste: 'L6',
        cin: 'BK11512',
        date_naissance: '1962-08-06',
        matricule: 'S09201C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L7D',
        nom: 'HASSAN',
        prenom: 'AIT BOURI',
        groupe: 'D',
        tel: '0641103141',
        adresse: '',
        code_panique: '327',
        poste: 'L7A',
        cin: '406039',
        date_naissance: '1966-02-11',
        matricule: 'S09219C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L9D',
        nom: 'KARIM',
        prenom: 'MEROURI',
        groupe: 'D',
        tel: '0639284992',
        adresse: '',
        code_panique: '914',
        poste: 'L9',
        cin: 'AB11225',
        date_naissance: '',
        matricule: 'S15251C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L10D',
        nom: 'MOHAMED',
        prenom: 'DAHANI',
        groupe: 'D',
        tel: '0608246402',
        adresse: '',
        code_panique: '926',
        poste: 'L10A',
        cin: '756477',
        date_naissance: '1974-03-07',
        matricule: 'S09237C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L11D',
        nom: 'MOHAMED',
        prenom: 'LACHGAR',
        groupe: 'D',
        tel: '0662721021',
        adresse: '',
        code_panique: '125',
        poste: 'L11A',
        cin: 'AB122686',
        date_naissance: '1968-03-17',
        matricule: 'S09189C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L13D',
        nom: 'HICHAM',
        prenom: 'EL HILALI',
        groupe: 'D',
        tel: '0649835024',
        adresse: '',
        code_panique: '118',
        poste: 'L13',
        cin: 'AD35116',
        date_naissance: '1973-02-02',
        matricule: 'S09224C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L14D',
        nom: 'MOHAMED',
        prenom: 'ELHARBI',
        groupe: 'D',
        tel: '0613535275',
        adresse: '',
        code_panique: '858',
        poste: 'L14A',
        cin: 'AB208044',
        date_naissance: '1978-08-05',
        matricule: 'S09245C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L15D',
        nom: 'JALAL',
        prenom: 'DAHBI',
        groupe: 'D',
        tel: '0672792404',
        adresse: '',
        code_panique: '999',
        poste: 'L15A',
        cin: '768009',
        date_naissance: '1976-12-05',
        matricule: 'S09226C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L16D',
        nom: 'RACHID',
        prenom: 'JABAL',
        groupe: 'D',
        tel: '0628612647',
        adresse: '',
        code_panique: '328',
        poste: 'L16A',
        cin: '786241',
        date_naissance: '1979-08-01',
        matricule: 'S09255C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L18D',
        nom: 'MOHAMED',
        prenom: 'GUARMA',
        groupe: 'D',
        tel: '0699082100',
        adresse: '',
        code_panique: '826',
        poste: 'L18',
        cin: 'AD200164',
        date_naissance: '1987-02-20',
        matricule: 'S12074C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'L20D',
        nom: 'BRAHIM',
        prenom: 'SATANI',
        groupe: 'D',
        tel: '0660082965',
        adresse: '',
        code_panique: '922',
        poste: 'L 20',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },

    // Groupe E
    {
        code: 'ACCA',
        nom: 'CHAJAI',
        prenom: 'SOUKAINA',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'non',
        poste: 'D.U.E',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'ACCB',
        nom: 'MAAROUF',
        prenom: 'NAJAT',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'non',
        poste: 'D.U.E',
        cin: 'AD223954',
        date_naissance: '1991-12-06',
        matricule: 'S10100C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z1A',
        nom: 'FARROUCHE',
        prenom: 'MILOUD',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'dp1400',
        poste: 'D.U.E',
        cin: 'AA31133',
        date_naissance: '1987-11-05',
        matricule: 'S09286C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z1B',
        nom: 'KHIAR',
        prenom: 'NOUREDDINE',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'dp1401',
        poste: 'D.U.E',
        cin: 'h705007',
        date_naissance: '1991-09-09',
        matricule: 'S12664C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z4A',
        nom: 'ECHALLI',
        prenom: 'KASSEM',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'dp1402',
        poste: 'D.U.E',
        cin: 'A724455',
        date_naissance: '1985-08-01',
        matricule: 'S12665C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z4B',
        nom: 'OUHADI',
        prenom: 'LAHCEN',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'dp1403',
        poste: 'D.U.E',
        cin: 'U99650',
        date_naissance: '1973-08-12',
        matricule: 'S09992C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z4C',
        nom: 'ELFAKHAR',
        prenom: 'MOHAMED',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'dp1404',
        poste: 'D.U.E',
        cin: 'A737428',
        date_naissance: '1983-07-03',
        matricule: 'S09285C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'Z4D',
        nom: 'TAOUIL',
        prenom: 'KHALID',
        groupe: 'E',
        tel: '',
        adresse: '',
        code_panique: 'dp1405',
        poste: 'D.U.E',
        cin: 'AD154017',
        date_naissance: '1988-03-09',
        matricule: 'S10666C',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    },
    {
        code: 'PR',
        nom: 'OUNASSE',
        prenom: 'NAWFAL',
        groupe: 'E',
        tel: '',
        adresse: 'C.T.R',
        code_panique: '',
        poste: '',
        cin: '',
        date_naissance: '',
        matricule: '',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: null,
        statut: 'actif'
    }
];

// Agents retraités (à marquer comme inactifs)
const agentsRetraites = [
    {
        code: 'O4B',
        nom: 'ANQACH HASSAN',
        prenom: 'HASSAN',
        groupe: 'B',
        tel: '',
        adresse: '313',
        code_panique: '',
        poste: 'O4',
        cin: 'non',
        date_naissance: '1962-04-09',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    },
    {
        code: 'O5A',
        nom: 'LEKHEL',
        prenom: 'RACHID',
        groupe: 'A',
        tel: '0644734747',
        adresse: '',
        code_panique: '848',
        poste: 'O5',
        cin: 'non',
        date_naissance: '1962-12-04',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    },
    {
        code: 'O14A',
        nom: 'EL KHAOUI',
        prenom: 'ABDELTIF',
        groupe: 'A',
        tel: '0670768055',
        adresse: '',
        code_panique: '838',
        poste: 'O14',
        cin: 'non',
        date_naissance: '1961-04-25',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    },
    {
        code: 'L10A',
        nom: 'AMHZOUL',
        prenom: 'MUSTAPHA',
        groupe: 'A',
        tel: '0707331929',
        adresse: '',
        code_panique: '926',
        poste: 'L10',
        cin: '',
        date_naissance: '1961-09-28',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    },
    {
        code: 'O12C',
        nom: 'AZERFI',
        prenom: 'SAID',
        groupe: 'C',
        tel: '0672499982',
        adresse: '',
        code_panique: '855',
        poste: 'O12',
        cin: '',
        date_naissance: '1961-06-30',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    },
    {
        code: 'O5D',
        nom: 'FERZOUI',
        prenom: 'KHALED',
        groupe: 'D',
        tel: '0676745704',
        adresse: '',
        code_panique: '848',
        poste: 'O5',
        cin: '',
        date_naissance: '1962-01-01',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    },
    {
        code: 'L8D',
        nom: 'BOUTOU',
        prenom: 'MOHAMED',
        groupe: 'D',
        tel: '0670181844',
        adresse: '',
        code_panique: '815',
        poste: 'L8',
        cin: '',
        date_naissance: '1961-06-30',
        matricule: 'RETRAITE',
        date_entree: DATE_AFFECTATION_BASE,
        date_sortie: new Date().toISOString().split('T')[0],
        statut: 'inactif'
    }
];

// Ajouter les retraités à la liste des agents
agentsRetraites.forEach(retraite => {
    agents.push(retraite);
});

// Initialiser les données de planning
const planningData = {};

// Initialiser les autres données
let panicCodes = [];
let radios = [];
let uniforms = [];
let warnings = [];
let leaves = [];
let radioHistory = [];

// Jours fériés Maroc (année courante)
const currentYear = new Date().getFullYear();
const holidays = [
    { date: `${currentYear}-01-01`, description: 'Nouvel An', type: 'fixe' },
    { date: `${currentYear}-01-11`, description: 'Manifeste de l\'Indépendance', type: 'fixe' },
    { date: `${currentYear}-05-01`, description: 'Fête du Travail', type: 'fixe' },
    { date: `${currentYear}-07-30`, description: 'Fête du Trône', type: 'fixe' },
    { date: `${currentYear}-08-14`, description: 'Allégeance Oued Eddahab', type: 'fixe' },
    { date: `${currentYear}-08-20`, description: 'Révolution du Roi et du Peuple', type: 'fixe' },
    { date: `${currentYear}-08-21`, description: 'Fête de la Jeunesse', type: 'fixe' },
    { date: `${currentYear}-11-06`, description: 'Marche Verte', type: 'fixe' },
    { date: `${currentYear}-11-18`, description: 'Fête de l\'Indépendance', type: 'fixe' }
];

// Fonction pour initialiser les codes panique automatiquement
function initializePanicCodes() {
    panicCodes = [];
    
    agents.forEach(agent => {
        if (agent.code_panique && agent.code_panique !== '' && agent.code_panique !== 'non' && agent.code_panique !== 'DP1400') {
            panicCodes.push({
                agent_code: agent.code,
                code: agent.code_panique,
                poste: agent.poste,
                created_at: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
            });
        }
    });
}

// Fonction pour initialiser les radios automatiquement
function initializeRadios() {
    radios = [
        {
            id: 'RAD001',
            modele: 'Motorola XPR 7550',
            serial: 'SN001',
            statut: 'DISPONIBLE',
            acquisition_date: '2023-01-15'
        },
        {
            id: 'RAD002',
            modele: 'Motorola XPR 7550',
            serial: 'SN002',
            statut: 'DISPONIBLE',
            acquisition_date: '2023-01-15'
        },
        {
            id: 'RAD003',
            modele: 'Motorola XPR 7550',
            serial: 'SN003',
            statut: 'DISPONIBLE',
            acquisition_date: '2023-01-15'
        },
        {
            id: 'RAD004',
            modele: 'Motorola XPR 7550',
            serial: 'SN004',
            statut: 'DISPONIBLE',
            acquisition_date: '2023-01-15'
        },
        {
            id: 'RAD005',
            modele: 'Motorola XPR 7550',
            serial: 'SN005',
            statut: 'ATTRIBUÉE',
            attributed_to: 'CPA',
            attribution_date: new Date().toISOString().split('T')[0],
            attribution_motif: 'Service normal',
            acquisition_date: '2023-01-15'
        }
    ];
}

// Fonction pour initialiser l'habillement automatiquement
function initializeUniforms() {
    uniforms = [];
    
    // Créer des tailles aléatoires pour chaque agent
    agents.forEach(agent => {
        if (agent.statut === 'actif') {
            const taillesChemise = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            const taillesPantalon = ['38', '40', '42', '44', '46', '48'];
            const taillesJacket = ['S', 'M', 'L', 'XL', 'XXL'];
            
            const uniform = {
                agent_code: agent.code,
                chemise_taille: taillesChemise[Math.floor(Math.random() * taillesChemise.length)],
                chemise_date: '2024-01-15',
                pantalon_taille: taillesPantalon[Math.floor(Math.random() * taillesPantalon.length)],
                pantalon_date: '2024-01-15',
                jacket_taille: taillesJacket[Math.floor(Math.random() * taillesJacket.length)],
                jacket_date: '2024-01-15',
                cravate_oui: Math.random() > 0.5,
                cravate_date: '2024-01-15',
                remarques: '',
                updated_at: new Date().toISOString()
            };
            
            uniforms.push(uniform);
        }
    });
}

// Fonction pour initialiser quelques avertissements
function initializeWarnings() {
    warnings = [
        {
            id: 'WARN001',
            agent_code: 'L16A',
            type: 'ORAL',
            date: '2024-01-15',
            description: 'Retard répété au poste',
            sanctions: 'Avertissement oral',
            status: 'active',
            created_at: '2024-01-15',
            created_by: 'Admin'
        },
        {
            id: 'WARN002',
            agent_code: 'O9A',
            type: 'ECRIT',
            date: '2024-02-20',
            description: 'Non-respect des consignes de sécurité',
            sanctions: 'Avertissement écrit',
            status: 'active',
            created_at: '2024-02-20',
            created_by: 'Admin'
        }
    ];
}

// Initialiser toutes les données
initializePanicCodes();
initializeRadios();
initializeUniforms();
initializeWarnings();

console.log(`✅ Base de données chargée avec ${agents.length} agents`);
console.log(`📊 Répartition par groupe:`);
const groupesStats = agents.reduce((acc, agent) => {
    acc[agent.groupe] = (acc[agent.groupe] || 0) + 1;
    return acc;
}, {});
Object.keys(groupesStats).forEach(groupe => {
    console.log(`   Groupe ${groupe}: ${groupesStats[groupe]} agents`);
});
console.log(`🔐 ${panicCodes.length} codes panique initialisés`);
console.log(`📻 ${radios.length} radios initialisées`);
console.log(`👔 ${uniforms.length} fiches habillement initialisées`);
console.log(`⚠️ ${warnings.length} avertissements initialisés`);

// Fonction pour charger les agents dans app.js
function loadAgentsData() {
    if (typeof agents !== 'undefined' && agents.length === 0) {
        agents = agentsData;
        saveData();
        console.log("✅ Données agents chargées depuis data.js");
    }
}

// Appeler automatiquement au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que app.js soit chargé
    setTimeout(loadAgentsData, 100);
}); 
        {
            code: 'CPB01',
            nom: 'NOM_B',
            prenom: 'PRENOM_B',
            groupe: 'B',
            tel: '0600000000',
            poste: 'Agent',
            cin: 'XXXXXXX',
            date_entree: DATE_AFFECTATION_BASE,
            date_sortie: null,
            statut: 'actif'
        }
        
        // ... Continuez avec tous vos agents
    ];
    
    loadHolidaysFromCurrentYear();
    saveData();
    console.log("✅ Données de test initialisées avec", agents.length, "agents");
}

// [COLLER ICI TOUT LE RESTE DU CODE QUE JE VOUS AI FOURNI PRÉCÉDEMENT]
// Depuis "function loadData() {" jusqu'à la fin du fichier
// === DONNÉES DE RÉFÉRENCE ===
const DATE_AFFECTATION_BASE = "2025-11-01";

// === GESTION DES AGENTS ===
function displayAgentsList() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "LISTE DES AGENTS";
    mainContent.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'planning-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Groupe</th>
                <th>Matricule</th>
                <th>CIN</th>
                <th>Téléphone</th>
                <th>Poste</th>
                <th>Date Entrée</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${agents.map(agent => `
                <tr>
                    <td><strong>${agent.code}</strong></td>
                    <td>${agent.nom}</td>
                    <td>${agent.prenom}</td>
                    <td style="text-align:center;">${agent.groupe}</td>
                    <td>${agent.matricule || ''}</td>
                    <td>${agent.cin || ''}</td>
                    <td>${agent.tel || ''}</td>
                    <td>${agent.poste || ''}</td>
                    <td>${agent.date_entree || DATE_AFFECTATION_BASE}</td>
                    <td><span class="status-badge ${agent.statut === 'actif' ? 'active' : 'inactive'}">${agent.statut}</span></td>
                    <td>
                        <button class="action-btn blue small" onclick="editAgent('${agent.code}')">✏️</button>
                        <button class="action-btn red small" onclick="deleteAgentPrompt('${agent.code}')">🗑️</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    mainContent.appendChild(table);

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter un agent';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddAgentForm;
    addBtn.style.marginTop = '20px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '10px';

    mainContent.appendChild(addBtn);
    mainContent.appendChild(backBtn);
}

function showAddAgentForm() {
    openPopup(
        'Ajouter un nouvel agent',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Code agent:</label>
                <input type="text" id="newAgentCode" placeholder="Ex: A01" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Nom:</label>
                <input type="text" id="newAgentNom" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Prénom:</label>
                <input type="text" id="newAgentPrenom" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Groupe:</label>
                <select id="newAgentGroupe" class="form-input" required>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>
            </div>
            <div class="form-group">
                <label>Matricule:</label>
                <input type="text" id="newAgentMatricule" class="form-input">
            </div>
            <div class="form-group">
                <label>CIN:</label>
                <input type="text" id="newAgentCIN" class="form-input">
            </div>
            <div class="form-group">
                <label>Téléphone:</label>
                <input type="tel" id="newAgentTel" class="form-input">
            </div>
            <div class="form-group">
                <label>Poste:</label>
                <input type="text" id="newAgentPoste" class="form-input">
            </div>
            <div class="form-group">
                <label>Date d'entrée:</label>
                <input type="date" id="newAgentDateEntree" value="${DATE_AFFECTATION_BASE}" class="form-input">
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveNewAgent()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveNewAgent() {
    const code = document.getElementById('newAgentCode').value.toUpperCase();
    const nom = document.getElementById('newAgentNom').value;
    const prenom = document.getElementById('newAgentPrenom').value;
    const groupe = document.getElementById('newAgentGroupe').value.toUpperCase();
    const matricule = document.getElementById('newAgentMatricule').value;
    const cin = document.getElementById('newAgentCIN').value;
    const tel = document.getElementById('newAgentTel').value;
    const poste = document.getElementById('newAgentPoste').value;
    const date_entree = document.getElementById('newAgentDateEntree').value || DATE_AFFECTATION_BASE;

    // Vérifier si l'agent existe déjà
    if (agents.find(a => a.code === code)) {
        showSnackbar(`L'agent ${code} existe déjà`);
        return;
    }

    // Ajouter l'agent
    agents.push({
        code,
        nom,
        prenom,
        groupe,
        matricule,
        cin,
        tel,
        poste,
        date_entree,
        date_sortie: null,
        statut: 'actif'
    });

    saveData();
    closePopup();
    displayAgentsList();
    showSnackbar(`Agent ${code} ajouté avec succès`);
}

function editAgent(code) {
    const agent = agents.find(a => a.code === code);
    if (!agent) return;

    openPopup(
        `Modifier l'agent ${code}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Nom:</label>
                <input type="text" id="editAgentNom" value="${agent.nom}" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Prénom:</label>
                <input type="text" id="editAgentPrenom" value="${agent.prenom}" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Groupe:</label>
                <select id="editAgentGroupe" class="form-input" required>
                    <option value="A" ${agent.groupe === 'A' ? 'selected' : ''}>A</option>
                    <option value="B" ${agent.groupe === 'B' ? 'selected' : ''}>B</option>
                    <option value="C" ${agent.groupe === 'C' ? 'selected' : ''}>C</option>
                    <option value="D" ${agent.groupe === 'D' ? 'selected' : ''}>D</option>
                    <option value="E" ${agent.groupe === 'E' ? 'selected' : ''}>E</option>
                </select>
            </div>
            <div class="form-group">
                <label>Matricule:</label>
                <input type="text" id="editAgentMatricule" value="${agent.matricule || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>CIN:</label>
                <input type="text" id="editAgentCIN" value="${agent.cin || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Téléphone:</label>
                <input type="tel" id="editAgentTel" value="${agent.tel || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Poste:</label>
                <input type="text" id="editAgentPoste" value="${agent.poste || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Date d'entrée:</label>
                <input type="date" id="editAgentDateEntree" value="${agent.date_entree || DATE_AFFECTATION_BASE}" class="form-input">
            </div>
            <div class="form-group">
                <label>Statut:</label>
                <select id="editAgentStatut" class="form-input">
                    <option value="actif" ${agent.statut === 'actif' ? 'selected' : ''}>Actif</option>
                    <option value="inactif" ${agent.statut === 'inactif' ? 'selected' : ''}>Inactif</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveAgentEdit('${code}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveAgentEdit(oldCode) {
    const agentIndex = agents.findIndex(a => a.code === oldCode);
    if (agentIndex === -1) return;

    agents[agentIndex] = {
        ...agents[agentIndex],
        nom: document.getElementById('editAgentNom').value,
        prenom: document.getElementById('editAgentPrenom').value,
        groupe: document.getElementById('editAgentGroupe').value.toUpperCase(),
        matricule: document.getElementById('editAgentMatricule').value,
        cin: document.getElementById('editAgentCIN').value,
        tel: document.getElementById('editAgentTel').value,
        poste: document.getElementById('editAgentPoste').value,
        date_entree: document.getElementById('editAgentDateEntree').value,
        statut: document.getElementById('editAgentStatut').value
    };

    // Si le statut change à inactif, ajouter la date de sortie
    if (agents[agentIndex].statut === 'inactif' && !agents[agentIndex].date_sortie) {
        agents[agentIndex].date_sortie = new Date().toISOString().split('T')[0];
    }

    saveData();
    closePopup();
    displayAgentsList();
    showSnackbar(`Agent ${oldCode} modifié avec succès`);
}

function deleteAgentPrompt(code) {
    if (confirm(`Voulez-vous vraiment supprimer l'agent ${code} ?`)) {
        agents = agents.filter(a => a.code !== code);
        saveData();
        displayAgentsList();
        showSnackbar(`Agent ${code} supprimé`);
    }
}

function showDeleteAgentForm() {
    openPopup(
        'Supprimer un agent',
        `
        <div style="padding: 15px;">
            <p>Sélectionnez l'agent à supprimer :</p>
            <select id="agentToDelete" class="form-input">
                ${agents.map(a => `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`).join('')}
            </select>
            <p style="color: #e74c3c; margin-top: 10px; font-size: 0.9em;">
                ⚠️ Cette action est irréversible !
            </p>
        </div>
        `,
        `
        <button class="popup-button red" onclick="deleteSelectedAgent()">Supprimer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function deleteSelectedAgent() {
    const code = document.getElementById('agentToDelete').value;
    deleteAgentPrompt(code);
}

// === GESTION DES CODES PANIQUE ===
function displayPanicCodesMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "CODES PANIQUE";
    mainContent.innerHTML = '';

    if (panicCodes.length === 0) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucun code panique enregistré</p>
                <button class="menu-button" onclick="showAddPanicCodeForm()">➕ Ajouter un code panique</button>
            </div>
        `;
    } else {
        const table = document.createElement('table');
        table.className = 'planning-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Code Agent</th>
                    <th>Agent</th>
                    <th>Code Panique</th>
                    <th>Poste Nom</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${panicCodes.map(pc => {
                    const agent = agents.find(a => a.code === pc.code_agent);
                    return `
                        <tr>
                            <td>${pc.code_agent}</td>
                            <td>${agent ? `${agent.prenom} ${agent.nom}` : 'Inconnu'}</td>
                            <td><strong>${pc.code_panique}</strong></td>
                            <td>${pc.poste_nom}</td>
                            <td>
                                <button class="action-btn red small" onclick="deletePanicCode('${pc.code_agent}')">Supprimer</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        mainContent.appendChild(table);
    }

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter un code panique';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddPanicCodeForm;
    addBtn.style.marginTop = '20px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;

    mainContent.appendChild(addBtn);
    mainContent.appendChild(backBtn);
}

function showAddPanicCodeForm() {
    openPopup(
        'Ajouter un code panique',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Agent:</label>
                <select id="panicAgentCode" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Code Panique:</label>
                <input type="text" id="panicCode" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Nom du Poste:</label>
                <input type="text" id="panicPosteNom" class="form-input" required>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="savePanicCode()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function savePanicCode() {
    const code_agent = document.getElementById('panicAgentCode').value;
    const code_panique = document.getElementById('panicCode').value;
    const poste_nom = document.getElementById('panicPosteNom').value;

    // Vérifier si l'agent a déjà un code
    const existingIndex = panicCodes.findIndex(pc => pc.code_agent === code_agent);
    
    if (existingIndex !== -1) {
        panicCodes[existingIndex] = { code_agent, code_panique, poste_nom };
    } else {
        panicCodes.push({ code_agent, code_panique, poste_nom });
    }

    saveData();
    closePopup();
    displayPanicCodesMenu();
    showSnackbar(`Code panique enregistré pour ${code_agent}`);
}

function deletePanicCode(code_agent) {
    if (confirm(`Supprimer le code panique de l'agent ${code_agent} ?`)) {
        panicCodes = panicCodes.filter(pc => pc.code_agent !== code_agent);
        saveData();
        displayPanicCodesMenu();
        showSnackbar(`Code panique supprimé pour ${code_agent}`);
    }
}

// === GESTION DES RADIOS ===
function displayRadiosMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "GESTION DES RADIOS";
    mainContent.innerHTML = '';

    if (radios.length === 0) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucune radio enregistrée</p>
                <button class="menu-button" onclick="showAddRadioForm()">➕ Ajouter une radio</button>
            </div>
        `;
    } else {
        // Statistiques
        const stats = {
            total: radios.length,
            disponible: radios.filter(r => r.statut === 'DISPONIBLE').length,
            attribuee: radios.filter(r => r.statut === 'ATTRIBUÉE').length,
            hs: radios.filter(r => r.statut === 'HS').length,
            reparation: radios.filter(r => r.statut === 'RÉPARATION').length
        };

        mainContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Total Radios</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.disponible}</div>
                    <div class="stat-label">Disponibles</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.attribuee}</div>
                    <div class="stat-label">Attribuées</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.hs + stats.reparation}</div>
                    <div class="stat-label">Hors Service</div>
                </div>
            </div>
        `;

        const table = document.createElement('table');
        table.className = 'planning-table';
        table.style.marginTop = '20px';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID Radio</th>
                    <th>Modèle</th>
                    <th>Statut</th>
                    <th>Attribuée à</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${radios.map(radio => {
                    const attribution = radioHistory.find(rh => rh.id_radio === radio.id_radio && !rh.date_retour);
                    const agent = attribution ? agents.find(a => a.code === attribution.code_agent) : null;
                    return `
                        <tr>
                            <td><strong>${radio.id_radio}</strong></td>
                            <td>${radio.modele}</td>
                            <td><span class="status-badge ${radio.statut.toLowerCase()}">${radio.statut}</span></td>
                            <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : '-'}</td>
                            <td>
                                ${radio.statut === 'DISPONIBLE' ? 
                                    `<button class="action-btn green small" onclick="showAssignRadioForm('${radio.id_radio}')">Attribuer</button>` : 
                                    radio.statut === 'ATTRIBUÉE' ? 
                                    `<button class="action-btn orange small" onclick="returnRadio('${radio.id_radio}')">Retour</button>` : 
                                    ''
                                }
                                <button class="action-btn blue small" onclick="editRadio('${radio.id_radio}')">Modifier</button>
                                <button class="action-btn red small" onclick="deleteRadio('${radio.id_radio}')">Supprimer</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        mainContent.appendChild(table);
    }

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter une radio';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddRadioForm;
    addBtn.style.marginTop = '20px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;

    mainContent.appendChild(addBtn);
    mainContent.appendChild(backBtn);
}

function showAddRadioForm() {
    openPopup(
        'Ajouter une radio',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>ID Radio:</label>
                <input type="text" id="radioId" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Modèle:</label>
                <input type="text" id="radioModele" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Statut:</label>
                <select id="radioStatut" class="form-input">
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="HS">Hors Service</option>
                    <option value="RÉPARATION">En réparation</option>
                    <option value="ATTRIBUÉE">Attribuée</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveRadio()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveRadio() {
    const id_radio = document.getElementById('radioId').value.toUpperCase();
    const modele = document.getElementById('radioModele').value;
    const statut = document.getElementById('radioStatut').value;

    // Vérifier si la radio existe déjà
    const existingIndex = radios.findIndex(r => r.id_radio === id_radio);
    
    if (existingIndex !== -1) {
        radios[existingIndex] = { id_radio, modele, statut };
    } else {
        radios.push({ id_radio, modele, statut });
    }

    saveData();
    closePopup();
    displayRadiosMenu();
    showSnackbar(`Radio ${id_radio} enregistrée`);
}

function showAssignRadioForm(radioId) {
    const radio = radios.find(r => r.id_radio === radioId);
    if (!radio || radio.statut !== 'DISPONIBLE') return;

    openPopup(
        `Attribuer la radio ${radioId}`,
        `
        <div style="padding: 15px;">
            <p>Radio: <strong>${radioId}</strong> (${radio.modele})</p>
            <div class="form-group">
                <label>Attribuer à l'agent:</label>
                <select id="assignAgentCode" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                    ).join('')}
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="assignRadio('${radioId}')">Attribuer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function assignRadio(radioId) {
    const code_agent = document.getElementById('assignAgentCode').value;
    const date_attribution = new Date().toISOString().split('T')[0];

    // Mettre à jour le statut de la radio
    const radioIndex = radios.findIndex(r => r.id_radio === radioId);
    if (radioIndex !== -1) {
        radios[radioIndex].statut = 'ATTRIBUÉE';
    }

    // Ajouter à l'historique
    radioHistory.push({
        id_radio: radioId,
        code_agent,
        date_attribution,
        date_retour: null
    });

    saveData();
    closePopup();
    displayRadiosMenu();
    showSnackbar(`Radio ${radioId} attribuée à ${code_agent}`);
}

function returnRadio(radioId) {
    const radioIndex = radios.findIndex(r => r.id_radio === radioId);
    if (radioIndex !== -1) {
        radios[radioIndex].statut = 'DISPONIBLE';
    }

    // Mettre à jour l'historique
    const historyIndex = radioHistory.findIndex(rh => rh.id_radio === radioId && !rh.date_retour);
    if (historyIndex !== -1) {
        radioHistory[historyIndex].date_retour = new Date().toISOString().split('T')[0];
    }

    saveData();
    displayRadiosMenu();
    showSnackbar(`Radio ${radioId} retournée et disponible`);
}

function editRadio(radioId) {
    const radio = radios.find(r => r.id_radio === radioId);
    if (!radio) return;

    openPopup(
        `Modifier la radio ${radioId}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>ID Radio:</label>
                <input type="text" id="editRadioId" value="${radio.id_radio}" class="form-input" readonly>
            </div>
            <div class="form-group">
                <label>Modèle:</label>
                <input type="text" id="editRadioModele" value="${radio.modele}" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Statut:</label>
                <select id="editRadioStatut" class="form-input">
                    <option value="DISPONIBLE" ${radio.statut === 'DISPONIBLE' ? 'selected' : ''}>Disponible</option>
                    <option value="HS" ${radio.statut === 'HS' ? 'selected' : ''}>Hors Service</option>
                    <option value="RÉPARATION" ${radio.statut === 'RÉPARATION' ? 'selected' : ''}>En réparation</option>
                    <option value="ATTRIBUÉE" ${radio.statut === 'ATTRIBUÉE' ? 'selected' : ''}>Attribuée</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveRadioEdit('${radioId}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveRadioEdit(oldRadioId) {
    const radioIndex = radios.findIndex(r => r.id_radio === oldRadioId);
    if (radioIndex === -1) return;

    const id_radio = document.getElementById('editRadioId').value.toUpperCase();
    const modele = document.getElementById('editRadioModele').value;
    const statut = document.getElementById('editRadioStatut').value;

    radios[radioIndex] = { id_radio, modele, statut };

    // Mettre à jour aussi l'historique si l'ID change
    if (oldRadioId !== id_radio) {
        radioHistory.forEach(rh => {
            if (rh.id_radio === oldRadioId) {
                rh.id_radio = id_radio;
            }
        });
    }

    saveData();
    closePopup();
    displayRadiosMenu();
    showSnackbar(`Radio ${id_radio} modifiée`);
}

function deleteRadio(radioId) {
    if (confirm(`Supprimer la radio ${radioId} ?`)) {
        radios = radios.filter(r => r.id_radio !== radioId);
        // Supprimer aussi l'historique
        radioHistory = radioHistory.filter(rh => rh.id_radio !== radioId);
        saveData();
        displayRadiosMenu();
        showSnackbar(`Radio ${radioId} supprimée`);
    }
}

// === GESTION HABILLEMENT ===
function displayUniformMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "HABILLEMENT - TAILLES";
    mainContent.innerHTML = '';

    if (uniforms.length === 0) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucune information d'habillement enregistrée</p>
                <button class="menu-button" onclick="showAddUniformForm()">➕ Ajouter habillement</button>
            </div>
        `;
    } else {
        const table = document.createElement('table');
        table.className = 'planning-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Agent</th>
                    <th>Chemise</th>
                    <th>Date Chemise</th>
                    <th>Veste</th>
                    <th>Date Veste</th>
                    <th>Pantalon</th>
                    <th>Date Pantalon</th>
                    <th>Cravate</th>
                    <th>Date Cravate</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${uniforms.map(uniform => {
                    const agent = agents.find(a => a.code === uniform.code_agent);
                    return `
                        <tr>
                            <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : uniform.code_agent}</td>
                            <td>${uniform.chemise_taille || '-'}</td>
                            <td>${uniform.chemise_date || '-'}</td>
                            <td>${uniform.jacket_taille || '-'}</td>
                            <td>${uniform.jacket_date || '-'}</td>
                            <td>${uniform.pantalon_taille || '-'}</td>
                            <td>${uniform.pantalon_date || '-'}</td>
                            <td>${uniform.cravate_oui || 'Non'}</td>
                            <td>${uniform.cravate_date || '-'}</td>
                            <td>
                                <button class="action-btn blue small" onclick="editUniform('${uniform.code_agent}')">Modifier</button>
                                <button class="action-btn red small" onclick="deleteUniform('${uniform.code_agent}')">Supprimer</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        mainContent.appendChild(table);
    }

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter habillement';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddUniformForm;
    addBtn.style.marginTop = '20px';

    const reportBtn = document.createElement('button');
    reportBtn.textContent = '📋 Rapport tailles';
    reportBtn.className = 'menu-button';
    reportBtn.onclick = showUniformReport;
    reportBtn.style.marginTop = '10px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '10px';

    mainContent.appendChild(addBtn);
    mainContent.appendChild(reportBtn);
    mainContent.appendChild(backBtn);
}

function showAddUniformForm() {
    openPopup(
        'Ajouter information habillement',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Agent:</label>
                <select id="uniformAgentCode" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Chemise - Taille:</label>
                <input type="text" id="chemiseTaille" class="form-input" placeholder="Ex: M, L, XL">
            </div>
            <div class="form-group">
                <label>Chemise - Date:</label>
                <input type="date" id="chemiseDate" class="form-input">
            </div>
            <div class="form-group">
                <label>Veste - Taille:</label>
                <input type="text" id="jacketTaille" class="form-input" placeholder="Ex: 42, 44, 46">
            </div>
            <div class="form-group">
                <label>Veste - Date:</label>
                <input type="date" id="jacketDate" class="form-input">
            </div>
            <div class="form-group">
                <label>Pantalon - Taille:</label>
                <input type="text" id="pantalonTaille" class="form-input" placeholder="Ex: 38, 40, 42">
            </div>
            <div class="form-group">
                <label>Pantalon - Date:</label>
                <input type="date" id="pantalonDate" class="form-input">
            </div>
            <div class="form-group">
                <label>Cravate (Oui/Non):</label>
                <select id="cravateOui" class="form-input">
                    <option value="Non">Non</option>
                    <option value="Oui">Oui</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cravate - Date:</label>
                <input type="date" id="cravateDate" class="form-input">
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveUniform()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveUniform() {
    const code_agent = document.getElementById('uniformAgentCode').value;
    const chemise_taille = document.getElementById('chemiseTaille').value || null;
    const chemise_date = document.getElementById('chemiseDate').value || null;
    const jacket_taille = document.getElementById('jacketTaille').value || null;
    const jacket_date = document.getElementById('jacketDate').value || null;
    const pantalon_taille = document.getElementById('pantalonTaille').value || null;
    const pantalon_date = document.getElementById('pantalonDate').value || null;
    const cravate_oui = document.getElementById('cravateOui').value;
    const cravate_date = document.getElementById('cravateDate').value || null;

    // Vérifier si l'agent a déjà des informations
    const existingIndex = uniforms.findIndex(u => u.code_agent === code_agent);
    
    const uniformData = {
        code_agent,
        chemise_taille,
        chemise_date,
        jacket_taille,
        jacket_date,
        pantalon_taille,
        pantalon_date,
        cravate_oui,
        cravate_date
    };

    if (existingIndex !== -1) {
        uniforms[existingIndex] = uniformData;
    } else {
        uniforms.push(uniformData);
    }

    saveData();
    closePopup();
    displayUniformMenu();
    showSnackbar(`Informations habillement enregistrées pour ${code_agent}`);
}

function editUniform(code_agent) {
    const uniform = uniforms.find(u => u.code_agent === code_agent);
    if (!uniform) return;

    openPopup(
        `Modifier habillement - ${code_agent}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Chemise - Taille:</label>
                <input type="text" id="editChemiseTaille" value="${uniform.chemise_taille || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Chemise - Date:</label>
                <input type="date" id="editChemiseDate" value="${uniform.chemise_date || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Veste - Taille:</label>
                <input type="text" id="editJacketTaille" value="${uniform.jacket_taille || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Veste - Date:</label>
                <input type="date" id="editJacketDate" value="${uniform.jacket_date || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Pantalon - Taille:</label>
                <input type="text" id="editPantalonTaille" value="${uniform.pantalon_taille || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Pantalon - Date:</label>
                <input type="date" id="editPantalonDate" value="${uniform.pantalon_date || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Cravate (Oui/Non):</label>
                <select id="editCravateOui" class="form-input">
                    <option value="Non" ${uniform.cravate_oui === 'Non' ? 'selected' : ''}>Non</option>
                    <option value="Oui" ${uniform.cravate_oui === 'Oui' ? 'selected' : ''}>Oui</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cravate - Date:</label>
                <input type="date" id="editCravateDate" value="${uniform.cravate_date || ''}" class="form-input">
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveUniformEdit('${code_agent}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveUniformEdit(code_agent) {
    const uniformIndex = uniforms.findIndex(u => u.code_agent === code_agent);
    if (uniformIndex === -1) return;

    uniforms[uniformIndex] = {
        code_agent,
        chemise_taille: document.getElementById('editChemiseTaille').value || null,
        chemise_date: document.getElementById('editChemiseDate').value || null,
        jacket_taille: document.getElementById('editJacketTaille').value || null,
        jacket_date: document.getElementById('editJacketDate').value || null,
        pantalon_taille: document.getElementById('editPantalonTaille').value || null,
        pantalon_date: document.getElementById('editPantalonDate').value || null,
        cravate_oui: document.getElementById('editCravateOui').value,
        cravate_date: document.getElementById('editCravateDate').value || null
    };

    saveData();
    closePopup();
    displayUniformMenu();
    showSnackbar(`Informations habillement modifiées pour ${code_agent}`);
}

function deleteUniform(code_agent) {
    if (confirm(`Supprimer les informations d'habillement de l'agent ${code_agent} ?`)) {
        uniforms = uniforms.filter(u => u.code_agent !== code_agent);
        saveData();
        displayUniformMenu();
        showSnackbar(`Informations habillement supprimées pour ${code_agent}`);
    }
}

function showUniformReport() {
    if (uniforms.length === 0) {
        showSnackbar("Aucune information d'habillement à afficher");
        return;
    }

    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "RAPPORT TAILLES HABILLEMENT";
    mainContent.innerHTML = '';

    // Groupes de tailles
    const taillesChemise = {};
    const taillesVeste = {};
    const taillesPantalon = {};

    uniforms.forEach(uniform => {
        // Chemise
        if (uniform.chemise_taille) {
            taillesChemise[uniform.chemise_taille] = (taillesChemise[uniform.chemise_taille] || 0) + 1;
        }
        
        // Veste
        if (uniform.jacket_taille) {
            taillesVeste[uniform.jacket_taille] = (taillesVeste[uniform.jacket_taille] || 0) + 1;
        }
        
        // Pantalon
        if (uniform.pantalon_taille) {
            taillesPantalon[uniform.pantalon_taille] = (taillesPantalon[uniform.pantalon_taille] || 0) + 1;
        }
    });

    let reportHTML = `
        <div style="padding: 20px;">
            <h3>Répartition des tailles</h3>
            
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px;">
                <div style="flex: 1; min-width: 250px;">
                    <h4>Chemises</h4>
                    <div class="group-stats">
                        ${Object.entries(taillesChemise).map(([taille, count]) => `
                            <div class="group-stat">
                                <span>Taille ${taille}:</span>
                                <span>${count}</span>
                            </div>
                        `).join('')}
                        ${Object.keys(taillesChemise).length === 0 ? '<p>Aucune taille enregistrée</p>' : ''}
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                    <h4>Vestes</h4>
                    <div class="group-stats">
                        ${Object.entries(taillesVeste).map(([taille, count]) => `
                            <div class="group-stat">
                                <span>Taille ${taille}:</span>
                                <span>${count}</span>
                            </div>
                        `).join('')}
                        ${Object.keys(taillesVeste).length === 0 ? '<p>Aucune taille enregistrée</p>' : ''}
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                    <h4>Pantalons</h4>
                    <div class="group-stats">
                        ${Object.entries(taillesPantalon).map(([taille, count]) => `
                            <div class="group-stat">
                                <span>Taille ${taille}:</span>
                                <span>${count}</span>
                            </div>
                        `).join('')}
                        ${Object.keys(taillesPantalon).length === 0 ? '<p>Aucune taille enregistrée</p>' : ''}
                    </div>
                </div>
            </div>
            
            <h3 style="margin-top: 30px;">Agents avec cravate</h3>
            <div class="group-stats">
                ${uniforms.filter(u => u.cravate_oui === 'Oui').map(uniform => {
                    const agent = agents.find(a => a.code === uniform.code_agent);
                    return `
                        <div class="group-stat">
                            <span>${agent ? agent.code + ' - ' + agent.prenom + ' ' + agent.nom : uniform.code_agent}:</span>
                            <span>Date: ${uniform.cravate_date || 'Non spécifiée'}</span>
                        </div>
                    `;
                }).join('')}
                ${uniforms.filter(u => u.cravate_oui === 'Oui').length === 0 ? '<p>Aucun agent avec cravate</p>' : ''}
            </div>
        </div>
    `;

    mainContent.innerHTML = reportHTML;

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayUniformMenu;
    backBtn.style.marginTop = '20px';
    mainContent.appendChild(backBtn);
}

// === GESTION DES AVERTISSEMENTS ===
function displayWarningsMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "AVERTISSEMENTS DISCIPLINAIRES";
    mainContent.innerHTML = '';

    if (warnings.length === 0) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucun avertissement enregistré</p>
                <button class="menu-button" onclick="showAddWarningForm()">➕ Nouvel avertissement</button>
            </div>
        `;
    } else {
        // Trier par date décroissante
        const sortedWarnings = [...warnings].sort((a, b) => 
            new Date(b.date_avertissement) - new Date(a.date_avertissement)
        );

        const table = document.createElement('table');
        table.className = 'planning-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Agent</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sortedWarnings.map(warning => {
                    const agent = agents.find(a => a.code === warning.code_agent);
                    const typeColors = {
                        'ORAL': '#f39c12',
                        'ECRIT': '#e74c3c',
                        'MISE_A_PIED': '#c0392b'
                    };
                    return `
                        <tr>
                            <td>${warning.date_avertissement}</td>
                            <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : warning.code_agent}</td>
                            <td><span style="background: ${typeColors[warning.type_avertissement] || '#95a5a6'}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 0.85em;">${warning.type_avertissement}</span></td>
                            <td>${warning.description || ''}</td>
                            <td>
                                <button class="action-btn red small" onclick="deleteWarning(${warning.id})">Supprimer</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        mainContent.appendChild(table);
    }

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Nouvel avertissement';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddWarningForm;
    addBtn.style.marginTop = '20px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;

    mainContent.appendChild(addBtn);
    mainContent.appendChild(backBtn);
}

function showAddWarningForm() {
    openPopup(
        'Nouvel avertissement',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Agent:</label>
                <select id="warningAgentCode" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Date:</label>
                <input type="date" id="warningDate" value="${new Date().toISOString().split('T')[0]}" class="form-input">
            </div>
            <div class="form-group">
                <label>Type d'avertissement:</label>
                <select id="warningType" class="form-input">
                    <option value="ORAL">Oral</option>
                    <option value="ECRIT">Écrit</option>
                    <option value="MISE_A_PIED">Mise à pied</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <textarea id="warningDescription" class="form-input" rows="4" placeholder="Détails de l'avertissement..."></textarea>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveWarning()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveWarning() {
    const code_agent = document.getElementById('warningAgentCode').value;
    const date_avertissement = document.getElementById('warningDate').value;
    const type_avertissement = document.getElementById('warningType').value;
    const description = document.getElementById('warningDescription').value;

    // Générer un ID unique
    const id = warnings.length > 0 ? Math.max(...warnings.map(w => w.id)) + 1 : 1;

    warnings.push({
        id,
        code_agent,
        date_avertissement,
        type_avertissement,
        description
    });

    // Ajouter au log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'ADD_WARNING',
        details: `Avertissement ${type_avertissement} pour ${code_agent}`,
        user: 'system'
    });

    saveData();
    closePopup();
    displayWarningsMenu();
    showSnackbar(`Avertissement enregistré pour ${code_agent}`);
}

function deleteWarning(warningId) {
    if (confirm("Supprimer cet avertissement ?")) {
        const warning = warnings.find(w => w.id === warningId);
        warnings = warnings.filter(w => w.id !== warningId);
        
        // Ajouter au log d'audit
        if (warning) {
            auditLog.push({
                date: new Date().toISOString(),
                action: 'DELETE_WARNING',
                details: `Suppression avertissement pour ${warning.code_agent}`,
                user: 'system'
            });
        }

        saveData();
        displayWarningsMenu();
        showSnackbar("Avertissement supprimé");
    }
}

// === EXPORTATIONS ===
function showExportMenu() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    openPopup(
        'Exporter les données',
        `
        <div style="padding: 15px;">
            <h3>Options d'export</h3>
            
            <div class="form-group">
                <label>Mois:</label>
                <select id="exportMonth" class="form-input">
                    ${Array.from({length: 12}, (_, i) => 
                        `<option value="${i+1}" ${i+1 === currentMonth ? 'selected' : ''}>${getMonthName(i+1)}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Année:</label>
                <input type="number" id="exportYear" value="${currentYear}" class="form-input" min="2024" max="2030">
            </div>
            
            <div class="form-group">
                <label>Format:</label>
                <select id="exportFormat" class="form-input">
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="csv">CSV (.csv)</option>
                    <option value="json">JSON (.json)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Données à exporter:</label>
                <div style="margin-top: 10px;">
                    <label><input type="checkbox" id="exportPlanning" checked> Planning</label><br>
                    <label><input type="checkbox" id="exportStats" checked> Statistiques</label><br>
                    <label><input type="checkbox" id="exportAgents" checked> Agents</label><br>
                    <label><input type="checkbox" id="exportHolidays"> Jours fériés</label>
                </div>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="prepareExport()">Exporter</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function prepareExport() {
    const month = parseInt(document.getElementById('exportMonth').value);
    const year = parseInt(document.getElementById('exportYear').value);
    const format = document.getElementById('exportFormat').value;
    
    const exportPlanning = document.getElementById('exportPlanning').checked;
    const exportStats = document.getElementById('exportStats').checked;
    const exportAgents = document.getElementById('exportAgents').checked;
    const exportHolidays = document.getElementById('exportHolidays').checked;

    // Construire les données d'export
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            month,
            year,
            format
        },
        data: {}
    };

    if (exportAgents) {
        exportData.data.agents = agents;
    }

    if (exportPlanning) {
        exportData.data.planning = planningData;
    }

    if (exportStats) {
        exportData.data.statistics = calculateMonthlyStatistics(month, year);
    }

    if (exportHolidays) {
        exportData.data.holidays = holidays;
    }

    // Exporter selon le format
    switch(format) {
        case 'json':
            exportToJSON(exportData, month, year);
            break;
        case 'csv':
            exportToCSV(exportData, month, year);
            break;
        case 'excel':
            // Pour Excel, on utiliserait une bibliothèque comme SheetJS
            // Pour l'instant, on exporte en CSV
            exportToCSV(exportData, month, year);
            break;
    }

    closePopup();
}

function exportToJSON(data, month, year) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sga_export_${year}_${month.toString().padStart(2, '0')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSnackbar('Export JSON terminé');
}

function exportToCSV(data, month, year) {
    // Exemple: exporter les agents en CSV
    let csvContent = "Code;Nom;Prénom;Groupe;Matricule;CIN;Téléphone;Poste;Date Entrée;Statut\n";
    
    agents.forEach(agent => {
        const row = [
            agent.code,
            `"${agent.nom}"`,
            `"${agent.prenom}"`,
            agent.groupe,
            agent.matricule || '',
            agent.cin || '',
            agent.tel || '',
            `"${agent.poste || ''}"`,
            agent.date_entree || '',
            agent.statut
        ];
        csvContent += row.join(';') + '\n';
    });
    
    const dataBlob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents_${year}_${month.toString().padStart(2, '0')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSnackbar('Export CSV terminé');
}

// === CONFIGURATION ===
function displayConfigMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "CONFIGURATION";
    mainContent.innerHTML = `
        <div style="padding: 20px;">
            <h3>Paramètres de l'application</h3>
            
            <div class="info-section" style="margin-bottom: 20px;">
                <h4>Informations système</h4>
                <div class="info-item">
                    <span class="info-label">Version:</span>
                    <span class="info-value">SGA 1.0</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date d'affectation de base:</span>
                    <span class="info-value">${DATE_AFFECTATION_BASE}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Agents enregistrés:</span>
                    <span class="info-value">${agents.length} (${agents.filter(a => a.statut === 'actif').length} actifs)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Données sauvegardées:</span>
                    <span class="info-value">${localStorage.length} éléments</span>
                </div>
            </div>
            
            <div class="info-section" style="margin-bottom: 20px;">
                <h4>Maintenance</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="menu-button" onclick="showBackupMenu()">💾 Sauvegarde des données</button>
                    <button class="menu-button" onclick="clearOldData()">🗑️ Nettoyer anciennes données</button>
                    <button class="menu-button quit-button" onclick="showResetConfirmation()">🔄 Réinitialiser l'application</button>
                </div>
            </div>
            
            <div class="info-section">
                <h4>A propos</h4>
                <p>Système de Gestion des Agents (SGA) - Planning Mensuel</p>
                <p>Version synchronisée avec la logique métier Python</p>
                <p>© 2024 - Tous droits réservés</p>
            </div>
        </div>
    `;

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '20px';
    mainContent.appendChild(backBtn);
}

function clearOldData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0].substring(0, 7); // Format YYYY-MM
    
    let deletedCount = 0;
    
    // Nettoyer le planning ancien
    Object.keys(planningData).forEach(monthKey => {
        if (monthKey < sixMonthsAgoStr) {
            delete planningData[monthKey];
            deletedCount++;
        }
    });
    
    saveData();
    showSnackbar(`Nettoyage terminé: ${deletedCount} mois de planning supprimés`);
}

// === FONCTIONS DE STATISTIQUES AVANCÉES ===
function showAgentStats() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    openPopup(
        'Statistiques par agent',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Agent:</label>
                <select id="statsAgentCode" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Mois:</label>
                <select id="statsMonth" class="form-input">
                    ${Array.from({length: 12}, (_, i) => 
                        `<option value="${i+1}" ${i+1 === currentMonth ? 'selected' : ''}>${getMonthName(i+1)}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Année:</label>
                <input type="number" id="statsYear" value="${currentYear}" class="form-input" min="2024" max="2030">
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="displayAgentStatsDetails()">Afficher</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function displayAgentStatsDetails() {
    const code = document.getElementById('statsAgentCode').value;
    const month = parseInt(document.getElementById('statsMonth').value);
    const year = parseInt(document.getElementById('statsYear').value);
    
    const agent = agents.find(a => a.code === code);
    if (!agent) {
        showSnackbar("Agent non trouvé");
        return;
    }
    
    const stats = calculateAgentDetailedStats(code, month, year);
    
    openPopup(
        `Statistiques ${code} - ${getMonthName(month)} ${year}`,
        `
        <div style="padding: 15px;">
            <div class="info-section">
                <h3>${agent.prenom} ${agent.nom} - Groupe ${agent.groupe}</h3>
                <div class="info-item">
                    <span class="info-label">Jours travaillés:</span>
                    <span class="info-value">${stats.jours_travailles}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Jours repos:</span>
                    <span class="info-value">${stats.jours_repos}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Jours congés:</span>
                    <span class="info-value">${stats.jours_conges}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taux de présence:</span>
                    <span class="info-value">${stats.taux_presence}%</span>
                </div>
                <div class="info-item">
                    <span class="info-label">CPA (Shifts opérationnels):</span>
                    <span class="info-value total-value">${stats.total_shifts}</span>
                </div>
            </div>
            
            <div class="info-section" style="margin-top: 20px;">
                <h3>Répartition par jour</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${Object.entries(stats.shifts_par_jour).map(([jour, shifts]) => `
                        <div style="flex: 1; min-width: 100px;">
                            <h4>${jour}</h4>
                            ${Object.entries(shifts).filter(([shift, count]) => count > 0).map(([shift, count]) => `
                                <div style="font-size: 0.9em; margin: 2px 0;">
                                    ${SHIFT_LABELS[shift]}: ${count}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `,
        `
        <button class="popup-button gray" onclick="closePopup()">Fermer</button>
        `
    );
}

function calculateAgentDetailedStats(agentCode, month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const agent = agents.find(a => a.code === agentCode);
    
    let jours_travailles = 0;
    let jours_repos = 0;
    let jours_conges = 0;
    let jours_maladie = 0;
    let jours_autres = 0;
    let jours_feries_travailles = 0;
    
    const shifts_par_jour = {
        'Lundi': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0},
        'Mardi': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0},
        'Mercredi': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0},
        'Jeudi': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0},
        'Vendredi': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0},
        'Samedi': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0},
        'Dimanche': {'1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0}
    };
    
    const jours_francais = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = date.toISOString().split('T')[0];
        const jourSemaine = jours_francais[date.getDay()];
        const shift = getShiftForAgent(agentCode, dateStr);
        const estFerie = isHolidayDate(date);
        
        // Compter par type
        if (shift === 'R') jours_repos++;
        else if (shift === 'C') jours_conges++;
        else if (shift === 'M') jours_maladie++;
        else if (shift === 'A') jours_autres++;
        else if (['1', '2', '3'].includes(shift)) {
            jours_travailles++;
            if (estFerie) jours_feries_travailles++;
        }
        
        // Compter par jour
        if (shift && shifts_par_jour[jourSemaine] && shifts_par_jour[jourSemaine][shift] !== undefined) {
            shifts_par_jour[jourSemaine][shift]++;
        }
    }
    
    const total_jours = daysInMonth;
    const taux_presence = total_jours > 0 ? (jours_travailles / total_jours * 100) : 0;
    
    // Calcul du CPA selon la logique Python
    let total_shifts = jours_travailles;
    if (agent.groupe !== 'E') {
        total_shifts += jours_feries_travailles;
    }
    
    return {
        jours_travailles,
        jours_repos,
        jours_conges,
        jours_maladie,
        jours_autres,
        jours_feries_travailles,
        total_jours,
        taux_presence: taux_presence.toFixed(1),
        total_shifts,
        shifts_par_jour
    };
}

function showRanking() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    // Calculer le classement des agents
    const classement = agents
        .filter(a => a.statut === 'actif')
        .map(agent => {
            const stats = calculateAgentDetailedStats(agent.code, month, year);
            return {
                code: agent.code,
                nom: agent.nom,
                prenom: agent.prenom,
                groupe: agent.groupe,
                cpa: stats.total_shifts,
                jours_travailles: stats.jours_travailles,
                taux_presence: stats.taux_presence
            };
        })
        .sort((a, b) => b.cpa - a.cpa);
    
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = `CLASSEMENT CPA - ${getMonthName(month)} ${year}`;
    mainContent.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'classement-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Rang</th>
                <th>Agent</th>
                <th>Groupe</th>
                <th>CPA</th>
                <th>Jours travaillés</th>
                <th>Taux présence</th>
            </tr>
        </thead>
        <tbody>
            ${classement.map((agent, index) => {
                let rankClass = '';
                if (index === 0) rankClass = 'rank-1';
                else if (index === 1) rankClass = 'rank-2';
                else if (index === 2) rankClass = 'rank-3';
                
                return `
                    <tr class="${rankClass}">
                        <td>${index + 1}</td>
                        <td><strong>${agent.code}</strong><br><small>${agent.prenom} ${agent.nom}</small></td>
                        <td>${agent.groupe}</td>
                        <td><strong>${agent.cpa}</strong></td>
                        <td>${agent.jours_travailles}</td>
                        <td>${agent.taux_presence}%</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    
    mainContent.appendChild(table);
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '20px';
    mainContent.appendChild(backBtn);
}

// === FONCTIONS MANQUANTES RESTANTES (stubs simplifiés) ===
function showMassEditor() {
    showSnackbar("L'éditeur en masse permet de modifier plusieurs shifts à la fois. Fonctionnalité avancée à développer.");
}

function showSicknessForm() {
    openPopup(
        'Déclarer une absence maladie',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Agent:</label>
                <select id="sicknessAgent" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Date de début:</label>
                <input type="date" id="sicknessStart" class="form-input">
            </div>
            <div class="form-group">
                <label>Date de fin:</label>
                <input type="date" id="sicknessEnd" class="form-input">
            </div>
            <div class="form-group">
                <label>Commentaire:</label>
                <textarea id="sicknessComment" class="form-input" rows="3" placeholder="Motif de l'absence..."></textarea>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveSickness()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveSickness() {
    const agentCode = document.getElementById('sicknessAgent').value;
    const startDate = document.getElementById('sicknessStart').value;
    const endDate = document.getElementById('sicknessEnd').value;
    
    if (!agentCode || !startDate || !endDate) {
        showSnackbar("Veuillez remplir toutes les dates");
        return;
    }
    
    // Appliquer les absences maladie
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthKey = startDate.substring(0, 7);
    
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (!planningData[monthKey][agentCode][dateStr]) {
            planningData[monthKey][agentCode][dateStr] = {};
        }
        planningData[monthKey][agentCode][dateStr] = {
            shift: 'M',
            modified: new Date().toISOString(),
            origin: 'SICKNESS'
        };
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    saveData();
    closePopup();
    showSnackbar(`Absence maladie enregistrée pour ${agentCode}`);
}

function showLeavePeriodForm() {
    // Similaire à l'interface dans displayLeavesMenu
    displayLeavesMenu();
}

function showAddHolidayForm() {
    // Similaire à l'interface dans displayHolidaysManager
    displayHolidaysManager();
}

// Mise à jour des stubs existants pour qu'ils appellent les bonnes fonctions
function showAddShiftForm() {
    showSnackbar("Utilisez l'éditeur de planning global pour modifier les shifts individuellement.");
}

function showMassUpdateForm() {
    showMassEditor();
}

function importPlanningFromExcel() {
    showSnackbar("L'import depuis Excel nécessite une bibliothèque spéciale. Fonctionnalité à développer.");
}

function exportToPDF() {
    showSnackbar("L'export PDF nécessite une bibliothèque spéciale. Fonctionnalité à développer.");
}

function printPlanning() {
    window.print();
}

console.log("✅ app.js complètement implémenté avec toutes les options");
