// app.js - VERSION CORRIGÉE SYNC AVEC LOGIQUE MÉTIER
// Système de Gestion des Agents (SGA) - Planning Mensuel
// Synchronisé avec la logique de gestion_agents.py

// --- CONSTANTES ET VARIABLES GLOBALES ---
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

// Variables globales synchronisées avec Python
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

// --- INITIALISATION AU CHARGEMENT ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    displayMainMenu();
    console.log("SGA initialisé - Version corrigée");
});

// --- INITIALISATION DE L'APPLICATION ---
function initApp() {
    loadData();
    if (agents.length === 0) {
        initializeTestData();
    }
    loadHolidaysFromCurrentYear();
}

// --- GESTION DES DONNÉES (LOCALSTORAGE) ---
function loadData() {
    const loadItem = (key, defaultValue) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    };

    agents = loadItem('sga_agents', []);
    planningData = loadItem('sga_planning', {});
    holidays = loadItem('sga_holidays', []);
    panicCodes = loadItem('sga_panic_codes', []);
    radios = loadItem('sga_radios', []);
    uniforms = loadItem('sga_uniforms', []);
    warnings = loadItem('sga_warnings', []);
    leaves = loadItem('sga_leaves', []);
    radioHistory = loadItem('sga_radio_history', []);
    auditLog = loadItem('sga_audit_log', []);
}

function saveData() {
    const saveItem = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    saveItem('sga_agents', agents);
    saveItem('sga_planning', planningData);
    saveItem('sga_holidays', holidays);
    saveItem('sga_panic_codes', panicCodes);
    saveItem('sga_radios', radios);
    saveItem('sga_uniforms', uniforms);
    saveItem('sga_warnings', warnings);
    saveItem('sga_leaves', leaves);
    saveItem('sga_radio_history', radioHistory);
    saveItem('sga_audit_log', auditLog);
}

// --- JOURS FÉRIÉS MAROC (SYNC AVEC PYTHON) ---
function loadHolidaysFromCurrentYear() {
    const year = new Date().getFullYear();
    
    // Jours fériés fixes marocains (comme dans Python)
    const fixedHolidays = [
        { date: `${year}-01-01`, description: 'Nouvel An', type: 'fixe' },
        { date: `${year}-01-11`, description: 'Manifeste de l\'Indépendance', type: 'fixe' },
        { date: `${year}-05-01`, description: 'Fête du Travail', type: 'fixe' },
        { date: `${year}-07-30`, description: 'Fête du Trône', type: 'fixe' },
        { date: `${year}-08-14`, description: 'Allégeance Oued Eddahab', type: 'fixe' },
        { date: `${year}-08-20`, description: 'Révolution du Roi et du Peuple', type: 'fixe' },
        { date: `${year}-08-21`, description: 'Fête de la Jeunesse', type: 'fixe' },
        { date: `${year}-11-06`, description: 'Marche Verte', type: 'fixe' },
        { date: `${year}-11-18`, description: 'Fête de l\'Indépendance', type: 'fixe' }
    ];
    
    // Garder les jours fériés manuels existants
    const manualHolidays = holidays.filter(h => h.type === 'manuel');
    
    // Fusionner et mettre à jour
    holidays = [...fixedHolidays, ...manualHolidays];
    saveData();
}

function isHolidayDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(h => h.date === dateStr);
}

