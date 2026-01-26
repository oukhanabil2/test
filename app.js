// app_complete.js - VERSION COMPLÈTE AVEC TOUTES LES FONCTIONNALITÉS

// === SYSTÈME DE PERMISSIONS ===
const USER_ROLES = {
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    VIEWER: 'viewer'
};

let currentUser = {
    username: 'admin',
    role: USER_ROLES.ADMIN,
    name: 'Administrateur SGA'
};

function checkPermission(requiredRole) {
    const roleHierarchy = [USER_ROLES.VIEWER, USER_ROLES.SUPERVISOR, USER_ROLES.ADMIN];
    return roleHierarchy.indexOf(currentUser.role) >= roleHierarchy.indexOf(requiredRole);
}

function showLoginForm() {
    openPopup(
        'Connexion SGA',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Nom d'utilisateur:</label>
                <input type="text" id="loginUsername" class="form-input" value="admin">
            </div>
            <div class="form-group">
                <label>Mot de passe:</label>
                <input type="password" id="loginPassword" class="form-input" value="admin">
            </div>
            <div class="form-group">
                <label>Rôle:</label>
                <select id="loginRole" class="form-input">
                    <option value="admin">Administrateur</option>
                    <option value="supervisor">Superviseur</option>
                    <option value="viewer">Consultant</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="performLogin()">Connexion</button>
        `
    );
}

function performLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    // En production, vérifier avec un backend
    currentUser = {
        username,
        role,
        name: username === 'admin' ? 'Administrateur SGA' : 
              username === 'supervisor' ? 'Superviseur Planning' : 'Consultant'
    };
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'LOGIN',
        details: `Connexion de ${username} (${role})`,
        user: username
    });
    
    closePopup();
    showSnackbar(`Bienvenue ${currentUser.name}`);
    updateUIForUserRole();
}

function updateUIForUserRole() {
    // Cacher/montrer des éléments selon les permissions
    const adminOnlyButtons = document.querySelectorAll('.admin-only');
    const supervisorButtons = document.querySelectorAll('.supervisor-only');
    
    adminOnlyButtons.forEach(btn => {
        btn.style.display = checkPermission(USER_ROLES.ADMIN) ? 'inline-block' : 'none';
    });
    
    supervisorButtons.forEach(btn => {
        btn.style.display = checkPermission(USER_ROLES.SUPERVISOR) ? 'inline-block' : 'none';
    });
    
    // Mettre à jour l'affichage de l'utilisateur
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.innerHTML = `
            <span style="color: #3498db;">${currentUser.name}</span>
            <span style="color: #95a5a6; font-size: 0.9em;">(${currentUser.role})</span>
        `;
    }
}

// === MASS EDITOR COMPLET ===
function showMassEditor() {
    openPopup(
        'Éditeur en masse - Modification multiple',
        `
        <div style="padding: 15px; max-height: 500px; overflow-y: auto;">
            <div class="form-group">
                <label>Sélection des agents:</label>
                <div style="margin: 10px 0;">
                    <label><input type="radio" name="agentSelection" value="group" checked> Par groupe</label>
                    <label><input type="radio" name="agentSelection" value="custom"> Personnalisé</label>
                </div>
            </div>
            
            <div id="massEditorGroupSection">
                <div class="form-group">
                    <label>Groupe:</label>
                    <select id="massEditorGroup" class="form-input">
                        <option value="A">Groupe A</option>
                        <option value="B">Groupe B</option>
                        <option value="C">Groupe C</option>
                        <option value="D">Groupe D</option>
                        <option value="E">Groupe E</option>
                        <option value="ALL">Tous les groupes</option>
                    </select>
                </div>
            </div>
            
            <div id="massEditorCustomSection" style="display: none;">
                <div class="form-group">
                    <label>Agents (sélection multiple):</label>
                    <select id="massEditorAgents" multiple class="form-input" style="height: 150px;">
                        ${agents.filter(a => a.statut === 'actif').map(a => 
                            `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom} (Groupe ${a.groupe})</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Période:</label>
                <div style="display: flex; gap: 10px;">
                    <input type="date" id="massEditorStartDate" class="form-input" style="flex: 1;">
                    <span>à</span>
                    <input type="date" id="massEditorEndDate" class="form-input" style="flex: 1;">
                </div>
            </div>
            
            <div class="form-group">
                <label>Shift à appliquer:</label>
                <select id="massEditorShift" class="form-input">
                    <option value="1">Matin (1)</option>
                    <option value="2">Après-midi (2)</option>
                    <option value="3">Nuit (3)</option>
                    <option value="R">Repos (R)</option>
                    <option value="C">Congé (C)</option>
                    <option value="M">Maladie (M)</option>
                    <option value="A">Autre absence (A)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Jours spécifiques (optionnel):</label>
                <div style="margin: 10px 0;">
                    <label><input type="checkbox" value="1"> Lundi</label>
                    <label><input type="checkbox" value="2"> Mardi</label>
                    <label><input type="checkbox" value="3"> Mercredi</label>
                    <label><input type="checkbox" value="4"> Jeudi</label>
                    <label><input type="checkbox" value="5"> Vendredi</label>
                    <label><input type="checkbox" value="6"> Samedi</label>
                    <label><input type="checkbox" value="0"> Dimanche</label>
                </div>
            </div>
            
            <div class="form-group">
                <label>Commentaire:</label>
                <textarea id="massEditorComment" class="form-input" rows="3" placeholder="Motif de la modification en masse..."></textarea>
            </div>
            
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 15px 0;">
                <strong>Résumé de l'opération:</strong>
                <div id="massEditorSummary" style="margin-top: 5px; color: #666;"></div>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="applyMassEdit()">Appliquer les modifications</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
    
    // Gérer le changement de mode de sélection
    document.querySelectorAll('input[name="agentSelection"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const groupSection = document.getElementById('massEditorGroupSection');
            const customSection = document.getElementById('massEditorCustomSection');
            
            if (this.value === 'group') {
                groupSection.style.display = 'block';
                customSection.style.display = 'none';
            } else {
                groupSection.style.display = 'none';
                customSection.style.display = 'block';
            }
        });
    });
    
    // Pré-remplir les dates
    const today = new Date();
    document.getElementById('massEditorStartDate').value = today.toISOString().split('T')[0];
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    document.getElementById('massEditorEndDate').value = endDate.toISOString().split('T')[0];
}

function applyMassEdit() {
    const startDate = document.getElementById('massEditorStartDate').value;
    const endDate = document.getElementById('massEditorEndDate').value;
    const shift = document.getElementById('massEditorShift').value;
    const comment = document.getElementById('massEditorComment').value;
    const agentSelection = document.querySelector('input[name="agentSelection"]:checked').value;
    
    let selectedAgents = [];
    
    if (agentSelection === 'group') {
        const group = document.getElementById('massEditorGroup').value;
        if (group === 'ALL') {
            selectedAgents = agents.filter(a => a.statut === 'actif').map(a => a.code);
        } else {
            selectedAgents = agents.filter(a => a.statut === 'actif' && a.groupe === group).map(a => a.code);
        }
    } else {
        selectedAgents = Array.from(document.getElementById('massEditorAgents').selectedOptions).map(opt => opt.value);
    }
    
    if (selectedAgents.length === 0) {
        showSnackbar("Veuillez sélectionner au moins un agent");
        return;
    }
    
    if (!startDate || !endDate) {
        showSnackbar("Veuillez sélectionner une période valide");
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayChecks = [0, 1, 2, 3, 4, 5, 6].map(d => 
        document.querySelector(`input[type="checkbox"][value="${d}"]`).checked
    );
    
    let modificationsCount = 0;
    
    // Appliquer les modifications
    selectedAgents.forEach(agentCode => {
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            
            // Vérifier si on doit modifier ce jour
            if (!dayChecks.some(check => check) || dayChecks[dayOfWeek]) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const monthKey = dateStr.substring(0, 7);
                
                if (!planningData[monthKey]) planningData[monthKey] = {};
                if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
                
                planningData[monthKey][agentCode][dateStr] = {
                    shift: shift,
                    modified: new Date().toISOString(),
                    modifiedBy: currentUser.username,
                    comment: comment
                };
                
                modificationsCount++;
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'MASS_EDIT',
        details: `Modification en masse: ${modificationsCount} shifts pour ${selectedAgents.length} agents`,
        user: currentUser.username
    });
    
    saveData();
    closePopup();
    showSnackbar(`Modifications appliquées: ${modificationsCount} shifts mis à jour`);
    
    // Recharger l'affichage si on est sur le planning
    if (document.getElementById('sub-title').textContent.includes('Planning')) {
        displayMonthlyPlanning();
    }
}

// === SYSTÈME DE CONGÉS COMPLET ===
function displayLeavesMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "GESTION DES CONGÉS";
    mainContent.innerHTML = '';
    
    // Statistiques
    const currentYear = new Date().getFullYear();
    const leavesThisYear = leaves.filter(l => l.date_debut.startsWith(currentYear));
    
    mainContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${leaves.length}</div>
                <div class="stat-label">Congés total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${leavesThisYear.length}</div>
                <div class="stat-label">Congés ${currentYear}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${leaves.filter(l => l.statut === 'APPROUVE').length}</div>
                <div class="stat-label">Approuvés</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${leaves.filter(l => l.statut === 'EN_ATTENTE').length}</div>
                <div class="stat-label">En attente</div>
            </div>
        </div>
    `;
    
    // Tableau des congés
    const table = document.createElement('table');
    table.className = 'planning-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Agent</th>
                <th>Période</th>
                <th>Durée</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${leaves.map(leave => {
                const agent = agents.find(a => a.code === leave.code_agent);
                const startDate = new Date(leave.date_debut);
                const endDate = new Date(leave.date_fin);
                const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                
                let statusClass = '';
                if (leave.statut === 'APPROUVE') statusClass = 'active';
                else if (leave.statut === 'REFUSE') statusClass = 'inactive';
                else if (leave.statut === 'EN_ATTENTE') statusClass = 'warning';
                
                return `
                    <tr>
                        <td>${agent ? `${agent.prenom} ${agent.nom}` : leave.code_agent}</td>
                        <td>${leave.date_debut} au ${leave.date_fin}</td>
                        <td>${duration} jour(s)</td>
                        <td>${leave.type || 'Congé annuel'}</td>
                        <td><span class="status-badge ${statusClass}">${leave.statut}</span></td>
                        <td>
                            ${leave.statut === 'EN_ATTENTE' ? `
                                <button class="action-btn green small" onclick="approveLeave(${leave.id})">✓</button>
                                <button class="action-btn red small" onclick="rejectLeave(${leave.id})">✗</button>
                            ` : ''}
                            <button class="action-btn blue small" onclick="viewLeaveDetails(${leave.id})">👁️</button>
                            <button class="action-btn red small" onclick="deleteLeave(${leave.id})">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('')}
            ${leaves.length === 0 ? `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">
                        Aucun congé enregistré
                    </td>
                </tr>
            ` : ''}
        </tbody>
    `;
    
    mainContent.appendChild(table);
    
    // Boutons d'action
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '20px';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.flexWrap = 'wrap';
    buttonsDiv.style.gap = '10px';
    
    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Nouveau congé';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddLeaveForm;
    
    const reportBtn = document.createElement('button');
    reportBtn.textContent = '📊 Rapport congés';
    reportBtn.className = 'menu-button';
    reportBtn.onclick = showLeaveReport;
    
    const calendarBtn = document.createElement('button');
    calendarBtn.textContent = '📅 Calendrier des congés';
    calendarBtn.className = 'menu-button';
    calendarBtn.onclick = showLeaveCalendar;
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    
    buttonsDiv.appendChild(addBtn);
    if (checkPermission(USER_ROLES.SUPERVISOR)) {
        buttonsDiv.appendChild(reportBtn);
        buttonsDiv.appendChild(calendarBtn);
    }
    buttonsDiv.appendChild(backBtn);
    
    mainContent.appendChild(buttonsDiv);
}

function showAddLeaveForm() {
    openPopup(
        'Nouvelle demande de congé',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Agent:</label>
                <select id="leaveAgent" class="form-input">
                    ${agents.filter(a => a.statut === 'actif').map(a => 
                        `<option value="${a.code}">${a.code} - ${a.prenom} ${a.nom} (Groupe ${a.groupe})</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Type de congé:</label>
                <select id="leaveType" class="form-input">
                    <option value="ANNUEL">Congé annuel</option>
                    <option value="MALADIE">Congé maladie</option>
                    <option value="EXCEPTIONNEL">Congé exceptionnel</option>
                    <option value="SANS_SOLDE">Congé sans solde</option>
                    <option value="MATERNITE">Congé maternité</option>
                    <option value="PATERNITE">Congé paternité</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Date de début:</label>
                <input type="date" id="leaveStartDate" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Date de fin:</label>
                <input type="date" id="leaveEndDate" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Motif:</label>
                <textarea id="leaveReason" class="form-input" rows="3" placeholder="Motif du congé..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Statut:</label>
                <select id="leaveStatus" class="form-input">
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="APPROUVE">Approuvé</option>
                    <option value="REFUSE">Refusé</option>
                </select>
            </div>
            
            <div id="leaveDurationInfo" style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <strong>Durée:</strong> <span id="leaveDaysCount">0 jours</span>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveLeave()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
    
    // Pré-remplir les dates
    const today = new Date();
    document.getElementById('leaveStartDate').value = today.toISOString().split('T')[0];
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 5);
    document.getElementById('leaveEndDate').value = endDate.toISOString().split('T')[0];
    calculateLeaveDuration();
    
    // Écouter les changements de dates
    document.getElementById('leaveStartDate').addEventListener('change', calculateLeaveDuration);
    document.getElementById('leaveEndDate').addEventListener('change', calculateLeaveDuration);
}

function calculateLeaveDuration() {
    const startDate = document.getElementById('leaveStartDate').value;
    const endDate = document.getElementById('leaveEndDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        document.getElementById('leaveDaysCount').textContent = `${duration} jour(s)`;
        
        // Vérifier si la durée est valide
        if (duration < 1) {
            document.getElementById('leaveDaysCount').style.color = '#e74c3c';
        } else if (duration > 30) {
            document.getElementById('leaveDaysCount').style.color = '#f39c12';
        } else {
            document.getElementById('leaveDaysCount').style.color = '#27ae60';
        }
    }
}

function saveLeave() {
    const code_agent = document.getElementById('leaveAgent').value;
    const type = document.getElementById('leaveType').value;
    const date_debut = document.getElementById('leaveStartDate').value;
    const date_fin = document.getElementById('leaveEndDate').value;
    const motif = document.getElementById('leaveReason').value;
    const statut = document.getElementById('leaveStatus').value;
    
    if (!code_agent || !date_debut || !date_fin) {
        showSnackbar("Veuillez remplir toutes les informations obligatoires");
        return;
    }
    
    const start = new Date(date_debut);
    const end = new Date(date_fin);
    
    if (start > end) {
        showSnackbar("La date de début doit être avant la date de fin");
        return;
    }
    
    // Générer un ID
    const id = leaves.length > 0 ? Math.max(...leaves.map(l => l.id)) + 1 : 1;
    
    // Vérifier les conflits
    const conflicts = leaves.filter(l => 
        l.code_agent === code_agent &&
        l.statut === 'APPROUVE' &&
        !(end < new Date(l.date_debut) || start > new Date(l.date_fin))
    );
    
    if (conflicts.length > 0 && statut === 'APPROUVE') {
        if (!confirm("Cet agent a déjà un congé approuvé sur cette période. Continuer ?")) {
            return;
        }
    }
    
    // Sauvegarder
    leaves.push({
        id,
        code_agent,
        type,
        date_debut,
        date_fin,
        motif,
        statut,
        created_at: new Date().toISOString(),
        created_by: currentUser.username
    });
    
    // Si approuvé, mettre à jour le planning
    if (statut === 'APPROUVE') {
        applyLeaveToPlanning(id);
    }
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'ADD_LEAVE',
        details: `Congé ${statut} pour ${code_agent} du ${date_debut} au ${date_fin}`,
        user: currentUser.username
    });
    
    saveData();
    closePopup();
    displayLeavesMenu();
    showSnackbar(`Congé enregistré pour ${code_agent} (${statut})`);
}

function applyLeaveToPlanning(leaveId) {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave) return;
    
    const start = new Date(leave.date_debut);
    const end = new Date(leave.date_fin);
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const monthKey = dateStr.substring(0, 7);
        
        if (!planningData[monthKey]) planningData[monthKey] = {};
        if (!planningData[monthKey][leave.code_agent]) planningData[monthKey][leave.code_agent] = {};
        
        planningData[monthKey][leave.code_agent][dateStr] = {
            shift: 'C',
            modified: new Date().toISOString(),
            modifiedBy: currentUser.username,
            leaveId: leaveId
        };
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    saveData();
}

function approveLeave(leaveId) {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave) return;
    
    leave.statut = 'APPROUVE';
    leave.approved_at = new Date().toISOString();
    leave.approved_by = currentUser.username;
    
    // Appliquer au planning
    applyLeaveToPlanning(leaveId);
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'APPROVE_LEAVE',
        details: `Approbation congé ID ${leaveId} pour ${leave.code_agent}`,
        user: currentUser.username
    });
    
    saveData();
    displayLeavesMenu();
    showSnackbar(`Congé approuvé pour ${leave.code_agent}`);
}

function rejectLeave(leaveId) {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave) return;
    
    leave.statut = 'REFUSE';
    leave.rejected_at = new Date().toISOString();
    leave.rejected_by = currentUser.username;
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'REJECT_LEAVE',
        details: `Rejet congé ID ${leaveId} pour ${leave.code_agent}`,
        user: currentUser.username
    });
    
    saveData();
    displayLeavesMenu();
    showSnackbar(`Congé refusé pour ${leave.code_agent}`);
}

function viewLeaveDetails(leaveId) {
    const leave = leaves.find(l => l.id === leaveId);
    if (!leave) return;
    
    const agent = agents.find(a => a.code === leave.code_agent);
    const startDate = new Date(leave.date_debut);
    const endDate = new Date(leave.date_fin);
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    openPopup(
        `Détails du congé #${leaveId}`,
        `
        <div style="padding: 15px;">
            <div class="info-section">
                <h3>Informations du congé</h3>
                <div class="info-item">
                    <span class="info-label">Agent:</span>
                    <span class="info-value">${agent ? `${agent.prenom} ${agent.nom} (${agent.code})` : leave.code_agent}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Type:</span>
                    <span class="info-value">${leave.type}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Période:</span>
                    <span class="info-value">${leave.date_debut} au ${leave.date_fin} (${duration} jours)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Statut:</span>
                    <span class="info-value"><span class="status-badge ${leave.statut === 'APPROUVE' ? 'active' : leave.statut === 'REFUSE' ? 'inactive' : 'warning'}">${leave.statut}</span></span>
                </div>
                ${leave.motif ? `
                <div class="info-item">
                    <span class="info-label">Motif:</span>
                    <span class="info-value">${leave.motif}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="info-section" style="margin-top: 20px;">
                <h3>Historique</h3>
                <div class="info-item">
                    <span class="info-label">Créé le:</span>
                    <span class="info-value">${leave.created_at ? new Date(leave.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Créé par:</span>
                    <span class="info-value">${leave.created_by || 'N/A'}</span>
                </div>
                ${leave.approved_at ? `
                <div class="info-item">
                    <span class="info-label">Approuvé le:</span>
                    <span class="info-value">${new Date(leave.approved_at).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Approuvé par:</span>
                    <span class="info-value">${leave.approved_by}</span>
                </div>
                ` : ''}
            </div>
        </div>
        `,
        `
        <button class="popup-button gray" onclick="closePopup()">Fermer</button>
        `
    );
}

function deleteLeave(leaveId) {
    if (!confirm("Supprimer définitivement ce congé ?")) return;
    
    const leave = leaves.find(l => l.id === leaveId);
    if (leave && leave.statut === 'APPROUVE') {
        if (!confirm("Ce congé est approuvé. Sa suppression retirera également les jours de congé du planning. Continuer ?")) {
            return;
        }
    }
    
    // Supprimer du planning si approuvé
    if (leave && leave.statut === 'APPROUVE') {
        const start = new Date(leave.date_debut);
        const end = new Date(leave.date_fin);
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const monthKey = dateStr.substring(0, 7);
            
            if (planningData[monthKey] && planningData[monthKey][leave.code_agent] && planningData[monthKey][leave.code_agent][dateStr]) {
                // Vérifier si c'est bien un congé lié à ce leaveId
                if (planningData[monthKey][leave.code_agent][dateStr].leaveId === leaveId) {
                    delete planningData[monthKey][leave.code_agent][dateStr];
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    
    leaves = leaves.filter(l => l.id !== leaveId);
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'DELETE_LEAVE',
        details: `Suppression congé ID ${leaveId}`,
        user: currentUser.username
    });
    
    saveData();
    displayLeavesMenu();
    showSnackbar("Congé supprimé");
}

function showLeaveReport() {
    const currentYear = new Date().getFullYear();
    const leavesThisYear = leaves.filter(l => l.date_debut.startsWith(currentYear.toString()));
    
    // Statistiques par groupe
    const statsByGroup = {};
    agents.forEach(agent => {
        if (!statsByGroup[agent.groupe]) {
            statsByGroup[agent.groupe] = { total: 0, approved: 0, pending: 0, rejected: 0 };
        }
    });
    
    leavesThisYear.forEach(leave => {
        const agent = agents.find(a => a.code === leave.code_agent);
        if (agent && statsByGroup[agent.groupe]) {
            statsByGroup[agent.groupe].total++;
            if (leave.statut === 'APPROUVE') statsByGroup[agent.groupe].approved++;
            else if (leave.statut === 'EN_ATTENTE') statsByGroup[agent.groupe].pending++;
            else if (leave.statut === 'REFUSE') statsByGroup[agent.groupe].rejected++;
        }
    });
    
    // Statistiques par mois
    const statsByMonth = {};
    for (let i = 1; i <= 12; i++) {
        const monthStr = i.toString().padStart(2, '0');
        const monthLeaves = leavesThisYear.filter(l => l.date_debut.substring(5, 7) === monthStr);
        statsByMonth[getMonthName(i)] = monthLeaves.length;
    }
    
    openPopup(
        `Rapport congés ${currentYear}`,
        `
        <div style="padding: 15px; max-height: 500px; overflow-y: auto;">
            <h3>Statistiques générales</h3>
            <div class="stats-grid" style="margin: 15px 0;">
                <div class="stat-card">
                    <div class="stat-value">${leavesThisYear.length}</div>
                    <div class="stat-label">Demandes totales</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${leavesThisYear.filter(l => l.statut === 'APPROUVE').length}</div>
                    <div class="stat-label">Approuvées</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${leavesThisYear.filter(l => l.statut === 'EN_ATTENTE').length}</div>
                    <div class="stat-label">En attente</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${leavesThisYear.filter(l => l.statut === 'REFUSE').length}</div>
                    <div class="stat-label">Refusées</div>
                </div>
            </div>
            
            <h3>Par groupe</h3>
            <div class="group-stats" style="margin: 10px 0;">
                ${Object.entries(statsByGroup).map(([groupe, stats]) => `
                    <div class="group-stat">
                        <span>Groupe ${groupe}:</span>
                        <span>${stats.total} demandes (✓${stats.approved} ⏳${stats.pending} ✗${stats.rejected})</span>
                    </div>
                `).join('')}
            </div>
            
            <h3>Par mois</h3>
            <div style="margin: 10px 0;">
                ${Object.entries(statsByMonth).map(([month, count]) => `
                    <div style="display: flex; justify-content: space-between; margin: 5px 0; padding: 5px; background: #f8f9fa; border-radius: 3px;">
                        <span>${month}:</span>
                        <span>${count} demande(s)</span>
                    </div>
                `).join('')}
            </div>
            
            <h3>Top 5 des agents avec le plus de congés</h3>
            <div style="margin: 10px 0;">
                ${agents
                    .map(agent => {
                        const agentLeaves = leavesThisYear.filter(l => l.code_agent === agent.code);
                        const approvedLeaves = agentLeaves.filter(l => l.statut === 'APPROUVE');
                        return { agent, total: agentLeaves.length, approved: approvedLeaves.length };
                    })
                    .filter(a => a.total > 0)
                    .sort((a, b) => b.approved - a.approved)
                    .slice(0, 5)
                    .map((item, index) => `
                        <div style="display: flex; justify-content: space-between; margin: 5px 0; padding: 5px; background: ${index < 3 ? '#e8f4fd' : '#f8f9fa'}; border-radius: 3px;">
                            <span>${index + 1}. ${item.agent.prenom} ${item.agent.nom} (${item.agent.groupe})</span>
                            <span>${item.approved} jour(s) approuvés</span>
                        </div>
                    `).join('')}
                ${agents.filter(a => leavesThisYear.filter(l => l.code_agent === a.code).length === 0).length === agents.length ? 
                    '<p style="text-align: center; color: #95a5a6;">Aucune donnée</p>' : ''}
            </div>
        </div>
        `,
        `
        <button class="popup-button gray" onclick="closePopup()">Fermer</button>
        <button class="popup-button green" onclick="exportLeavesReport()">Exporter</button>
        `
    );
}

function showLeaveCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    openPopup(
        `Calendrier des congés - ${getMonthName(currentMonth)} ${currentYear}`,
        `
        <div style="padding: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <button class="action-btn blue small" onclick="changeCalendarMonth(-1)">← Mois précédent</button>
                <span style="font-weight: bold;">${getMonthName(currentMonth)} ${currentYear}</span>
                <button class="action-btn blue small" onclick="changeCalendarMonth(1)">Mois suivant →</button>
            </div>
            
            <div id="leaveCalendarContent">
                <!-- Le contenu du calendrier sera généré dynamiquement -->
                Chargement...
            </div>
        </div>
        `,
        `
        <button class="popup-button gray" onclick="closePopup()">Fermer</button>
        `
    );
    
    generateLeaveCalendar(currentMonth, currentYear);
}

function generateLeaveCalendar(month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    const approvedLeaves = leaves.filter(l => {
        if (l.statut !== 'APPROUVE') return false;
        
        const start = new Date(l.date_debut);
        const end = new Date(l.date_fin);
        const targetStart = new Date(year, month - 1, 1);
        const targetEnd = new Date(year, month, 0);
        
        return !(end < targetStart || start > targetEnd);
    });
    
    let calendarHTML = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 15px;">
            ${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => `
                <div style="text-align: center; font-weight: bold; padding: 5px; background: #f1f2f6;">${day}</div>
            `).join('')}
    `;
    
    // Jours vides au début
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div style="min-height: 80px; background: #f8f9fa;"></div>`;
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        // Vérifier si c'est un jour férié
        const isHoliday = isHolidayDate(date);
        
        // Trouver les congés pour ce jour
        const dayLeaves = approvedLeaves.filter(l => {
            const start = new Date(l.date_debut);
            const end = new Date(l.date_fin);
            const current = new Date(dateStr);
            return current >= start && current <= end;
        });
        
        let dayClass = '';
        if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) {
            dayClass = 'weekend';
        }
        
        calendarHTML += `
            <div style="min-height: 80px; padding: 3px; border: 1px solid #ddd; font-size: 0.9em; ${dayClass ? 'background: #f8f9fa;' : ''}">
                <div style="font-weight: bold; margin-bottom: 3px; ${isHoliday ? 'color: #e74c3c;' : ''}">
                    ${day}${isHoliday ? ' 🎉' : ''}
                </div>
                ${dayLeaves.map(leave => {
                    const agent = agents.find(a => a.code === leave.code_agent);
                    return `
                        <div style="background: #3498db; color: white; padding: 1px 3px; margin: 1px 0; border-radius: 2px; font-size: 0.8em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" 
                             title="${agent ? agent.prenom + ' ' + agent.nom : leave.code_agent} - ${leave.type}">
                            ${agent ? agent.code : leave.code_agent}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    calendarHTML += `</div>`;
    
    // Légende
    calendarHTML += `
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
            <h4>Légende</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px;">
                <div><span style="display: inline-block; width: 12px; height: 12px; background: #3498db; margin-right: 5px;"></span> Congé approuvé</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background: #f8f9fa; border: 1px solid #ddd; margin-right: 5px;"></span> Week-end</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background: none; margin-right: 5px;">🎉</span> Jour férié</div>
            </div>
        </div>
        
        <div style="margin-top: 15px;">
            <h4>Congés ce mois-ci (${approvedLeaves.length})</h4>
            <div style="max-height: 150px; overflow-y: auto;">
                ${approvedLeaves.length === 0 ? '<p>Aucun congé approuvé ce mois</p>' : approvedLeaves.map(leave => {
                    const agent = agents.find(a => a.code === leave.code_agent);
                    return `
                        <div style="padding: 5px; border-bottom: 1px solid #eee;">
                            <strong>${agent ? agent.prenom + ' ' + agent.nom : leave.code_agent}</strong><br>
                            <small>${leave.date_debut} au ${leave.date_fin} - ${leave.type}</small>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('leaveCalendarContent').innerHTML = calendarHTML;
}

function changeCalendarMonth(delta) {
    // Cette fonction serait liée à un état global du calendrier
    showSnackbar("Navigation calendrier à implémenter avec état global");
}

function exportLeavesReport() {
    const currentYear = new Date().getFullYear();
    const leavesThisYear = leaves.filter(l => l.date_debut.startsWith(currentYear.toString()));
    
    // Créer un CSV
    let csvContent = "Agent;Groupe;Type;Date début;Date fin;Durée;Statut;Motif\n";
    
    leavesThisYear.forEach(leave => {
        const agent = agents.find(a => a.code === leave.code_agent);
        const startDate = new Date(leave.date_debut);
        const endDate = new Date(leave.date_fin);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        const row = [
            agent ? `${agent.prenom} ${agent.nom}` : leave.code_agent,
            agent ? agent.groupe : '',
            leave.type,
            leave.date_debut,
            leave.date_fin,
            duration,
            leave.statut,
            `"${leave.motif || ''}"`
        ];
        
        csvContent += row.join(';') + '\n';
    });
    
    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `conges_${currentYear}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showSnackbar("Rapport exporté en CSV");
}

// === GESTION COMPLÈTE DES JOURS FÉRIÉS ===
function displayHolidaysManager() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "GESTION DES JOURS FÉRIÉS";
    mainContent.innerHTML = '';
    
    const currentYear = new Date().getFullYear();
    const holidaysThisYear = holidays.filter(h => h.date.startsWith(currentYear.toString()));
    const holidaysNextYear = holidays.filter(h => h.date.startsWith((currentYear + 1).toString()));
    
    mainContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${holidays.length}</div>
                <div class="stat-label">Jours fériés total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${holidaysThisYear.length}</div>
                <div class="stat-label">Année ${currentYear}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${holidaysNextYear.length}</div>
                <div class="stat-label">Année ${currentYear + 1}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${holidays.filter(h => h.type === 'religieux').length}</div>
                <div class="stat-label">Religieux</div>
            </div>
        </div>
        
        <div style="margin: 20px 0;">
            <h3>Jours fériés ${currentYear}</h3>
            <div class="group-stats">
                ${holidaysThisYear.sort((a, b) => new Date(a.date) - new Date(b.date)).map(holiday => {
                    const date = new Date(holiday.date);
                    const isPast = date < new Date();
                    return `
                        <div class="group-stat" style="${isPast ? 'opacity: 0.7;' : ''}">
                            <span>${date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}:</span>
                            <span>${holiday.description} <span style="color: #95a5a6; font-size: 0.9em;">(${holiday.type})</span></span>
                        </div>
                    `;
                }).join('')}
                ${holidaysThisYear.length === 0 ? '<p>Aucun jour férié défini pour cette année</p>' : ''}
            </div>
        </div>
    `;
    
    // Tableau pour éditer
    const table = document.createElement('table');
    table.className = 'planning-table';
    table.style.marginTop = '20px';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Année</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${holidays.sort((a, b) => new Date(b.date) - new Date(a.date)).map(holiday => {
                const date = new Date(holiday.date);
                return `
                    <tr>
                        <td>${holiday.date}</td>
                        <td>${holiday.description}</td>
                        <td>${holiday.type}</td>
                        <td>${date.getFullYear()}</td>
                        <td>
                            <button class="action-btn blue small" onclick="editHoliday('${holiday.date}')">✏️</button>
                            <button class="action-btn red small" onclick="deleteHoliday('${holiday.date}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    
    mainContent.appendChild(table);
    
    // Boutons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '20px';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.flexWrap = 'wrap';
    buttonsDiv.style.gap = '10px';
    
    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Ajouter un jour férié';
    addBtn.className = 'menu-button';
    addBtn.onclick = showAddHolidayForm;
    
    const importBtn = document.createElement('button');
    importBtn.textContent = '📅 Importer année complète';
    importBtn.className = 'menu-button';
    importBtn.onclick = importYearHolidays;
    
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Retour';
    backBtn.className = 'menu-button back-button';
    backBtn.onclick = displayMainMenu;
    
    buttonsDiv.appendChild(addBtn);
    buttonsDiv.appendChild(importBtn);
    buttonsDiv.appendChild(backBtn);
    
    mainContent.appendChild(buttonsDiv);
}

function showAddHolidayForm() {
    const today = new Date();
    
    openPopup(
        'Nouveau jour férié',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Date:</label>
                <input type="date" id="holidayDate" class="form-input" value="${today.toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label>Description:</label>
                <input type="text" id="holidayDescription" class="form-input" placeholder="Ex: Fête du Travail">
            </div>
            
            <div class="form-group">
                <label>Type:</label>
                <select id="holidayType" class="form-input">
                    <option value="national">National</option>
                    <option value="religieux">Religieux</option>
                    <option value="regional">Régional</option>
                    <option value="exceptionnel">Exceptionnel</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Répéter chaque année:</label>
                <input type="checkbox" id="holidayRecurring" checked>
            </div>
            
            <div class="form-group">
                <label>Année(s) supplémentaire(s):</label>
                <input type="text" id="holidayExtraYears" class="form-input" placeholder="Ex: 2025,2026 (séparés par des virgules)">
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveHoliday()">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveHoliday() {
    const date = document.getElementById('holidayDate').value;
    const description = document.getElementById('holidayDescription').value;
    const type = document.getElementById('holidayType').value;
    const recurring = document.getElementById('holidayRecurring').checked;
    const extraYears = document.getElementById('holidayExtraYears').value;
    
    if (!date || !description) {
        showSnackbar("Veuillez remplir la date et la description");
        return;
    }
    
    // Vérifier si le jour férié existe déjà
    const existingIndex = holidays.findIndex(h => h.date === date);
    
    if (existingIndex !== -1) {
        holidays[existingIndex] = { date, description, type };
    } else {
        holidays.push({ date, description, type });
    }
    
    // Si récurrent, ajouter pour les années futures
    if (recurring) {
        const baseDate = new Date(date);
        const baseYear = baseDate.getFullYear();
        
        for (let year = baseYear + 1; year <= baseYear + 5; year++) {
            const newDate = new Date(baseDate);
            newDate.setFullYear(year);
            const newDateStr = newDate.toISOString().split('T')[0];
            
            if (!holidays.find(h => h.date === newDateStr)) {
                holidays.push({ date: newDateStr, description, type });
            }
        }
    }
    
    // Ajouter les années supplémentaires
    if (extraYears.trim()) {
        const years = extraYears.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y));
        const baseDate = new Date(date);
        const baseMonth = baseDate.getMonth();
        const baseDay = baseDate.getDate();
        
        years.forEach(year => {
            const newDate = new Date(year, baseMonth, baseDay);
            const newDateStr = newDate.toISOString().split('T')[0];
            
            if (!holidays.find(h => h.date === newDateStr)) {
                holidays.push({ date: newDateStr, description, type });
            }
        });
    }
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'SAVE_HOLIDAY',
        details: `${recurring ? 'Jour férié récurrent' : 'Jour férié'} : ${description} (${date})`,
        user: currentUser.username
    });
    
    saveData();
    closePopup();
    displayHolidaysManager();
    showSnackbar(`Jour férié "${description}" enregistré`);
}

function editHoliday(dateStr) {
    const holiday = holidays.find(h => h.date === dateStr);
    if (!holiday) return;
    
    openPopup(
        `Modifier le jour férié du ${dateStr}`,
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Date:</label>
                <input type="date" id="editHolidayDate" value="${holiday.date}" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Description:</label>
                <input type="text" id="editHolidayDescription" value="${holiday.description}" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Type:</label>
                <select id="editHolidayType" class="form-input">
                    <option value="national" ${holiday.type === 'national' ? 'selected' : ''}>National</option>
                    <option value="religieux" ${holiday.type === 'religieux' ? 'selected' : ''}>Religieux</option>
                    <option value="regional" ${holiday.type === 'regional' ? 'selected' : ''}>Régional</option>
                    <option value="exceptionnel" ${holiday.type === 'exceptionnel' ? 'selected' : ''}>Exceptionnel</option>
                </select>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="saveHolidayEdit('${dateStr}')">Enregistrer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function saveHolidayEdit(oldDateStr) {
    const holidayIndex = holidays.findIndex(h => h.date === oldDateStr);
    if (holidayIndex === -1) return;
    
    const date = document.getElementById('editHolidayDate').value;
    const description = document.getElementById('editHolidayDescription').value;
    const type = document.getElementById('editHolidayType').value;
    
    // Si la date change, vérifier qu'elle n'existe pas déjà
    if (date !== oldDateStr && holidays.find(h => h.date === date && h.date !== oldDateStr)) {
        showSnackbar("Un jour férié existe déjà à cette date");
        return;
    }
    
    holidays[holidayIndex] = { date, description, type };
    
    // Mettre à jour aussi dans le planning si nécessaire
    Object.keys(planningData).forEach(monthKey => {
        if (monthKey === oldDateStr.substring(0, 7) && planningData[monthKey]) {
            // Si le jour férié affectait le calcul des shifts, on peut le mettre à jour ici
            // Pour l'instant, on se contente de sauvegarder
        }
    });
    
    saveData();
    closePopup();
    displayHolidaysManager();
    showSnackbar(`Jour férié modifié`);
}

function deleteHoliday(dateStr) {
    if (!confirm("Supprimer ce jour férié ?")) return;
    
    holidays = holidays.filter(h => h.date !== dateStr);
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'DELETE_HOLIDAY',
        details: `Suppression jour férié du ${dateStr}`,
        user: currentUser.username
    });
    
    saveData();
    displayHolidaysManager();
    showSnackbar("Jour férié supprimé");
}

function importYearHolidays() {
    openPopup(
        'Importer les jours fériés d\'une année',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Année:</label>
                <input type="number" id="importYear" value="${new Date().getFullYear() + 1}" class="form-input" min="2020" max="2030">
            </div>
            
            <div class="form-group">
                <label>Pays:</label>
                <select id="importCountry" class="form-input">
                    <option value="maroc">Maroc</option>
                    <option value="france">France</option>
                    <option value="algerie">Algérie</option>
                    <option value="tunisie">Tunisie</option>
                </select>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Jours fériés Maroc ${new Date().getFullYear() + 1}:</strong></p>
                <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.9em;">
                    <li>1er Janvier - Nouvel An</li>
                    <li>11 Janvier - Manifeste de l'Indépendance</li>
                    <li>1er Mai - Fête du Travail</li>
                    <li>30 Juillet - Fête du Trône</li>
                    <li>14 Août - Allégeance Oued Eddahab</li>
                    <li>20 Août - Révolution du Roi et du Peuple</li>
                    <li>21 Août - Fête de la Jeunesse</li>
                    <li>6 Novembre - Marche Verte</li>
                    <li>18 Novembre - Fête de l'Indépendance</li>
                    <li>+ Jours religieux (variables)</li>
                </ul>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="performHolidaysImport()">Importer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function performHolidaysImport() {
    const year = parseInt(document.getElementById('importYear').value);
    const country = document.getElementById('importCountry').value;
    
    // Jours fériés fixes pour le Maroc
    const moroccanHolidays = [
        { date: `${year}-01-01`, description: 'Nouvel An', type: 'national' },
        { date: `${year}-01-11`, description: 'Manifeste de l\'Indépendance', type: 'national' },
        { date: `${year}-05-01`, description: 'Fête du Travail', type: 'national' },
        { date: `${year}-07-30`, description: 'Fête du Trône', type: 'national' },
        { date: `${year}-08-14`, description: 'Allégeance Oued Eddahab', type: 'national' },
        { date: `${year}-08-20`, description: 'Révolution du Roi et du Peuple', type: 'national' },
        { date: `${year}-08-21`, description: 'Fête de la Jeunesse', type: 'national' },
        { date: `${year}-11-06`, description: 'Marche Verte', type: 'national' },
        { date: `${year}-11-18`, description: 'Fête de l\'Indépendance', type: 'national' }
    ];
    
    // Ajouter les jours fériés religieux approximatifs (à adapter)
    // Aid Al Fitr (fin Ramadan) - approximation
    const aidAlFitr = new Date(year, 3, 10); // Approximation avril
    moroccanHolidays.push({
        date: aidAlFitr.toISOString().split('T')[0],
        description: 'Aïd Al-Fitr',
        type: 'religieux'
    });
    
    // Aid Al Adha - approximation
    const aidAlAdha = new Date(year, 6, 20); // Approximation juillet
    moroccanHolidays.push({
        date: aidAlAdha.toISOString().split('T')[0],
        description: 'Aïd Al-Adha',
        type: 'religieux'
    });
    
    // Nouvel An islamique - approximation
    const islamicNewYear = new Date(year, 7, 1); // Approximation août
    moroccanHolidays.push({
        date: islamicNewYear.toISOString().split('T')[0],
        description: 'Nouvel An islamique',
        type: 'religieux'
    });
    
    // Ajouter sans doublons
    let addedCount = 0;
    moroccanHolidays.forEach(holiday => {
        if (!holidays.find(h => h.date === holiday.date)) {
            holidays.push(holiday);
            addedCount++;
        }
    });
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'IMPORT_HOLIDAYS',
        details: `Importation ${addedCount} jours fériés ${country} ${year}`,
        user: currentUser.username
    });
    
    saveData();
    closePopup();
    displayHolidaysManager();
    showSnackbar(`${addedCount} jours fériés importés pour ${year}`);
}

// === SAUVEGARDE ET RESTAURATION ===
function showBackupMenu() {
    openPopup(
        'Sauvegarde et Restauration',
        `
        <div style="padding: 15px;">
            <h3>Sauvegarde des données</h3>
            <p style="margin-bottom: 15px;">Exportez toutes les données de l'application dans un fichier JSON.</p>
            <button class="menu-button" onclick="createBackup()" style="width: 100%; margin-bottom: 10px;">💾 Créer une sauvegarde complète</button>
            
            <h3 style="margin-top: 25px;">Restauration</h3>
            <p style="margin-bottom: 15px;">Importez une sauvegarde précédente. <strong style="color: #e74c3c;">Attention: cela écrasera les données actuelles!</strong></p>
            <div class="form-group">
                <label>Sélectionner un fichier de sauvegarde:</label>
                <input type="file" id="backupFile" accept=".json" class="form-input">
            </div>
            
            <h3 style="margin-top: 25px;">Sauvegardes automatiques</h3>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="autoBackup" ${localStorage.getItem('sga_autoBackup') === 'true' ? 'checked' : ''}>
                    Sauvegarde automatique tous les 7 jours
                </label>
            </div>
            
            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Dernière sauvegarde:</strong> ${localStorage.getItem('sga_lastBackup') || 'Jamais'}</p>
                <p><strong>Taille des données:</strong> ${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB</p>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="restoreBackup()">Restaurer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function createBackup() {
    const backupData = {
        version: 'SGA_1.0',
        date: new Date().toISOString(),
        user: currentUser.username,
        data: {
            agents,
            planningData,
            holidays,
            panicCodes,
            radios,
            uniforms,
            warnings,
            leaves,
            radioHistory,
            auditLog
        }
    };
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sga_backup_${new Date().toISOString().split('T')[0]}_${currentUser.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Enregistrer la date de dernière sauvegarde
    localStorage.setItem('sga_lastBackup', new Date().toLocaleString());
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'CREATE_BACKUP',
        details: 'Sauvegarde complète créée',
        user: currentUser.username
    });
    
    showSnackbar('Sauvegarde créée et téléchargée');
}

function restoreBackup() {
    const fileInput = document.getElementById('backupFile');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showSnackbar("Veuillez sélectionner un fichier de sauvegarde");
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            // Vérifier la version
            if (!backupData.version || !backupData.version.startsWith('SGA_')) {
                showSnackbar("Format de fichier invalide");
                return;
            }
            
            if (confirm(`Voulez-vous vraiment restaurer la sauvegarde du ${backupData.date} ? Toutes les données actuelles seront écrasées.`)) {
                // Restaurer les données
                if (backupData.data.agents) agents = backupData.data.agents;
                if (backupData.data.planningData) planningData = backupData.data.planningData;
                if (backupData.data.holidays) holidays = backupData.data.holidays;
                if (backupData.data.panicCodes) panicCodes = backupData.data.panicCodes;
                if (backupData.data.radios) radios = backupData.data.radios;
                if (backupData.data.uniforms) uniforms = backupData.data.uniforms;
                if (backupData.data.warnings) warnings = backupData.data.warnings;
                if (backupData.data.leaves) leaves = backupData.data.leaves;
                if (backupData.data.radioHistory) radioHistory = backupData.data.radioHistory;
                if (backupData.data.auditLog) auditLog = backupData.data.auditLog;
                
                // Ajouter un log pour cette restauration
                auditLog.push({
                    date: new Date().toISOString(),
                    action: 'RESTORE_BACKUP',
                    details: `Restauration depuis sauvegarde du ${backupData.date}`,
                    user: currentUser.username
                });
                
                saveData();
                closePopup();
                
                // Recharger l'interface
                displayMainMenu();
                showSnackbar('Données restaurées avec succès !');
            }
        } catch (error) {
            showSnackbar("Erreur lors de la lecture du fichier: " + error.message);
        }
    };
    
    reader.readAsText(file);
}

// === RÉINITIALISATION COMPLÈTE ===
function showResetConfirmation() {
    openPopup(
        'Réinitialisation complète',
        `
        <div style="padding: 15px; text-align: center;">
            <div style="font-size: 4em; color: #e74c3c; margin: 20px 0;">⚠️</div>
            <h3 style="color: #e74c3c;">Attention !</h3>
            <p>Cette action va supprimer <strong>TOUTES</strong> les données de l'application :</p>
            <ul style="text-align: left; margin: 15px 0;">
                <li>Tous les agents</li>
                <li>Tous les plannings</li>
                <li>Tous les congés</li>
                <li>Tous les avertissements</li>
                <li>Tous les historiques</li>
            </ul>
            <p>Cette action est <strong>irréversible</strong> !</p>
            
            <div class="form-group" style="margin-top: 20px; text-align: left;">
                <label>
                    <input type="checkbox" id="confirmReset">
                    Je comprends et je confirme la réinitialisation complète
                </label>
            </div>
            
            <div class="form-group" style="margin-top: 15px; text-align: left;">
                <label>Mot de passe administrateur:</label>
                <input type="password" id="resetPassword" class="form-input" placeholder="Mot de passe requis">
            </div>
        </div>
        `,
        `
        <button class="popup-button red" onclick="performFullReset()" id="resetButton" disabled>RÉINITIALISER TOUT</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
    
    // Activer/désactiver le bouton de réinitialisation
    document.getElementById('confirmReset').addEventListener('change', function() {
        const resetButton = document.getElementById('resetButton');
        resetButton.disabled = !this.checked;
    });
}

function performFullReset() {
    const password = document.getElementById('resetPassword').value;
    
    // Vérifier le mot de passe (en production, utiliser une vérification sécurisée)
    if (password !== 'admin123') {
        showSnackbar("Mot de passe incorrect");
        return;
    }
    
    if (confirm("DERNIER AVERTIMENT : Voulez-vous vraiment TOUT supprimer ?")) {
        // Sauvegarde d'urgence avant suppression
        const emergencyBackup = {
            agents, planningData, holidays, panicCodes, radios, uniforms, warnings, leaves, radioHistory, auditLog
        };
        
        // Vider toutes les données
        agents = [];
        planningData = {};
        holidays = [];
        panicCodes = [];
        radios = [];
        uniforms = [];
        warnings = [];
        leaves = [];
        radioHistory = [];
        auditLog = [];
        
        // Vider le localStorage
        localStorage.clear();
        
        // Ajouter un log final
        auditLog.push({
            date: new Date().toISOString(),
            action: 'FULL_RESET',
            details: 'Réinitialisation complète de l\'application',
            user: currentUser.username
        });
        
        // Sauvegarder (juste l'audit log)
        saveData();
        
        // Sauvegarder la sauvegarde d'urgence dans un cookie temporaire
        document.cookie = `sga_emergency_backup=${JSON.stringify(emergencyBackup)}; max-age=3600; path=/`;
        
        closePopup();
        
        // Recharger avec les données de test
        setTimeout(() => {
            initializeTestData();
            displayMainMenu();
            showSnackbar('Application réinitialisée. Les données de test ont été chargées.');
        }, 1000);
    }
}

// === IMPORT EXCEL ===
function importPlanningFromExcel() {
    openPopup(
        'Importer depuis Excel',
        `
        <div style="padding: 15px;">
            <h3>Instructions d'import</h3>
            <p>Format Excel requis :</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Colonne A : Code agent</li>
                <li>Colonne B : Date (YYYY-MM-DD)</li>
                <li>Colonne C : Shift (1, 2, 3, R, C, M, A)</li>
            </ul>
            
            <div class="form-group">
                <label>Sélectionner le fichier Excel:</label>
                <input type="file" id="excelFile" accept=".xlsx,.xls,.csv" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Options d'import:</label>
                <div style="margin-top: 10px;">
                    <label><input type="checkbox" id="importOverwrite" checked> Écraser les shifts existants</label><br>
                    <label><input type="checkbox" id="importValidate"> Valider les agents existants</label><br>
                    <label><input type="checkbox" id="importLog"> Créer un log d'import</label>
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; display: none;" id="importPreview">
                <h4>Aperçu de l'import</h4>
                <div id="importPreviewContent"></div>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="performExcelImport()">Importer</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
    
    // Prévisualisation du fichier
    document.getElementById('excelFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Lire le fichier
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            
            // Pour un vrai projet, utiliser SheetJS (xlsx library)
            // Ici, simulation avec un fichier CSV
            if (file.name.endsWith('.csv')) {
                const lines = data.split('\n').slice(0, 10); // Premières 10 lignes
                let previewHTML = '<table style="width: 100%; font-size: 0.8em; border-collapse: collapse;">';
                
                lines.forEach((line, index) => {
                    if (line.trim()) {
                        previewHTML += '<tr>';
                        line.split(',').forEach(cell => {
                            previewHTML += `<td style="border: 1px solid #ddd; padding: 3px;">${cell}</td>`;
                        });
                        previewHTML += '</tr>';
                    }
                });
                
                previewHTML += '</table>';
                
                document.getElementById('importPreviewContent').innerHTML = previewHTML;
                document.getElementById('importPreview').style.display = 'block';
            } else {
                document.getElementById('importPreviewContent').innerHTML = 
                    '<p>Prévisualisation disponible seulement pour les fichiers CSV</p>';
                document.getElementById('importPreview').style.display = 'block';
            }
        };
        
        reader.readAsText(file);
    });
}

function performExcelImport() {
    const fileInput = document.getElementById('excelFile');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showSnackbar("Veuillez sélectionner un fichier");
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = e.target.result;
            const lines = data.split('\n');
            const overwrite = document.getElementById('importOverwrite').checked;
            const validate = document.getElementById('importValidate').checked;
            const createLog = document.getElementById('importLog').checked;
            
            let importedCount = 0;
            let skippedCount = 0;
            let errorCount = 0;
            const errors = [];
            
            // Pour chaque ligne (sauf l'en-tête)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const cells = line.split(',');
                if (cells.length < 3) {
                    errorCount++;
                    errors.push(`Ligne ${i}: Format invalide`);
                    continue;
                }
                
                const agentCode = cells[0].trim();
                const dateStr = cells[1].trim();
                const shift = cells[2].trim().toUpperCase();
                
                // Validation
                if (validate) {
                    const agent = agents.find(a => a.code === agentCode);
                    if (!agent) {
                        skippedCount++;
                        errors.push(`Ligne ${i}: Agent ${agentCode} non trouvé`);
                        continue;
                    }
                }
                
                // Valider la date
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    errorCount++;
                    errors.push(`Ligne ${i}: Date invalide ${dateStr}`);
                    continue;
                }
                
                // Valider le shift
                const validShifts = ['1', '2', '3', 'R', 'C', 'M', 'A'];
                if (!validShifts.includes(shift)) {
                    errorCount++;
                    errors.push(`Ligne ${i}: Shift invalide ${shift}`);
                    continue;
                }
                
                // Importer
                const monthKey = dateStr.substring(0, 7);
                if (!planningData[monthKey]) planningData[monthKey] = {};
                if (!planningData[monthKey][agentCode]) planningData[monthKey][agentCode] = {};
                
                // Vérifier si déjà existant
                if (overwrite || !planningData[monthKey][agentCode][dateStr]) {
                    planningData[monthKey][agentCode][dateStr] = {
                        shift: shift,
                        modified: new Date().toISOString(),
                        modifiedBy: currentUser.username,
                        imported: true
                    };
                    importedCount++;
                } else {
                    skippedCount++;
                }
            }
            
            // Log d'audit
            if (createLog) {
                auditLog.push({
                    date: new Date().toISOString(),
                    action: 'EXCEL_IMPORT',
                    details: `Import Excel: ${importedCount} lignes importées, ${skippedCount} ignorées, ${errorCount} erreurs`,
                    user: currentUser.username
                });
            }
            
            saveData();
            closePopup();
            
            // Afficher le rapport
            openPopup(
                'Rapport d\'import',
                `
                <div style="padding: 15px; max-height: 400px; overflow-y: auto;">
                    <h3>Import terminé</h3>
                    <div class="stats-grid" style="margin: 15px 0;">
                        <div class="stat-card">
                            <div class="stat-value" style="color: #27ae60;">${importedCount}</div>
                            <div class="stat-label">Importés</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color: #f39c12;">${skippedCount}</div>
                            <div class="stat-label">Ignorés</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color: #e74c3c;">${errorCount}</div>
                            <div class="stat-label">Erreurs</div>
                        </div>
                    </div>
                    
                    ${errorCount > 0 ? `
                    <h4>Erreurs détaillées:</h4>
                    <div style="max-height: 150px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 5px; font-size: 0.9em;">
                        ${errors.slice(0, 20).map(err => `<div style="margin: 2px 0;">${err}</div>`).join('')}
                        ${errors.length > 20 ? `<div>... et ${errors.length - 20} erreurs supplémentaires</div>` : ''}
                    </div>
                    ` : ''}
                </div>
                `,
                `
                <button class="popup-button green" onclick="closePopup()">OK</button>
                `
            );
            
        } catch (error) {
            showSnackbar("Erreur lors de l'import: " + error.message);
        }
    };
    
    reader.readAsText(file);
}

// === EXPORT PDF ===
function exportToPDF() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    openPopup(
        'Exporter en PDF',
        `
        <div style="padding: 15px;">
            <div class="form-group">
                <label>Mois:</label>
                <select id="pdfMonth" class="form-input">
                    ${Array.from({length: 12}, (_, i) => 
                        `<option value="${i+1}" ${i+1 === currentMonth ? 'selected' : ''}>${getMonthName(i+1)}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Année:</label>
                <input type="number" id="pdfYear" value="${currentYear}" class="form-input" min="2024" max="2030">
            </div>
            
            <div class="form-group">
                <label>Groupe:</label>
                <select id="pdfGroup" class="form-input">
                    <option value="ALL">Tous les groupes</option>
                    <option value="A">Groupe A</option>
                    <option value="B">Groupe B</option>
                    <option value="C">Groupe C</option>
                    <option value="D">Groupe D</option>
                    <option value="E">Groupe E</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Options:</label>
                <div style="margin-top: 10px;">
                    <label><input type="checkbox" id="pdfStats" checked> Inclure les statistiques</label><br>
                    <label><input type="checkbox" id="pdfLegend" checked> Inclure la légende</label><br>
                    <label><input type="checkbox" id="pdfHeader" checked> Inclure l'en-tête</label><br>
                    <label><input type="checkbox" id="pdfSignatures"> Lignes de signature</label>
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                <p><strong>Format PDF A4:</strong></p>
                <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.9em;">
                    <li>Orientation paysage</li>
                    <li>Marges réduites</li>
                    <li>Police lisible</li>
                    <li>Couleurs des shifts</li>
                </ul>
            </div>
        </div>
        `,
        `
        <button class="popup-button green" onclick="generatePDF()">Générer PDF</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
        `
    );
}

function generatePDF() {
    const month = parseInt(document.getElementById('pdfMonth').value);
    const year = parseInt(document.getElementById('pdfYear').value);
    const group = document.getElementById('pdfGroup').value;
    const includeStats = document.getElementById('pdfStats').checked;
    const includeLegend = document.getElementById('pdfLegend').checked;
    const includeHeader = document.getElementById('pdfHeader').checked;
    const includeSignatures = document.getElementById('pdfSignatures').checked;
    
    // Filtrer les agents selon le groupe
    let filteredAgents = agents.filter(a => a.statut === 'actif');
    if (group !== 'ALL') {
        filteredAgents = filteredAgents.filter(a => a.groupe === group);
    }
    
    if (filteredAgents.length === 0) {
        showSnackbar("Aucun agent à exporter");
        return;
    }
    
    showSnackbar("Génération du PDF en cours...");
    
    // Pour un vrai projet, utiliser jsPDF ou une bibliothèque similaire
    // Ici, nous allons créer une version HTML puis la convertir
    
    // Créer une fenêtre d'impression stylisée
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Planning ${getMonthName(month)} ${year} - Groupe ${group}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                h2 { color: #34495e; margin-top: 25px; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 12px; }
                th { background: #2c3e50; color: white; padding: 8px; text-align: center; }
                td { border: 1px solid #ddd; padding: 6px; text-align: center; }
                .shift-1 { background: #3498db; color: white; font-weight: bold; }
                .shift-2 { background: #e74c3c; color: white; font-weight: bold; }
                .shift-3 { background: #9b59b6; color: white; font-weight: bold; }
                .shift-R { background: #2ecc71; color: white; font-weight: bold; }
                .shift-C { background: #f39c12; color: white; font-weight: bold; }
                .shift-M { background: #e67e22; color: white; font-weight: bold; }
                .shift-A { background: #95a5a6; color: white; font-weight: bold; }
                .weekend { background: #f8f9fa; }
                .holiday { background: #ffeaa7; }
                .stats { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }
                .stat-box { border: 1px solid #ddd; padding: 10px; min-width: 150px; text-align: center; }
                .legend { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
                .legend-item { display: flex; align-items: center; margin-right: 15px; }
                .legend-color { width: 20px; height: 20px; margin-right: 5px; }
                .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
                .signature-line { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 5px; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; cursor: pointer; margin-bottom: 20px;">
                🖨️ Imprimer ce PDF
            </button>
    `);
    
    // En-tête
    if (includeHeader) {
        printWindow.document.write(`
            <h1>PLANNING MENSUEL - ${getMonthName(month).toUpperCase()} ${year}</h1>
            <p>Date d'édition: ${new Date().toLocaleDateString('fr-FR')} | Groupe: ${group === 'ALL' ? 'Tous' : group} | Agents: ${filteredAgents.length}</p>
        `);
    }
    
    // Statistiques
    if (includeStats) {
        const stats = calculateMonthlyStatistics(month, year);
        printWindow.document.write(`
            <h2>Statistiques du mois</h2>
            <div class="stats">
                <div class="stat-box">
                    <div style="font-size: 24px; font-weight: bold;">${stats.total_shifts}</div>
                    <div>Shifts opérationnels</div>
                </div>
                <div class="stat-box">
                    <div style="font-size: 24px; font-weight: bold;">${stats.jours_travailles}</div>
                    <div>Jours travaillés</div>
                </div>
                <div class="stat-box">
                    <div style="font-size: 24px; font-weight: bold;">${stats.jours_conges}</div>
                    <div>Jours de congé</div>
                </div>
                <div class="stat-box">
                    <div style="font-size: 24px; font-weight: bold;">${stats.taux_occupation}%</div>
                    <div>Taux d'occupation</div>
                </div>
            </div>
        `);
    }
    
    // Planning
    printWindow.document.write(`<h2>Planning détaillé</h2>`);
    
    // Générer le tableau
    const daysInMonth = new Date(year, month, 0).getDate();
    const jours_francais = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    let tableHTML = `<table>
        <thead>
            <tr>
                <th rowspan="2">Agent</th>
                <th colspan="${daysInMonth}">Jours du mois</th>
            </tr>
            <tr>`;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const jourSemaine = jours_francais[date.getDay()];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isHoliday = isHolidayDate(date);
        
        tableHTML += `<th class="${isWeekend ? 'weekend' : ''} ${isHoliday ? 'holiday' : ''}">${jourSemaine}<br>${day}</th>`;
    }
    
    tableHTML += `</tr></thead><tbody>`;
    
    filteredAgents.forEach(agent => {
        tableHTML += `<tr><td><strong>${agent.code}</strong><br><small>${agent.prenom} ${agent.nom}</small></td>`;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dateStr = date.toISOString().split('T')[0];
            const shift = getShiftForAgent(agent.code, dateStr);
            
            tableHTML += `<td class="shift-${shift}">${shift}</td>`;
        }
        
        tableHTML += `</tr>`;
    });
    
    tableHTML += `</tbody></table>`;
    printWindow.document.write(tableHTML);
    
    // Légende
    if (includeLegend) {
        printWindow.document.write(`
            <h2>Légende</h2>
            <div class="legend">
                <div class="legend-item"><div class="legend-color" style="background: #3498db;"></div>Matin (1)</div>
                <div class="legend-item"><div class="legend-color" style="background: #e74c3c;"></div>Après-midi (2)</div>
                <div class="legend-item"><div class="legend-color" style="background: #9b59b6;"></div>Nuit (3)</div>
                <div class="legend-item"><div class="legend-color" style="background: #2ecc71;"></div>Repos (R)</div>
                <div class="legend-item"><div class="legend-color" style="background: #f39c12;"></div>Congé (C)</div>
                <div class="legend-item"><div class="legend-color" style="background: #e67e22;"></div>Maladie (M)</div>
                <div class="legend-item"><div class="legend-color" style="background: #95a5a6;"></div>Autre (A)</div>
                <div class="legend-item"><div class="legend-color" style="background: #f8f9fa; border: 1px solid #ddd;"></div>Week-end</div>
                <div class="legend-item"><div class="legend-color" style="background: #ffeaa7;"></div>Jour férié</div>
            </div>
        `);
    }
    
    // Signatures
    if (includeSignatures) {
        printWindow.document.write(`
            <div class="signatures">
                <div class="signature-line">Chef de service</div>
                <div class="signature-line">Chef de département</div>
                <div class="signature-line">Directeur</div>
            </div>
        `);
    }
    
    // Pied de page
    printWindow.document.write(`
            <p style="margin-top: 50px; text-align: center; color: #95a5a6; font-size: 0.9em;">
                Document généré par SGA (Système de Gestion des Agents) - ${new Date().toLocaleString('fr-FR')}
            </p>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Log d'audit
    auditLog.push({
        date: new Date().toISOString(),
        action: 'EXPORT_PDF',
        details: `Export PDF: ${getMonthName(month)} ${year}, Groupe ${group}`,
        user: currentUser.username
    });
    
    closePopup();
}

// === AUDIT LOG VIEWER ===
function displayAuditLog() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "JOURNAL D'AUDIT";
    mainContent.innerHTML = '';
    
    if (auditLog.length === 0) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucune activité enregistrée dans le journal</p>
            </div>
        `;
    } else {
        // Options de filtrage
        mainContent.innerHTML = `
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <h3>Filtres</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                    <select id="auditFilterAction" class="form-input" style="flex: 1; min-width: 150px;">
                        <option value="">Toutes les actions</option>
                        <option value="LOGIN">Connexions</option>
                        <option value="ADD_AGENT">Ajouts agents</option>
                        <option value="EDIT_AGENT">Modifications agents</option>
                        <option value="DELETE_AGENT">Suppressions agents</option>
                        <option value="MASS_EDIT">Éditions en masse</option>
                        <option value="ADD_LEAVE">Ajouts congés</option>
                        <option value="EXPORT">Exports</option>
                    </select>
                    <input type="date" id="auditFilterDate" class="form-input" style="flex: 1; min-width: 150px;">
                    <input type="text" id="auditFilterUser" class="form-input" placeholder="Utilisateur" style="flex: 1; min-width: 150px;">
                    <button class="action-btn blue" onclick="applyAuditFilters()">Filtrer</button>
                    <button class="action-btn gray" onclick="resetAuditFilters()">Réinitialiser</button>
                </div>
            </div>
        `;
        
        // Tableau
        const table = document.createElement('table');
        table.className = 'planning-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Date & Heure</th>
                    <th>Action</th>
                    <th>Détails</th>
                    <th>Utilisateur</th>
                </tr>
            </thead>
            <tbody>
                ${auditLog.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 100).map(log => {
                    const date = new Date(log.date);
                    return `
                        <tr>
                            <td>${date.toLocaleString('fr-FR')}</td>
                            <td><span class="status-badge ${getAuditActionClass(log.action)}">${log.action}</span></td>
                            <td>${log.details || ''}</td>
                            <td>${log.user || 'system'}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        
        mainContent.appendChild(table);
        
        // Statistiques
        const statsHTML = `
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <h3>Statistiques d'activité</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;">
                    <div>
                        <strong>Total d'actions:</strong> ${auditLog.length}
                    </div>
                    <div>
                        <strong>Actions aujourd'hui:</strong> ${auditLog.filter(l => new Date(l.date).toDateString() === new Date().toDateString()).length}
                    </div>
                    <div>
                        <strong>Actions cette semaine:</strong> ${auditLog.filter(l => {
                            const logDate = new Date(l.date);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return logDate > weekAgo;
                        }).length}
                    </div>
                </div>
            </div>
        `;
        
        mainContent.innerHTML += statsHTML;
        
        // Bouton d'export
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📊 Exporter le journal';
        exportBtn.className = 'menu-button';
        exportBtn.onclick = exportAuditLog;
        exportBtn.style.marginTop = '20px';
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ Nettoyer l\'ancien journal';
        clearBtn.className = 'menu-button';
        clearBtn.onclick = clearOldAuditLog;
        clearBtn.style.marginTop = '10px';
        
        const backBtn = document.createElement('button');
        backBtn.textContent = '← Retour';
        backBtn.className = 'menu-button back-button';
        backBtn.onclick = displayMainMenu;
        backBtn.style.marginTop = '10px';
        
        mainContent.appendChild(exportBtn);
        mainContent.appendChild(clearBtn);
        mainContent.appendChild(backBtn);
    }
}

function getAuditActionClass(action) {
    const classes = {
        'LOGIN': 'active',
        'ADD_AGENT': 'active',
        'EDIT_AGENT': 'warning',
        'DELETE_AGENT': 'inactive',
        'MASS_EDIT': 'warning',
        'ADD_LEAVE': 'active',
        'APPROVE_LEAVE': 'active',
        'REJECT_LEAVE': 'inactive',
        'DELETE_LEAVE': 'inactive',
        'EXPORT': 'active',
        'IMPORT': 'warning',
        'CREATE_BACKUP': 'active',
        'RESTORE_BACKUP': 'warning',
        'FULL_RESET': 'inactive'
    };
    
    return classes[action] || '';
}

function applyAuditFilters() {
    // Cette fonction filtrerait le tableau d'audit
    showSnackbar("Filtres appliqués (fonctionnalité à compléter)");
}

function resetAuditFilters() {
    document.getElementById('auditFilterAction').value = '';
    document.getElementById('auditFilterDate').value = '';
    document.getElementById('auditFilterUser').value = '';
    showSnackbar("Filtres réinitialisés");
}

function exportAuditLog() {
    // Exporter le journal en CSV
    let csvContent = "Date;Action;Détails;Utilisateur\n";
    
    auditLog.forEach(log => {
        const row = [
            new Date(log.date).toLocaleString('fr-FR'),
            log.action,
            `"${log.details || ''}"`,
            log.user || 'system'
        ];
        csvContent += row.join(';') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showSnackbar("Journal d'audit exporté");
}

function clearOldAuditLog() {
    if (confirm("Supprimer les entrées de journal de plus de 3 mois ?")) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const oldCount = auditLog.length;
        auditLog = auditLog.filter(log => new Date(log.date) > threeMonthsAgo);
        const newCount = auditLog.length;
        
        saveData();
        displayAuditLog();
        showSnackbar(`${oldCount - newCount} entrées supprimées`);
    }
}

// === MISE À JOUR DU MENU PRINCIPAL ===
function displayMainMenu() {
    document.getElementById('sub-title').textContent = "MENU PRINCIPAL";
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="dashboard">
            <div class="welcome-section">
                <h2>Système de Gestion des Agents</h2>
                <p>Bienvenue ${currentUser.name} (${currentUser.role})</p>
                <div class="quick-stats">
                    <div class="stat-item">
                        <div class="stat-number">${agents.length}</div>
                        <div class="stat-label">Agents</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${agents.filter(a => a.statut === 'actif').length}</div>
                        <div class="stat-label">Actifs</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${leaves.filter(l => l.statut === 'EN_ATTENTE').length}</div>
                        <div class="stat-label">Congés en attente</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${auditLog.filter(l => new Date(l.date).toDateString() === new Date().toDateString()).length}</div>
                        <div class="stat-label">Actions aujourd'hui</div>
                    </div>
                </div>
            </div>
            
            <div class="menu-grid">
                <!-- Planning -->
                <div class="menu-card" onclick="displayMonthlyPlanning()">
                    <div class="menu-icon">📅</div>
                    <div class="menu-title">Planning Mensuel</div>
                    <div class="menu-desc">Gérer les shifts et horaires</div>
                </div>
                
                <!-- Agents -->
                <div class="menu-card" onclick="displayAgentsList()">
                    <div class="menu-icon">👤</div>
                    <div class="menu-title">Gestion Agents</div>
                    <div class="menu-desc">Liste, ajout, modification</div>
                </div>
                
                <!-- Congés -->
                <div class="menu-card" onclick="displayLeavesMenu()">
                    <div class="menu-icon">🏖️</div>
                    <div class="menu-title">Gestion Congés</div>
                    <div class="menu-desc">Demandes, approbations</div>
                </div>
                
                <!-- Éditeur en masse -->
                <div class="menu-card ${!checkPermission(USER_ROLES.SUPERVISOR) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.SUPERVISOR)) showMassEditor()">
                    <div class="menu-icon">✏️</div>
                    <div class="menu-title">Éditeur en Masse</div>
                    <div class="menu-desc">Modifications multiples</div>
                </div>
                
                <!-- Codes Panique -->
                <div class="menu-card ${!checkPermission(USER_ROLES.SUPERVISOR) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.SUPERVISOR)) displayPanicCodesMenu()">
                    <div class="menu-icon">🚨</div>
                    <div class="menu-title">Codes Panique</div>
                    <div class="menu-desc">Gestion des codes d'urgence</div>
                </div>
                
                <!-- Radios -->
                <div class="menu-card ${!checkPermission(USER_ROLES.SUPERVISOR) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.SUPERVISOR)) displayRadiosMenu()">
                    <div class="menu-icon">📻</div>
                    <div class="menu-title">Gestion Radios</div>
                    <div class="menu-desc">Attribution et suivi</div>
                </div>
                
                <!-- Habillement -->
                <div class="menu-card" onclick="displayUniformMenu()">
                    <div class="menu-icon">👔</div>
                    <div class="menu-title">Habillement</div>
                    <div class="menu-desc">Tailles et équipement</div>
                </div>
                
                <!-- Avertissements -->
                <div class="menu-card ${!checkPermission(USER_ROLES.SUPERVISOR) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.SUPERVISOR)) displayWarningsMenu()">
                    <div class="menu-icon">⚠️</div>
                    <div class="menu-title">Avertissements</div>
                    <div class="menu-desc">Suivi disciplinaire</div>
                </div>
                
                <!-- Jours fériés -->
                <div class="menu-card ${!checkPermission(USER_ROLES.SUPERVISOR) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.SUPERVISOR)) displayHolidaysManager()">
                    <div class="menu-icon">🎉</div>
                    <div class="menu-title">Jours Fériés</div>
                    <div class="menu-desc">Calendrier et gestion</div>
                </div>
                
                <!-- Statistiques -->
                <div class="menu-card" onclick="showRanking()">
                    <div class="menu-icon">📊</div>
                    <div class="menu-title">Statistiques</div>
                    <div class="menu-desc">Classement et analyses</div>
                </div>
                
                <!-- Export/Import -->
                <div class="menu-card ${!checkPermission(USER_ROLES.SUPERVISOR) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.SUPERVISOR)) showExportMenu()">
                    <div class="menu-icon">📤</div>
                    <div class="menu-title">Export/Import</div>
                    <div class="menu-desc">Données et reporting</div>
                </div>
                
                <!-- Journal d'audit -->
                <div class="menu-card ${!checkPermission(USER_ROLES.ADMIN) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.ADMIN)) displayAuditLog()">
                    <div class="menu-icon">📝</div>
                    <div class="menu-title">Journal d'Audit</div>
                    <div class="menu-desc">Historique des actions</div>
                </div>
                
                <!-- Configuration -->
                <div class="menu-card ${!checkPermission(USER_ROLES.ADMIN) ? 'disabled' : ''}" onclick="if(checkPermission(USER_ROLES.ADMIN)) displayConfigMenu()">
                    <div class="menu-icon">⚙️</div>
                    <div class="menu-title">Configuration</div>
                    <div class="menu-desc">Paramètres système</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #95a5a6; font-size: 0.9em;">
            <p>SGA v1.0 - Système de Gestion des Agents | ${new Date().toLocaleDateString('fr-FR')}</p>
            <p style="margin-top: 5px;">
                <button class="action-btn small blue" onclick="showLoginForm()">Changer d'utilisateur</button>
                <button class="action-btn small gray" onclick="showBackupMenu()">Sauvegarde</button>
            </p>
        </div>
    `;
    
    updateUIForUserRole();
}

// === STYLES SUPPLÉMENTAIRES ===
function addAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .disabled:hover {
            background: #f8f9fa !important;
        }
        
        .dashboard {
            padding: 20px;
        }
        
        .welcome-section {
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .welcome-section h2 {
            margin: 0 0 10px 0;
            font-size: 1.8em;
        }
        
        .quick-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 20px;
        }
        
        .stat-item {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 8px;
            min-width: 120px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
        }
        
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .menu-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .menu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            border-color: #3498db;
        }
        
        .menu-icon {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .menu-title {
            font-weight: bold;
            font-size: 1.2em;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        
        .menu-desc {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .classement-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .classement-table th {
            background: #2c3e50;
            color: white;
            padding: 12px;
            text-align: left;
        }
        
        .classement-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        
        .rank-1 {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            font-weight: bold;
        }
        
        .rank-2 {
            background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
        }
        
        .rank-3 {
            background: linear-gradient(135deg, #cd7f32, #e6a157);
        }
        
        .group-stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        .group-stat {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .group-stat:last-child {
            border-bottom: none;
        }
        
        .signature-area {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
        }
        
        .signature-line {
            width: 250px;
            border-top: 1px solid #000;
            margin: 40px auto 10px;
            text-align: center;
            padding-top: 5px;
        }
        
        .weekend {
            background-color: #f8f9fa;
        }
        
        .holiday {
            background-color: #ffeaa7;
        }
    `;
    document.head.appendChild(style);
}

// === INITIALISATION COMPLÈTE ===
function initCompleteApp() {
    console.log("🚀 Initialisation de SGA version complète...");
    
    // Charger les données existantes
    loadData();
    
    // Initialiser les données de test si vide
    if (agents.length === 0) {
        console.log("📦 Chargement des données de test...");
        initializeTestData();
    }
    
    // Ajouter les styles supplémentaires
    addAdditionalStyles();
    
    // Mettre à jour l'interface pour l'utilisateur
    updateUIForUserRole();
    
    // Afficher le menu principal
    displayMainMenu();
    
    console.log("✅ SGA version complète initialisée avec succès !");
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', initCompleteApp);
