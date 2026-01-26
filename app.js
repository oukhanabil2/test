// app.js - VERSION COMPLÈTE CORRIGÉE
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

// --- DONNÉES DE TEST ---
function initializeTestData() {
    agents = agentsData || [];
    
    if (agents.length === 0) {
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
            }
        ];
    }
    
    loadHolidaysFromCurrentYear();
    saveData();
    console.log("✅ Données initialisées avec", agents.length, "agents");
}

// --- GESTION DES DONNÉES ---
function loadData() {
    try {
        const savedAgents = localStorage.getItem('sga_agents');
        if (savedAgents) agents = JSON.parse(savedAgents);
        
        const savedPlanning = localStorage.getItem('sga_planning');
        if (savedPlanning) planningData = JSON.parse(savedPlanning);
        
        const savedPanicCodes = localStorage.getItem('sga_panic_codes');
        if (savedPanicCodes) panicCodes = JSON.parse(savedPanicCodes);
        
        const savedRadios = localStorage.getItem('sga_radios');
        if (savedRadios) radios = JSON.parse(savedRadios);
        
        const savedUniforms = localStorage.getItem('sga_uniforms');
        if (savedUniforms) uniforms = JSON.parse(savedUniforms);
        
        const savedWarnings = localStorage.getItem('sga_warnings');
        if (savedWarnings) warnings = JSON.parse(savedWarnings);
        
        const savedLeaves = localStorage.getItem('sga_leaves');
        if (savedLeaves) leaves = JSON.parse(savedLeaves);
        
        const savedRadioHistory = localStorage.getItem('sga_radio_history');
        if (savedRadioHistory) radioHistory = JSON.parse(savedRadioHistory);
        
        const savedAuditLog = localStorage.getItem('sga_audit_log');
        if (savedAuditLog) auditLog = JSON.parse(savedAuditLog);
        
        console.log("📊 Données chargées depuis localStorage");
    } catch (error) {
        console.error("❌ Erreur lors du chargement des données:", error);
    }
}

function saveData() {
    try {
        localStorage.setItem('sga_agents', JSON.stringify(agents));
        localStorage.setItem('sga_planning', JSON.stringify(planningData));
        localStorage.setItem('sga_panic_codes', JSON.stringify(panicCodes));
        localStorage.setItem('sga_radios', JSON.stringify(radios));
        localStorage.setItem('sga_uniforms', JSON.stringify(uniforms));
        localStorage.setItem('sga_warnings', JSON.stringify(warnings));
        localStorage.setItem('sga_leaves', JSON.stringify(leaves));
        localStorage.setItem('sga_radio_history', JSON.stringify(radioHistory));
        localStorage.setItem('sga_audit_log', JSON.stringify(auditLog));
        
        console.log("💾 Données sauvegardées");
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde:", error);
    }
}

// --- GESTION DES JOURS FÉRIÉS ---
function loadHolidaysFromCurrentYear() {
    const currentYear = new Date().getFullYear();
    holidays = [
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
}

function isHolidayDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(holiday => holiday.date === dateStr);
}

// --- MENU PRINCIPAL ---
function displayMainMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "MENU PRINCIPAL";
    
    mainContent.innerHTML = `
        <div class="menu-button-container">
            <button class="menu-button" onclick="displayPlanningManager()">📅 Gestion Planning</button>
            <button class="menu-button" onclick="displayAgentsList()">👥 Gestion Agents</button>
            <button class="menu-button" onclick="displayPanicCodesMenu()">🔐 Codes Panique</button>
            <button class="menu-button" onclick="displayRadiosMenu()">📻 Gestion Radios</button>
            <button class="menu-button" onclick="displayUniformMenu()">👔 Habillement</button>
            <button class="menu-button" onclick="displayWarningsMenu()">⚠️ Avertissements</button>
            <button class="menu-button" onclick="displayStatisticsMenu()">📊 Statistiques</button>
            <button class="menu-button" onclick="displayConfigMenu()">⚙️ Configuration</button>
            <button class="menu-button quit-button" onclick="showQuitConfirmation()">🚪 Quitter</button>
        </div>
    `;
}

// --- FONCTIONS DE BASE ---
function openPopup(title, body, footer) {
    const overlay = document.getElementById('overlay');
    const popupContent = document.querySelector('.popup-content');
    
    popupContent.innerHTML = `
        <div class="popup-header">
            <h2>${title}</h2>
            <button class="popup-close-btn" onclick="closePopup()">&times;</button>
        </div>
        <div class="popup-body">${body}</div>
        <div class="popup-footer">${footer}</div>
    `;
    
    overlay.classList.add('visible');
}