// --- LOGIQUE DE CALCUL DES SHIFTS (SYNC AVEC PYTHON) ---
function calculateTheoreticalShift(agentCode, dateStr) {
    const agent = agents.find(a => a.code === agentCode);
    if (!agent || agent.statut !== 'actif') return '-';

    const date = new Date(dateStr);
    const group = agent.groupe;
    
    // Calcul de la date d'entrée (utiliser celle de l'agent ou date par défaut)
    const startDate = agent.date_entree ? new Date(agent.date_entree) : new Date('2025-11-01');
    
    if (group === 'E') {
        // Logique Groupe E (5/7) - comme dans Python
        const dayOfWeek = date.getDay();
        
        // Weekend = repos
        if (dayOfWeek === 0 || dayOfWeek === 6) return 'R';
        
        // Trouver l'index de l'agent dans le groupe E
        const groupEAgents = agents
            .filter(a => a.groupe === 'E' && a.statut === 'actif')
            .sort((a, b) => a.code.localeCompare(b.code));
        
        const agentIndex = groupEAgents.findIndex(a => a.code === agentCode);
        if (agentIndex === -1) return 'R';
        
        // Semaine ISO
        const weekNum = getISOWeek(date);
        const dayParity = date.getDate() % 2 === 0;
        
        // Logique d'alternance basée sur l'index et la semaine
        if (agentIndex === 0) {
            return (weekNum % 2 !== 0) ? (dayParity ? '1' : '2') : (dayParity ? '2' : '1');
        } else if (agentIndex === 1) {
            return (weekNum % 2 !== 0) ? (dayParity ? '2' : '1') : (dayParity ? '1' : '2');
        } else {
            return ((agentIndex + weekNum) % 2 === 0) ? '1' : '2';
        }
    } else {
        // Groupes A, B, C, D - cycle de 8 jours
        const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
        
        // Décalage par groupe (comme dans Python)
        let groupOffset = 0;
        switch(group) {
            case 'A': groupOffset = 0; break;
            case 'B': groupOffset = 2; break;
            case 'C': groupOffset = 4; break;
            case 'D': groupOffset = 6; break;
        }
        
        const cycleDay = (daysSinceStart + groupOffset) % 8;
        
        // Rotation 1,1,2,2,3,3,R,R
        if (cycleDay < 2) return '1';
        if (cycleDay < 4) return '2';
        if (cycleDay < 6) return '3';
        return 'R';
    }
}

function getISOWeek(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function getShiftForAgent(agentCode, dateStr) {
    const monthKey = dateStr.substring(0, 7);
    
    // Vérifier d'abord le planning manuel
    if (planningData[monthKey] && 
        planningData[monthKey][agentCode] && 
        planningData[monthKey][agentCode][dateStr]) {
        return planningData[monthKey][agentCode][dateStr].shift;
    }
    
    // Sinon calculer théorique
    return calculateTheoreticalShift(agentCode, dateStr);
}

// --- GESTION DES CONGÉS PAR PÉRIODE (NOUVEAU) ---
function addLeavePeriod(agentCode, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthKey = startDate.substring(0, 7);
    
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    
    // Appliquer les congés jour par jour
    const currentDate = new Date(start);
    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();
        
        // Dimanche = repos forcé, autres jours = congé
        const shift = (dayOfWeek === 0) ? 'R' : 'C';
        
        if (!planningData[monthKey][agentCode][dateStr]) {
            planningData[monthKey][agentCode][dateStr] = {};
        }
        planningData[monthKey][agentCode][dateStr] = {
            shift: shift,
            modified: new Date().toISOString(),
            origin: 'LEAVE_PERIOD'
        };
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    saveData();
    showSnackbar(`Congé ajouté pour ${agentCode} du ${startDate} au ${endDate}`);
}

// --- INTERFACE UTILISATEUR ---
function openPopup(title, body, footer) {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('popup-content');
    content.innerHTML = `
        <div class="popup-header"><h2>${title}</h2><button class="popup-close-btn" onclick="closePopup()">×</button></div>
        <div class="popup-body">${body}</div>
        <div class="popup-footer">${footer}</div>
    `;
    overlay.classList.add('visible');
}

function closePopup() {
    document.getElementById('overlay').classList.remove('visible');
}

function showSnackbar(msg) {
    const snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    snackbar.textContent = msg;
    snackbar.style.cssText = `
        visibility: visible;
        min-width: 250px;
        margin-left: -125px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 8px;
        padding: 16px;
        position: fixed;
        z-index: 3000;
        left: 50%;
        bottom: 30px;
        font-size: 0.9em;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.style.animation = 'fadeout 0.5s';
        setTimeout(() => {
            if (snackbar.parentNode) snackbar.parentNode.removeChild(snackbar);
        }, 500);
    }, 3000);
}

// --- MENU PRINCIPAL SIMPLIFIÉ ---
function displayMainMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "PLANNING MENSUEL - SGA";
    mainContent.innerHTML = '';

    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-button-container';

    const options = [
        { text: "📅 PLANNING GLOBAL", handler: () => displayGlobalPlanning(), className: "menu-section" },
        { text: "👥 PLANNING PAR GROUPE", handler: () => displayGroupPlanningMenu(), className: "menu-section" },
        { text: "👤 PLANNING PAR AGENT", handler: () => displayAgentPlanningMenu(), className: "menu-section" },
        { text: "➕ AJOUTER PLANNING", handler: () => displayAddPlanningMenu(), className: "menu-section" },
        { text: "📊 STATISTIQUES", handler: () => displayStatisticsMenu(), className: "menu-section" },
        { text: "🏖️ CONGÉS", handler: () => displayLeavesMenu(), className: "menu-section" },
        { text: "🎉 JOURS FÉRIÉS", handler: () => displayHolidaysManager(), className: "menu-section" },
        { text: "⚙️ TOUTES LES OPTIONS", handler: () => displayFullOptionsMenu(), className: "menu-section" },
        { text: "💾 SAUVEGARDER", handler: () => { saveData(); showSnackbar("Données sauvegardées !"); }, className: "menu-section" }
    ];

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.className = 'menu-button' + (option.className ? ' ' + option.className : '');
        btn.onclick = option.handler;
        menuContainer.appendChild(btn);
    });

    mainContent.appendChild(menuContainer);
}

// --- VUE PLANNING GLOBAL ---
function displayGlobalPlanning() {
    const today = new Date();
    displayPlanningView('global', today.getMonth() + 1, today.getFullYear());
}

function displayPlanningView(type, month, year, specificCode = null) {
    const mainContent = document.getElementById('main-content');
    
    let title = '';
    switch(type) {
        case 'global': title = "PLANNING GLOBAL"; break;
        case 'group': title = `PLANNING GROUPE ${specificCode}`; break;
        case 'agent': 
            const agent = agents.find(a => a.code === specificCode);
            title = `PLANNING ${specificCode} - ${agent ? agent.prenom + ' ' + agent.nom : ''}`;
            break;
    }
    
    document.getElementById('sub-title').textContent = `${title} - ${getMonthName(month)} ${year}`;
    mainContent.innerHTML = '';
    
    // Contrôles de navigation
    const controls = document.createElement('div');
    controls.className = 'planning-controls';
    controls.innerHTML = `
        <button onclick="navigatePlanning('prev', '${type}', ${month}, ${year}, '${specificCode || ''}')">◀ Précédent</button>
        <select id="monthSelect" onchange="changePlanningMonth('${type}', '${specificCode || ''}')">
            ${Array.from({length: 12}, (_, i) => 
                `<option value="${i+1}" ${i+1 === month ? 'selected' : ''}>${getMonthName(i+1)}</option>`
            ).join('')}
        </select>
        <input type="number" id="yearInput" value="${year}" min="2024" max="2030" 
               style="width: 80px; padding: 5px; margin: 0 10px;">
        <button onclick="navigatePlanning('next', '${type}', ${month}, ${year}, '${specificCode || ''}')">Suivant ▶</button>
        <button onclick="displayMainMenu()" style="margin-left: 30px;">🏠 Menu</button>
    `;
    mainContent.appendChild(controls);
    
    // Tableau de planning
    const planningTable = generatePlanningTable(type, month, year, specificCode);
    mainContent.appendChild(planningTable);
    
    // Ajouter CSS
    addPlanningStyles();
}

function generatePlanningTable(type, month, year, specificCode = null) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const table = document.createElement('table');
    table.className = 'planning-table';
    
    // En-tête avec jours
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Agent</th>';
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const isHoliday = isHolidayDate(date);
        const dayOfWeek = date.getDay();
        
        const th = document.createElement('th');
        th.innerHTML = `
            <div>${day}</div>
            <div style="font-size: 0.8em; font-weight: normal;">${JOURS_FRANCAIS[dayOfWeek]}</div>
            ${isHoliday ? '<div style="color: #e74c3c; font-size: 0.7em;">🏖️</div>' : ''}
        `;
        
        if (isHoliday) {
            th.style.backgroundColor = '#fff3e0';
            th.style.color = '#e74c3c';
        } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            th.style.backgroundColor = '#f5f5f5';
        }
        
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    
    // Déterminer quels agents afficher
    let agentsToDisplay = [];
    if (type === 'global') {
        agentsToDisplay = agents.filter(a => a.statut === 'actif');
    } else if (type === 'group') {
        agentsToDisplay = agents.filter(a => a.groupe === specificCode && a.statut === 'actif');
    } else if (type === 'agent') {
        agentsToDisplay = agents.filter(a => a.code === specificCode);
    }
    
    // Lignes pour chaque agent
    agentsToDisplay.forEach(agent => {
        const row = document.createElement('tr');
        const agentCell = document.createElement('td');
        agentCell.innerHTML = `
            <strong>${agent.code}</strong><br>
            <small>${agent.prenom} ${agent.nom}</small><br>
            <small style="color: #666;">Groupe ${agent.groupe}</small>
        `;
        row.appendChild(agentCell);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const shift = getShiftForAgent(agent.code, dateStr);
            const date = new Date(dateStr);
            const isHoliday = isHolidayDate(date);
            
            const td = document.createElement('td');
            td.textContent = SHIFT_LABELS[shift] || shift;
            td.style.backgroundColor = SHIFT_COLORS[shift] || '#fff';
            td.style.color = '#fff';
            td.style.textAlign = 'center';
            td.style.cursor = 'pointer';
            td.title = `${dateStr} - ${agent.code}`;
            
            if (isHoliday) {
                td.style.border = '2px solid #ff9800';
                td.style.fontWeight = 'bold';
            }
            
            // Permettre de cliquer pour modifier
            td.onclick = () => showShiftEditor(agent.code, dateStr, shift);
            
            row.appendChild(td);
        }
        
        table.appendChild(row);
    });
    
    return table;
}

// --- ÉDITEUR DE SHIFT ---
function showShiftEditor(agentCode, dateStr, currentShift) {
    const agent = agents.find(a => a.code === agentCode);
    if (!agent) return;
    
    const date = new Date(dateStr);
    const isHoliday = isHolidayDate(date);
    
    openPopup(
        `Modifier shift - ${agentCode}`,
        `
        <div style="padding: 15px;">
            <p><strong>Agent:</strong> ${agent.prenom} ${agent.nom} (${agent.groupe})</p>
            <p><strong>Date:</strong> ${dateStr} (${JOURS_FRANCAIS[date.getDay()]})</p>
            ${isHoliday ? '<p style="color: #e74c3c;">🏖️ Jour férié</p>' : ''}
            <label>Shift:</label>
            <select id="newShift" style="width: 100%; padding: 8px; margin: 10px 0;">
                ${Object.entries(SHIFT_LABELS).map(([key, label]) => 
                    `<option value="${key}" ${key === currentShift ? 'selected' : ''}>${label}</option>`
                ).join('')}
            </select>
            <div style="margin-top: 15px;">
                <button onclick="saveShiftChange('${agentCode}', '${dateStr}')" style="background: #2ecc71; color: white; padding: 8px 15px; border: none; border-radius: 4px; margin-right: 10px;">
                    💾 Enregistrer
                </button>
                <button onclick="setShiftAsLeave('${agentCode}', '${dateStr}')" style="background: #f39c12; color: white; padding: 8px 15px; border: none; border-radius: 4px; margin-right: 10px;">
                    🏖️ Congé
                </button>
                <button onclick="resetToTheoretical('${agentCode}', '${dateStr}')" style="background: #95a5a6; color: white; padding: 8px 15px; border: none; border-radius: 4px;">
                    🔄 Réinitialiser
                </button>
            </div>
        </div>
        `,
        `<button onclick="closePopup()">❌ Fermer</button>`
    );
}

function saveShiftChange(agentCode, dateStr) {
    const newShift = document.getElementById('newShift').value;
    const monthKey = dateStr.substring(0, 7);
    
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    
    planningData[monthKey][agentCode][dateStr] = {
        shift: newShift,
        modified: new Date().toISOString(),
        origin: 'MANUAL'
    };
    
    saveData();
    closePopup();
    
    // Recharger la vue actuelle
    const currentTitle = document.getElementById('sub-title').textContent;
    if (currentTitle.includes('GLOBAL')) {
        displayGlobalPlanning();
    } else if (currentTitle.includes('GROUPE')) {
        const group = currentTitle.match(/GROUPE (\w+)/)[1];
        displayPlanningView('group', new Date().getMonth() + 1, new Date().getFullYear(), group);
    } else if (currentTitle.includes('PLANNING')) {
        const agentCodeMatch = currentTitle.match(/PLANNING (\w+)/);
        if (agentCodeMatch) {
            displayPlanningView('agent', new Date().getMonth() + 1, new Date().getFullYear(), agentCodeMatch[1]);
        }
    }
    
    showSnackbar(`Shift modifié pour ${agentCode} le ${dateStr}`);
}

// --- MENUS SPÉCIFIQUES ---
function displayGroupPlanningMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "PLANNING PAR GROUPE";
    mainContent.innerHTML = '';
    
    const groups = ['A', 'B', 'C', 'D', 'E'];
    const container = document.createElement('div');
    container.className = 'group-selector';
    
    groups.forEach(group => {
        const btn = document.createElement('button');
        btn.textContent = `Groupe ${group}`;
        btn.className = 'group-button';
        btn.onclick = () => displayPlanningView('group', new Date().getMonth() + 1, new Date().getFullYear(), group);
        container.appendChild(btn);
    });
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '20px';
    container.appendChild(backBtn);
    
    mainContent.appendChild(container);
}

function displayAgentPlanningMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "PLANNING PAR AGENT";
    mainContent.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'agent-selector';
    
    agents.filter(a => a.statut === 'actif').forEach(agent => {
        const btn = document.createElement('button');
        btn.innerHTML = `
            <strong>${agent.code}</strong><br>
            <small>${agent.prenom} ${agent.nom}</small><br>
            <small>Groupe ${agent.groupe}</small>
        `;
        btn.className = 'agent-button';
        btn.onclick = () => displayPlanningView('agent', new Date().getMonth() + 1, new Date().getFullYear(), agent.code);
        container.appendChild(btn);
    });
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '20px';
    container.appendChild(backBtn);
    
    mainContent.appendChild(container);
}

function displayAddPlanningMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "AJOUTER PLANNING";
    mainContent.innerHTML = `
        <div style="padding: 20px;">
            <h3>Options d'ajout de planning</h3>
            <div class="add-options">
                <button onclick="showAddShiftForm()" class="add-button">
                    ➕ Ajouter shift manuel
                </button>
                <button onclick="showAddLeaveForm()" class="add-button">
                    🏖️ Ajouter congé par période
                </button>
                <button onclick="showMassUpdateForm()" class="add-button">
                    📝 Mise à jour en masse
                </button>
                <button onclick="importPlanningFromExcel()" class="add-button">
                    📊 Importer depuis Excel
                </button>
            </div>
            <button onclick="displayMainMenu()" style="margin-top: 30px;">← Retour</button>
        </div>
    `;
}

function displayStatisticsMenu() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = `STATISTIQUES - ${getMonthName(month)} ${year}`;
    mainContent.innerHTML = '';
    
    // Calculer les statistiques
    const stats = calculateMonthlyStatistics(month, year);
    
    const statsHTML = `
        <div style="padding: 20px;">
            <h3>Statistiques du mois</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalAgents}</div>
                    <div class="stat-label">Agents actifs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalShifts}</div>
                    <div class="stat-label">Shifts opérationnels</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.holidaysCount}</div>
                    <div class="stat-label">Jours fériés</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.leavesCount}</div>
                    <div class="stat-label">Congés</div>
                </div>
            </div>
            
            <h3 style="margin-top: 30px;">Répartition par groupe</h3>
            <div class="group-stats">
                ${Object.entries(stats.byGroup).map(([group, count]) => `
                    <div class="group-stat">
                        <span>Groupe ${group}:</span>
                        <span>${count} agents</span>
                    </div>
                `).join('')}
            </div>
            
            <h3 style="margin-top: 30px;">Répartition des shifts</h3>
            <div class="shift-stats">
                ${Object.entries(stats.byShift).map(([shift, count]) => `
                    <div class="shift-stat">
                        <span>${SHIFT_LABELS[shift] || shift}:</span>
                        <span>${count}</span>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="displayMainMenu()" style="margin-top: 30px;">← Retour</button>
        </div>
    `;
    
    mainContent.innerHTML = statsHTML;
    addStatsStyles();
}

function displayLeavesMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "GESTION DES CONGÉS";
    mainContent.innerHTML = `
        <div style="padding: 20px;">
            <h3>Ajouter un congé par période</h3>
            <div class="leave-form">
                <div style="margin-bottom: 15px;">
                    <label>Agent:</label>
                    <select id="leaveAgent" style="width: 200px; padding: 8px;">
                        ${agents.filter(a => a.statut === 'actif').map(a => 
                            `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label>Date début:</label>
                    <input type="date" id="leaveStart" style="padding: 8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label>Date fin:</label>
                    <input type="date" id="leaveEnd" style="padding: 8px;">
                </div>
                <button onclick="addNewLeavePeriod()" style="background: #2ecc71; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
                    🏖️ Ajouter congé
                </button>
            </div>
            
            <h3 style="margin-top: 30px;">Congés enregistrés</h3>
            <div id="leavesList" style="margin-top: 15px;">
                ${generateLeavesListHTML()}
            </div>
            
            <button onclick="displayMainMenu()" style="margin-top: 30px;">← Retour</button>
        </div>
    `;
}

function displayHolidaysManager() {
    const year = new Date().getFullYear();
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "GESTION DES JOURS FÉRIÉS";
    mainContent.innerHTML = `
        <div style="padding: 20px;">
            <h3>Jours fériés ${year}</h3>
            <div class="holidays-list">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Date</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Description</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Type</th>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${holidays.map(holiday => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${holiday.date}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${holiday.description}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${holiday.type}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                    ${holiday.type === 'manuel' ? 
                                        `<button onclick="deleteHoliday('${holiday.date}')" style="background: #e74c3c; color: white; padding: 5px 10px; border: none; border-radius: 3px; font-size: 0.9em;">
                                            Supprimer
                                        </button>` : 
                                        '<span style="color: #666;">Fixe</span>'
                                    }
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <h3 style="margin-top: 30px;">Ajouter un jour férié manuel</h3>
            <div class="add-holiday-form">
                <div style="margin-bottom: 15px;">
                    <label>Date:</label>
                    <input type="date" id="newHolidayDate" style="padding: 8px; margin-left: 10px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label>Description:</label>
                    <input type="text" id="newHolidayDesc" placeholder="Description" style="padding: 8px; margin-left: 10px; width: 300px;">
                </div>
                <button onclick="addManualHoliday()" style="background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
                    ➕ Ajouter
                </button>
            </div>
            
            <button onclick="displayMainMenu()" style="margin-top: 30px;">← Retour</button>
        </div>
    `;
}

function displayFullOptionsMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "TOUTES LES OPTIONS";
    mainContent.innerHTML = '';
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'full-menu-container';
    
    const allOptions = [
        // Gestion Agents
        { text: "👥 Liste des Agents", handler: displayAgentsList },
        { text: "➕ Ajouter Agent", handler: showAddAgentForm },
        { text: "✏️ Modifier Agent", handler: showEditAgentForm },
        { text: "🗑️ Supprimer Agent", handler: showDeleteAgentForm },
        
        // Planning
        { text: "📅 Planning Global", handler: displayGlobalPlanning },
        { text: "👥 Planning par Groupe", handler: displayGroupPlanningMenu },
        { text: "👤 Planning par Agent", handler: displayAgentPlanningMenu },
        { text: "📝 Éditeur Planning", handler: showMassEditor },
        
        // Congés & Absences
        { text: "🏖️ Gestion Congés", handler: displayLeavesMenu },
        { text: "🤒 Absences Maladie", handler: showSicknessForm },
        { text: "📅 Congés par Période", handler: showLeavePeriodForm },
        
        // Jours Fériés
        { text: "🎉 Jours Fériés", handler: displayHolidaysManager },
        { text: "➕ Ajouter Férié", handler: showAddHolidayForm },
        
        // Statistiques
        { text: "📊 Statistiques Globales", handler: displayStatisticsMenu },
        { text: "📈 Statistiques par Agent", handler: showAgentStats },
        { text: "🏆 Classement", handler: showRanking },
        
        // Codes Panique
        { text: "🚨 Codes Panique", handler: displayPanicCodesMenu },
        { text: "➕ Ajouter Code", handler: showAddPanicCodeForm },
        
        // Radios
        { text: "📻 Gestion Radios", handler: displayRadiosMenu },
        { text: "🔊 Attribuer Radio", handler: showAssignRadioForm },
        
        // Habillement
        { text: "👔 Habillement", handler: displayUniformMenu },
        { text: "📋 Rapport Tailles", handler: showUniformReport },
        
        // Avertissements
        { text: "⚠️ Avertissements", handler: displayWarningsMenu },
        { text: "➕ Nouvel Avertissement", handler: showAddWarningForm },
        
        // Exportations
        { text: "💾 Exporter Excel", handler: showExportMenu },
        { text: "📄 Exporter PDF", handler: exportToPDF },
        { text: "🖨️ Imprimer Planning", handler: printPlanning },
        
        // Configuration
        { text: "⚙️ Configuration", handler: displayConfigMenu },
        { text: "🔄 Réinitialiser", handler: showResetConfirmation },
        { text: "📁 Sauvegarde", handler: showBackupMenu }
    ];
    
    allOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.className = 'full-menu-button';
        btn.onclick = option.handler;
        menuContainer.appendChild(btn);
    });
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour au Menu Principal';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '30px';
    backBtn.style.padding = '10px 20px';
    
    mainContent.appendChild(menuContainer);
    mainContent.appendChild(backBtn);
}

// --- FONCTIONS UTILITAIRES ---
function getMonthName(month) {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1] || '';
}

function navigatePlanning(direction, type, month, year, specificCode) {
    if (direction === 'prev') {
        month--;
        if (month < 1) {
            month = 12;
            year--;
        }
    } else if (direction === 'next') {
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
    }
    
    displayPlanningView(type, month, year, specificCode || null);
}

function changePlanningMonth(type, specificCode) {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearInput').value) || new Date().getFullYear();
    displayPlanningView(type, month, year, specificCode || null);
}

function calculateMonthlyStatistics(month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const activeAgents = agents.filter(a => a.statut === 'actif');
    
    let totalShifts = 0;
    const byShift = { '1': 0, '2': 0, '3': 0, 'R': 0, 'C': 0, 'M': 0, 'A': 0, '-': 0 };
    const byGroup = {};
    
    activeAgents.forEach(agent => {
        if (!byGroup[agent.groupe]) byGroup[agent.groupe] = 0;
        byGroup[agent.groupe]++;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const shift = getShiftForAgent(agent.code, dateStr);
            if (byShift[shift] !== undefined) byShift[shift]++;
            if (['1', '2', '3'].includes(shift)) totalShifts++;
        }
    });
    
    return {
        totalAgents: activeAgents.length,
        totalShifts: totalShifts,
        holidaysCount: holidays.filter(h => h.date.startsWith(`${year}-${month.toString().padStart(2, '0')}`)).length,
        leavesCount: Object.values(byShift).reduce((a, b) => a + b, 0) - (byShift['1'] + byShift['2'] + byShift['3'] + byShift['R']),
        byShift: byShift,
        byGroup: byGroup
    };
}

function addNewLeavePeriod() {
    const agentCode = document.getElementById('leaveAgent').value;
    const startDate = document.getElementById('leaveStart').value;
    const endDate = document.getElementById('leaveEnd').value;
    
    if (!agentCode || !startDate || !endDate) {
        showSnackbar("Veuillez remplir tous les champs");
        return;
    }
    
    addLeavePeriod(agentCode, startDate, endDate);
    displayLeavesMenu(); // Recharger la vue
}

function generateLeavesListHTML() {
    // Simplifié pour l'exemple
    return `<p>${leaves.length} congés enregistrés</p>`;
}

function addManualHoliday() {
    const date = document.getElementById('newHolidayDate').value;
    const description = document.getElementById('newHolidayDesc').value;
    
    if (!date || !description) {
        showSnackbar("Veuillez remplir tous les champs");
        return;
    }
    
    holidays.push({
        date: date,
        description: description,
        type: 'manuel'
    });
    
    saveData();
    displayHolidaysManager(); // Recharger la vue
    showSnackbar(`Jour férié ajouté: ${description} (${date})`);
}

function deleteHoliday(date) {
    if (confirm("Supprimer ce jour férié ?")) {
        holidays = holidays.filter(h => h.date !== date);
        saveData();
        displayHolidaysManager(); // Recharger la vue
        showSnackbar("Jour férié supprimé");
    }
}

function setShiftAsLeave(agentCode, dateStr) {
    const monthKey = dateStr.substring(0, 7);
    
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    
    planningData[monthKey][agentCode][dateStr] = {
        shift: 'C',
        modified: new Date().toISOString(),
        origin: 'LEAVE'
    };
    
    saveData();
    closePopup();
    showSnackbar(`Congé ajouté pour ${agentCode} le ${dateStr}`);
}

function resetToTheoretical(agentCode, dateStr) {
    const monthKey = dateStr.substring(0, 7);
    
    if (planningData[monthKey] && 
        planningData[monthKey][agentCode] && 
        planningData[monthKey][agentCode][dateStr]) {
        delete planningData[monthKey][agentCode][dateStr];
    }
    
    saveData();
    closePopup();
    showSnackbar(`Shift réinitialisé pour ${agentCode} le ${dateStr}`);
}

// --- STYLES ---
function addPlanningStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .planning-controls {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .planning-controls button, .planning-controls select, .planning-controls input {
            padding: 8px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
        }
        
        .planning-controls button {
            background: #3498db;
            color: white;
            border: none;
            cursor: pointer;
        }
        
        .planning-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 0.9em;
        }
        
        .planning-table th, .planning-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            min-width: 40px;
        }
        
        .planning-table th {
            background: #2c3e50;
            color: white;
            font-weight: bold;
        }
        
        .planning-table tr:hover {
            background: #f5f5f5;
        }
        
        .group-selector, .agent-selector {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            padding: 20px;
        }
        
        .group-button, .agent-button {
            padding: 15px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .group-button:hover, .agent-button:hover {
            background: #3498db;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .full-menu-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
            padding: 20px;
        }
        
        .full-menu-button {
            padding: 12px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
            font-size: 0.9em;
            transition: all 0.2s;
        }
        
        .full-menu-button:hover {
            background: #f8f9fa;
            border-color: #3498db;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
        
        .group-stats, .shift-stats {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .group-stat, .shift-stat {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .group-stat:last-child, .shift-stat:last-child {
            border-bottom: none;
        }
        
        .add-options {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .add-button {
            padding: 20px;
            background: white;
            border: 2px dashed #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .add-button:hover {
            border-color: #3498db;
            background: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
}

function addStatsStyles() {
    // Les styles sont déjà inclus dans addPlanningStyles
}

// --- DONNÉES DE TEST ---
function initializeTestData() {
    agents = [
        { code: 'A01', nom: 'Dupont', prenom: 'Alice', groupe: 'A', matricule: 'MAT001', cin: 'AA123456', tel: '0601-010101', poste: 'Agent de sécurité', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'B02', nom: 'Martin', prenom: 'Bob', groupe: 'B', matricule: 'MAT002', cin: 'BB654321', tel: '0602-020202', poste: 'Superviseur', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'C03', nom: 'Lefevre', prenom: 'Carole', groupe: 'C', matricule: 'MAT003', cin: 'CC789012', tel: '0603-030303', poste: 'Agent de sécurité', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'D04', nom: 'Dubois', prenom: 'David', groupe: 'D', matricule: 'MAT004', cin: 'DD345678', tel: '0604-040404', poste: 'Chef d\'équipe', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'E01', nom: 'Zahiri', prenom: 'Ahmed', groupe: 'E', matricule: 'MAT005', cin: 'EE901234', tel: '0605-050505', poste: 'Agent spécial', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' },
        { code: 'E02', nom: 'Zarrouk', prenom: 'Benoit', groupe: 'E', matricule: 'MAT006', cin: 'FF567890', tel: '0606-060606', poste: 'Agent spécial', date_entree: '2025-11-01', date_sortie: null, statut: 'actif' }
    ];
    
    loadHolidaysFromCurrentYear();
    saveData();
}

// --- FONCTIONS À IMPLÉMENTER (STUBS) ---
function displayAgentsList() { showSnackbar("À implémenter: Liste des agents"); }
function showAddAgentForm() { showSnackbar("À implémenter: Ajouter agent"); }
function showEditAgentForm() { showSnackbar("À implémenter: Modifier agent"); }
function showDeleteAgentForm() { showSnackbar("À implémenter: Supprimer agent"); }
function showMassEditor() { showSnackbar("À implémenter: Éditeur en masse"); }
function showSicknessForm() { showSnackbar("À implémenter: Absences maladie"); }
function showLeavePeriodForm() { showSnackbar("À implémenter: Congés par période"); }
function showAddHolidayForm() { showSnackbar("À implémenter: Ajouter férié"); }
function showAgentStats() { showSnackbar("À implémenter: Stats par agent"); }
function showRanking() { showSnackbar("À implémenter: Classement"); }
function displayPanicCodesMenu() { showSnackbar("À implémenter: Codes panique"); }
function showAddPanicCodeForm() { showSnackbar("À implémenter: Ajouter code panique"); }
function displayRadiosMenu() { showSnackbar("À implémenter: Gestion radios"); }
function showAssignRadioForm() { showSnackbar("À implémenter: Attribuer radio"); }
function displayUniformMenu() { showSnackbar("À implémenter: Habillement"); }
function showUniformReport() { showSnackbar("À implémenter: Rapport tailles"); }
function displayWarningsMenu() { showSnackbar("À implémenter: Avertissements"); }
function showAddWarningForm() { showSnackbar("À implémenter: Nouvel avertissement"); }
function showExportMenu() { showSnackbar("À implémenter: Exporter Excel"); }
function exportToPDF() { showSnackbar("À implémenter: Exporter PDF"); }
function printPlanning() { showSnackbar("À implémenter: Imprimer planning"); }
function displayConfigMenu() { showSnackbar("À implémenter: Configuration"); }
function showResetConfirmation() { 
    if (confirm("Réinitialiser toutes les données ?")) {
        localStorage.clear();
        location.reload();
    }
}
function showBackupMenu() { showSnackbar("À implémenter: Sauvegarde"); }
function showAddShiftForm() { showSnackbar("À implémenter: Ajouter shift"); }
function showMassUpdateForm() { showSnackbar("À implémenter: Mise à jour en masse"); }
function importPlanningFromExcel() { showSnackbar("À implémenter: Importer Excel"); }

console.log("✅ app.js corrigé chargé avec succès");