function closePopup() {
    document.getElementById('overlay').classList.remove('visible');
}

function showSnackbar(message, duration = 3000) {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.className = "show";
    
    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
    }, duration);
}

function getMonthName(month) {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month - 1];
}

function getShiftForAgent(agentCode, dateStr) {
    const monthKey = dateStr.substring(0, 7);
    if (planningData[monthKey] && 
        planningData[monthKey][agentCode] && 
        planningData[monthKey][agentCode][dateStr]) {
        return planningData[monthKey][agentCode][dateStr].shift || '-';
    }
    return '-';
}

// --- GESTION DU PLANNING ---
function displayPlanningManager() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    openPopup(
        'Gestion du Planning',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Mois:</label>
                <select id="planningMonth" class="form-input">
                    ${Array.from({length: 12}, (_, i) => 
                        `<option value="${i+1}" ${i+1 === currentMonth ? 'selected' : ''}>${getMonthName(i+1)}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Année:</label>
                <input type="number" id="planningYear" value="${currentYear}" class="form-input" min="2024" max="2030">
            </div>
            <div class="form-group">
                <label>Groupe:</label>
                <select id="planningGroup" class="form-input">
                    <option value="A">Groupe A</option>
                    <option value="B">Groupe B</option>
                    <option value="C">Groupe C</option>
                    <option value="D">Groupe D</option>
                    <option value="E">Groupe E</option>
                    <option value="ALL">Tous les groupes</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="generatePlanning()">Générer Planning</button>
        <button class="popup-button blue" onclick="editPlanning()">Éditer Planning</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function generatePlanning() {
    const month = parseInt(document.getElementById('planningMonth').value);
    const year = parseInt(document.getElementById('planningYear').value);
    const group = document.getElementById('planningGroup').value;
    
    // Logique de génération de planning simplifiée
    showSnackbar(`Planning généré pour ${getMonthName(month)} ${year} - Groupe ${group}`);
    closePopup();
}

function editPlanning() {
    const month = parseInt(document.getElementById('planningMonth').value);
    const year = parseInt(document.getElementById('planningYear').value);
    const group = document.getElementById('planningGroup').value;
    
    // Rediriger vers l'éditeur de planning
    closePopup();
    displayPlanningEditor(month, year, group);
}

function displayPlanningEditor(month, year, groupFilter = 'ALL') {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = `PLANNING - ${getMonthName(month)} ${year}`;
    
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
    
    // Filtrer les agents par groupe
    const filteredAgents = groupFilter === 'ALL' 
        ? agents.filter(a => a.statut === 'actif')
        : agents.filter(a => a.groupe === groupFilter && a.statut === 'actif');
    
    // Créer l'en-tête du tableau
    let tableHTML = `
        <table class="planning-table">
            <thead>
                <tr>
                    <th>Agent</th>
                    ${Array.from({length: daysInMonth}, (_, i) => {
                        const date = new Date(year, month - 1, i + 1);
                        const isHoliday = isHolidayDate(date);
                        return `<th class="${isHoliday ? 'holiday' : ''}">${i + 1}<br>${JOURS_FRANCAIS[date.getDay()]}</th>`;
                    }).join('')}
                </tr>
            </thead>
            <tbody>
    `;
    
    // Ajouter les lignes des agents
    filteredAgents.forEach(agent => {
        tableHTML += `<tr><td><strong>${agent.code}</strong><br><small>${agent.prenom}</small></td>`;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dateStr = date.toISOString().split('T')[0];
            const shift = getShiftForAgent(agent.code, dateStr);
            const isHoliday = isHolidayDate(date);
            
            tableHTML += `
                <td class="shift-cell ${isHoliday ? 'holiday' : ''}" 
                    style="background-color: ${SHIFT_COLORS[shift] || '#ecf0f1'}; color: white;"
                    onclick="changeShift('${agent.code}', '${dateStr}')">
                    ${shift}
                </td>
            `;
        }
        
        tableHTML += `</tr>`;
    });
    
    tableHTML += `</tbody></table>`;
    
    mainContent.innerHTML = tableHTML;
    
    // Ajouter les boutons de contrôle
    const controlDiv = document.createElement('div');
    controlDiv.style.marginTop = '20px';
    controlDiv.style.display = 'flex';
    controlDiv.style.gap = '10px';
    controlDiv.style.flexWrap = 'wrap';
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour au menu';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Sauvegarder';
    saveBtn.className = 'menu-button';
    saveBtn.onclick = () => {
        saveData();
        showSnackbar('Planning sauvegardé');
    };
    
    const printBtn = document.createElement('button');
    printBtn.textContent = '🖨️ Imprimer';
    printBtn.className = 'menu-button';
    printBtn.onclick = () => window.print();
    
    controlDiv.appendChild(backBtn);
    controlDiv.appendChild(saveBtn);
    controlDiv.appendChild(printBtn);
    mainContent.appendChild(controlDiv);
}

function changeShift(agentCode, dateStr) {
    const shifts = ['1', '2', '3', 'R', 'C', 'M', 'A', '-'];
    const currentShift = getShiftForAgent(agentCode, dateStr);
    const currentIndex = shifts.indexOf(currentShift);
    const nextIndex = (currentIndex + 1) % shifts.length;
    const nextShift = shifts[nextIndex];
    
    // Mettre à jour les données
    const monthKey = dateStr.substring(0, 7);
    if (!planningData[monthKey]) planningData[monthKey] = {};
    if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
    
    planningData[monthKey][agentCode][dateStr] = {
        shift: nextShift,
        modified: new Date().toISOString(),
        user: 'system'
    };
    
    // Recharger l'affichage
    const date = new Date(dateStr);
    displayPlanningEditor(date.getMonth() + 1, date.getFullFullYear());
}

// --- GESTION DES AGENTS ---
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
        date_entree: DATE_AFFECTATION_BASE,
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
        statut: document.getElementById('editAgentStatut').value
    };

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

// --- GESTION DES CODES PANIQUE ---
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
                    <th>Agent</th>
                    <th>Code Panique</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${panicCodes.map(pc => {
                    const agent = agents.find(a => a.code === pc.agent_code);
                    return `
                        <tr>
                            <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : pc.agent_code}</td>
                            <td><strong>${pc.code}</strong></td>
                            <td>
                                <button class="action-btn red small" onclick="deletePanicCode('${pc.agent_code}')">Supprimer</button>
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
    backBtn.style.marginTop = '10px';

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
                <input type="text" id="panicCodeValue" class="form-input" required>
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
    const agent_code = document.getElementById('panicAgentCode').value;
    const code = document.getElementById('panicCodeValue').value;

    // Vérifier si l'agent a déjà un code
    const existingIndex = panicCodes.findIndex(pc => pc.agent_code === agent_code);
    
    if (existingIndex !== -1) {
        panicCodes[existingIndex] = { 
            agent_code, 
            code,
            created_at: new Date().toISOString().split('T')[0]
        };
    } else {
        panicCodes.push({ 
            agent_code, 
            code,
            created_at: new Date().toISOString().split('T')[0]
        });
    }

    saveData();
    closePopup();
    displayPanicCodesMenu();
    showSnackbar(`Code panique enregistré pour ${agent_code}`);
}

function deletePanicCode(agent_code) {
    if (confirm(`Supprimer le code panique de l'agent ${agent_code} ?`)) {
        panicCodes = panicCodes.filter(pc => pc.agent_code !== agent_code);
        saveData();
        displayPanicCodesMenu();
        showSnackbar(`Code panique supprimé pour ${agent_code}`);
    }
}

// --- GESTION DES RADIOS ---
function displayRadiosMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "GESTION DES RADIOS";
    mainContent.innerHTML = '';

    if (radios.length === 0) {
        initializeRadios();
    }

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
                const attribution = radioHistory.find(rh => rh.id_radio === radio.id && !rh.date_retour);
                const agent = attribution ? agents.find(a => a.code === attribution.code_agent) : null;
                return `
                    <tr>
                        <td><strong>${radio.id}</strong></td>
                        <td>${radio.modele}</td>
                        <td><span class="status-badge ${radio.statut.toLowerCase().replace('é', 'e')}">${radio.statut}</span></td>
                        <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : '-'}</td>
                        <td>
                            ${radio.statut === 'DISPONIBLE' ? 
                                `<button class="action-btn green small" onclick="showAssignRadioForm('${radio.id}')">Attribuer</button>` : 
                                radio.statut === 'ATTRIBUÉE' ? 
                                `<button class="action-btn orange small" onclick="returnRadio('${radio.id}')">Retour</button>` : 
                                ''
                            }
                            <button class="action-btn blue small" onclick="editRadio('${radio.id}')">Modifier</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    mainContent.appendChild(table);

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter une radio';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddRadioForm;
    addBtn.style.marginTop = '20px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '10px';

    mainContent.appendChild(addBtn);
    mainContent.appendChild(backBtn);
}

function initializeRadios() {
    if (radios.length === 0) {
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
            }
        ];
    }
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
    const id = document.getElementById('radioId').value.toUpperCase();
    const modele = document.getElementById('radioModele').value;
    const statut = document.getElementById('radioStatut').value;

    // Vérifier si la radio existe déjà
    const existingIndex = radios.findIndex(r => r.id === id);
    
    if (existingIndex !== -1) {
        radios[existingIndex] = { id, modele, statut };
    } else {
        radios.push({ id, modele, statut });
    }

    saveData();
    closePopup();
    displayRadiosMenu();
    showSnackbar(`Radio ${id} enregistrée`);
}

function showAssignRadioForm(radioId) {
    const radio = radios.find(r => r.id === radioId);
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
    const radioIndex = radios.findIndex(r => r.id === radioId);
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
    const radioIndex = radios.findIndex(r => r.id === radioId);
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
    const radio = radios.find(r => r.id === radioId);
    if (!radio) return;

    openPopup(
        `Modifier la radio ${radioId}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>ID Radio:</label>
                <input type="text" id="editRadioId" value="${radio.id}" class="form-input" readonly>
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
    const radioIndex = radios.findIndex(r => r.id === oldRadioId);
    if (radioIndex === -1) return;

    const id = document.getElementById('editRadioId').value.toUpperCase();
    const modele = document.getElementById('editRadioModele').value;
    const statut = document.getElementById('editRadioStatut').value;

    radios[radioIndex] = { id, modele, statut };

    saveData();
    closePopup();
    displayRadiosMenu();
    showSnackbar(`Radio ${id} modifiée`);
}

// --- GESTION HABILLEMENT ---
function displayUniformMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "HABILLEMENT - TAILLES";
    mainContent.innerHTML = '';

    if (uniforms.length === 0) {
        initializeUniforms();
    }

    const table = document.createElement('table');
    table.className = 'planning-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Agent</th>
                <th>Chemise</th>
                <th>Pantalon</th>
                <th>Veste</th>
                <th>Cravate</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${uniforms.map(uniform => {
                const agent = agents.find(a => a.code === uniform.agent_code);
                return `
                    <tr>
                        <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : uniform.agent_code}</td>
                        <td>${uniform.chemise_taille || '-'}</td>
                        <td>${uniform.pantalon_taille || '-'}</td>
                        <td>${uniform.jacket_taille || '-'}</td>
                        <td>${uniform.cravate_oui ? 'Oui' : 'Non'}</td>
                        <td>
                            <button class="action-btn blue small" onclick="editUniform('${uniform.agent_code}')">Modifier</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    mainContent.appendChild(table);

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter habillement';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddUniformForm;
    addBtn.style.marginTop = '20px';

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    backBtn.style.marginTop = '10px';

    mainContent.appendChild(addBtn);
    mainContent.appendChild(backBtn);
}

function initializeUniforms() {
    if (uniforms.length === 0) {
        agents.filter(a => a.statut === 'actif').forEach(agent => {
            const taillesChemise = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            const taillesPantalon = ['38', '40', '42', '44', '46', '48'];
            const taillesJacket = ['S', 'M', 'L', 'XL', 'XXL'];
            
            uniforms.push({
                agent_code: agent.code,
                chemise_taille: taillesChemise[Math.floor(Math.random() * taillesChemise.length)],
                chemise_date: '2024-01-15',
                pantalon_taille: taillesPantalon[Math.floor(Math.random() * taillesPantalon.length)],
                pantalon_date: '2024-01-15',
                jacket_taille: taillesJacket[Math.floor(Math.random() * taillesJacket.length)],
                jacket_date: '2024-01-15',
                cravate_oui: Math.random() > 0.5,
                cravate_date: '2024-01-15'
            });
        });
        saveData();
    }
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
                <label>Pantalon - Taille:</label>
                <input type="text" id="pantalonTaille" class="form-input" placeholder="Ex: 38, 40, 42">
            </div>
            <div class="form-group">
                <label>Veste - Taille:</label>
                <input type="text" id="jacketTaille" class="form-input" placeholder="Ex: 42, 44, 46">
            </div>
            <div class="form-group">
                <label>Cravate (Oui/Non):</label>
                <select id="cravateOui" class="form-input">
                    <option value="false">Non</option>
                    <option value="true">Oui</option>
                </select>
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
    const agent_code = document.getElementById('uniformAgentCode').value;
    const chemise_taille = document.getElementById('chemiseTaille').value || null;
    const pantalon_taille = document.getElementById('pantalonTaille').value || null;
    const jacket_taille = document.getElementById('jacketTaille').value || null;
    const cravate_oui = document.getElementById('cravateOui').value === 'true';

    // Vérifier si l'agent a déjà des informations
    const existingIndex = uniforms.findIndex(u => u.agent_code === agent_code);
    
    const uniformData = {
        agent_code,
        chemise_taille,
        chemise_date: new Date().toISOString().split('T')[0],
        pantalon_taille,
        pantalon_date: new Date().toISOString().split('T')[0],
        jacket_taille,
        jacket_date: new Date().toISOString().split('T')[0],
        cravate_oui,
        cravate_date: new Date().toISOString().split('T')[0]
    };

    if (existingIndex !== -1) {
        uniforms[existingIndex] = uniformData;
    } else {
        uniforms.push(uniformData);
    }

    saveData();
    closePopup();
    displayUniformMenu();
    showSnackbar(`Informations habillement enregistrées pour ${agent_code}`);
}

function editUniform(agent_code) {
    const uniform = uniforms.find(u => u.agent_code === agent_code);
    if (!uniform) return;

    openPopup(
        `Modifier habillement - ${agent_code}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Chemise - Taille:</label>
                <input type="text" id="editChemiseTaille" value="${uniform.chemise_taille || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Pantalon - Taille:</label>
                <input type="text" id="editPantalonTaille" value="${uniform.pantalon_taille || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Veste - Taille:</label>
                <input type="text" id="editJacketTaille" value="${uniform.jacket_taille || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label>Cravate (Oui/Non):</label>
                <select id="editCravateOui" class="form-input">
                    <option value="false" ${!uniform.cravate_oui ? 'selected' : ''}>Non</option>
                    <option value="true" ${uniform.cravate_oui ? 'selected' : ''}>Oui</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveUniformEdit('${agent_code}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveUniformEdit(agent_code) {
    const uniformIndex = uniforms.findIndex(u => u.agent_code === agent_code);
    if (uniformIndex === -1) return;

    uniforms[uniformIndex] = {
        ...uniforms[uniformIndex],
        chemise_taille: document.getElementById('editChemiseTaille').value || null,
        pantalon_taille: document.getElementById('editPantalonTaille').value || null,
        jacket_taille: document.getElementById('editJacketTaille').value || null,
        cravate_oui: document.getElementById('editCravateOui').value === 'true',
        updated_at: new Date().toISOString()
    };

    saveData();
    closePopup();
    displayUniformMenu();
    showSnackbar(`Informations habillement modifiées pour ${agent_code}`);
}

// --- GESTION DES AVERTISSEMENTS ---
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
                ${warnings.map(warning => {
                    const agent = agents.find(a => a.code === warning.agent_code);
                    return `
                        <tr>
                            <td>${warning.date}</td>
                            <td>${agent ? `${agent.code} - ${agent.prenom} ${agent.nom}` : warning.agent_code}</td>
                            <td>${warning.type}</td>
                            <td>${warning.description}</td>
                            <td>
                                <button class="action-btn red small" onclick="deleteWarning('${warning.id}')">Supprimer</button>
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
    backBtn.style.marginTop = '10px';

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
    const agent_code = document.getElementById('warningAgentCode').value;
    const date = document.getElementById('warningDate').value;
    const type = document.getElementById('warningType').value;
    const description = document.getElementById('warningDescription').value;

    // Générer un ID unique
    const id = 'WARN' + Date.now();

    warnings.push({
        id,
        agent_code,
        date,
        type,
        description
    });

    saveData();
    closePopup();
    displayWarningsMenu();
    showSnackbar(`Avertissement enregistré pour ${agent_code}`);
}

function deleteWarning(warningId) {
    if (confirm("Supprimer cet avertissement ?")) {
        warnings = warnings.filter(w => w.id !== warningId);
        saveData();
        displayWarningsMenu();
        showSnackbar("Avertissement supprimé");
    }
}

// --- STATISTIQUES ---
function displayStatisticsMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "STATISTIQUES";
    
    mainContent.innerHTML = `
        <div class="menu-button-container">
            <button class="menu-button" onclick="showAgentStats()">📈 Statistiques agent</button>
            <button class="menu-button" onclick="showRanking()">🏆 Classement CPA</button>
            <button class="menu-button" onclick="showMonthlyStats()">📊 Statistiques mensuelles</button>
            <button class="menu-button" onclick="showExportMenu()">📤 Exporter données</button>
            <button class="menu-button back-button" onclick="displayMainMenu()">← Retour</button>
        </div>
    `;
}

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
    
    const stats = calculateAgentStats(code, month, year);
    
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
                    <span class="info-value green">${stats.taux_presence}%</span>
                </div>
            </div>
        </div>
        `,
        `
        <button class="popup-button gray" onclick="closePopup()">Fermer</button>
        `
    );
}

function calculateAgentStats(agentCode, month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    let jours_travailles = 0;
    let jours_repos = 0;
    let jours_conges = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = date.toISOString().split('T')[0];
        const shift = getShiftForAgent(agentCode, dateStr);
        
        if (['1', '2', '3'].includes(shift)) {
            jours_travailles++;
        } else if (shift === 'R') {
            jours_repos++;
        } else if (shift === 'C') {
            jours_conges++;
        }
    }
    
    const taux_presence = ((jours_travailles / daysInMonth) * 100).toFixed(1);
    
    return {
        jours_travailles,
        jours_repos,
        jours_conges,
        taux_presence
    };
}

function showRanking() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    // Calcul simplifié du classement
    const classement = agents
        .filter(a => a.statut === 'actif')
        .map(agent => {
            const stats = calculateAgentStats(agent.code, month, year);
            return {
                code: agent.code,
                nom: agent.nom,
                prenom: agent.prenom,
                groupe: agent.groupe,
                cpa: stats.jours_travailles,
                taux_presence: stats.taux_presence
            };
        })
        .sort((a, b) => b.cpa - a.cpa);
    
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = `CLASSEMENT - ${getMonthName(month)} ${year}`;
    mainContent.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'classement-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Rang</th>
                <th>Agent</th>
                <th>Groupe</th>
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
    backBtn.onclick = displayStatisticsMenu;
    backBtn.style.marginTop = '20px';
    mainContent.appendChild(backBtn);
}

function showMonthlyStats() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    const stats = {
        total_agents: agents.filter(a => a.statut === 'actif').length,
        by_group: {},
        total_shifts: 0
    };
    
    // Calcul par groupe
    ['A', 'B', 'C', 'D', 'E'].forEach(groupe => {
        const agentsGroupe = agents.filter(a => a.groupe === groupe && a.statut === 'actif');
        if (agentsGroupe.length > 0) {
            stats.by_group[groupe] = {
                count: agentsGroupe.length,
                shifts: agentsGroupe.reduce((sum, agent) => {
                    const agentStats = calculateAgentStats(agent.code, month, year);
                    return sum + agentStats.jours_travailles;
                }, 0)
            };
            stats.total_shifts += stats.by_group[groupe].shifts;
        }
    });
    
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = `STATISTIQUES - ${getMonthName(month)} ${year}`;
    
    let html = `
        <div class="info-section">
            <h3>Résumé mensuel</h3>
            <div class="info-item">
                <span class="info-label">Agents actifs:</span>
                <span class="info-value">${stats.total_agents}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total shifts:</span>
                <span class="info-value green">${stats.total_shifts}</span>
            </div>
        </div>
        
        <div class="info-section">
            <h3>Par groupe</h3>
    `;
    
    Object.entries(stats.by_group).forEach(([groupe, data]) => {
        html += `
            <div class="info-item">
                <span class="info-label">Groupe ${groupe}:</span>
                <span class="info-value">${data.count} agents - ${data.shifts} shifts</span>
            </div>
        `;
    });
    
    html += `</div>`;
    
    mainContent.innerHTML = html;
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayStatisticsMenu;
    backBtn.style.marginTop = '20px';
    mainContent.appendChild(backBtn);
}

function showExportMenu() {
    openPopup(
        'Exporter les données',
        `
        <div style="padding: 15px;">
            <h3>Options d'export</h3>
            
            <div class="form-group">
                <label>Format:</label>
                <select id="exportFormat" class="form-input">
                    <option value="json">JSON (.json)</option>
                    <option value="csv">CSV (.csv)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Données à exporter:</label>
                <div style="margin-top: 10px;">
                    <label><input type="checkbox" id="exportAgents" checked> Agents</label><br>
                    <label><input type="checkbox" id="exportPlanning"> Planning</label><br>
                    <label><input type="checkbox" id="exportPanicCodes"> Codes panique</label>
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
    const format = document.getElementById('exportFormat').value;
    
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            version: 'SGA 1.0'
        },
        data: {}
    };

    if (document.getElementById('exportAgents').checked) {
        exportData.data.agents = agents;
    }
    
    if (document.getElementById('exportPlanning').checked) {
        exportData.data.planning = planningData;
    }
    
    if (document.getElementById('exportPanicCodes').checked) {
        exportData.data.panicCodes = panicCodes;
    }

    if (format === 'json') {
        exportToJSON(exportData);
    } else if (format === 'csv') {
        exportToCSV(exportData);
    }

    closePopup();
}

function exportToJSON(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sga_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSnackbar('Export JSON terminé');
}

function exportToCSV(data) {
    // Export simple des agents
    let csvContent = "Code;Nom;Prénom;Groupe;Matricule;CIN;Téléphone;Poste;Statut\n";
    
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
            agent.statut
        ];
        csvContent += row.join(';') + '\n';
    });
    
    const dataBlob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSnackbar('Export CSV terminé');
}

// --- CONFIGURATION ---
function displayConfigMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "CONFIGURATION";
    
    mainContent.innerHTML = `
        <div style="padding: 20px;">
            <div class="info-section">
                <h3>Informations système</h3>
                <div class="info-item">
                    <span class="info-label">Version:</span>
                    <span class="info-value">SGA 1.0</span>
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
            
            <div class="info-section" style="margin-top: 20px;">
                <h3>Maintenance</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="menu-button" onclick="showBackupMenu()">💾 Sauvegarde</button>
                    <button class="menu-button" onclick="clearOldData()">🗑️ Nettoyer données</button>
                    <button class="menu-button quit-button" onclick="showResetConfirmation()">🔄 Réinitialiser</button>
                </div>
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

function showBackupMenu() {
    openPopup(
        'Sauvegarde des données',
        `
        <div style="padding: 15px;">
            <p>Créer une sauvegarde complète de toutes les données.</p>
            <p>La sauvegarde sera téléchargée au format JSON.</p>
        </div>
        `,
        `
        <button class="popup-button green" onclick="createBackup()">Créer sauvegarde</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function createBackup() {
    const backupData = {
        agents,
        planningData,
        panicCodes,
        radios,
        uniforms,
        warnings,
        leaves,
        radioHistory,
        auditLog,
        backupDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sga_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closePopup();
    showSnackbar('Sauvegarde créée avec succès');
}

function clearOldData() {
    if (confirm("Voulez-vous nettoyer les données de planning de plus de 6 mois ?")) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0].substring(0, 7);
        
        let deletedCount = 0;
        
        Object.keys(planningData).forEach(monthKey => {
            if (monthKey < sixMonthsAgoStr) {
                delete planningData[monthKey];
                deletedCount++;
            }
        });
        
        saveData();
        showSnackbar(`${deletedCount} mois de planning nettoyés`);
    }
}

function showResetConfirmation() {
    if (confirm("⚠️ ATTENTION !\n\nCette action va réinitialiser toutes les données (sauf les agents).\nÊtes-vous sûr ?")) {
        planningData = {};
        panicCodes = [];
        radios = [];
        uniforms = [];
        warnings = [];
        leaves = [];
        radioHistory = [];
        auditLog = [];
        
        saveData();
        showSnackbar("Données réinitialisées");
        displayMainMenu();
    }
}

function showQuitConfirmation() {
    if (confirm("Voulez-vous vraiment quitter l'application ?")) {
        saveData();
        showSnackbar("Données sauvegardées. Au revoir !");
        setTimeout(() => {
            // Pour une PWA, on ne peut pas fermer la fenêtre
            // On retourne juste au menu principal
            displayMainMenu();
        }, 1000);
    }
}

console.log("✅ SGA - Système de Gestion des Agents prêt !");
