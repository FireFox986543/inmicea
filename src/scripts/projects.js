let projects = [];
let currentProject = window.localStorage.getItem('currentProject'); // The item should contain an id for the last project, or null if it's a draft
let currentDirty = false;

_initializeProjectsSettings();
function _initializeProjectsSettings() {
    const v = window.localStorage.getItem('projects');

    if (v)
        projects = JSON.parse(v);

    // No projects selected
    if (currentProject == null)
        constructDefaultCards();
    else
        loadProject(currentProject);

    // There's a draft from last time
    if (window.localStorage.getItem('draftProject'))
        modals.showModal('restore_tit', 'restore_desc', [['restore_cont', () => { loadDraft(); }], ['restore_new', () => { createNewDraft(); }]]);

    renderProjectList();
}

function renderProjectList() {
    const pc = document.getElementById('project-container');
    let html = '';
    const ordered = projects.sort((a, b) => b.lastModify - a.lastModify);

    if (projects.length === 0)
        html = `<div data-trkey="no_projects" style="color: var(--muted); font-size: .7rem; text-align: center;">${translate('no_projects')}</div>`

    projects.forEach(p => {
        html += `<div class="project ${p.id === currentProject ? 'active' : ''}" onclick="loadProjectBtnClick('${p.id}')">
                    <span class="project-title">${p.name}</span>
                    <button type="button" class="control-btn selector-btn">
                        <i class="fas fa-ellipsis-vertical"></i>
                        <div class="dropover-selector-wrapper">
                            <div class="dropover-selector">
                                <div class="selector-option" onclick="renameProjectBtnClick('${p.id}'); event.stopPropagation();">
                                    <i class="fas fa-pencil"></i>
                                    <span data-trkey="rename">Rename</span>
                                </div>
                                <div class="selector-option" onclick="duplicateProjectBtnClick('${p.id}'); event.stopPropagation();">
                                    <i class="fas fa-copy"></i>
                                    <span data-trkey="duplicate">Duplicate</span>
                                </div>
                                <div class="selector-option" onclick="deleteProjectBtnClick('${p.id}'); event.stopPropagation();">
                                    <i class="fas fa-trash-can"></i>
                                    <span data-trkey="delete">Delete</span>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>`;
    });

    pc.innerHTML = html;
    const displayer = document.getElementById('current-project-displayer')
    displayer.classList.toggle('hidden', !currentProject);
    displayer.textContent = currentProject ? getProject(currentProject).name : '';
}

function getProject(pid) { return projects.find(x => x.id === pid); }
function addProject(preserve = false) {
    const pName = prompt(translate('enter_pname'), translate('pname_def'));

    if (!warnIfIncorrectName(pName, 50))
        return;

    if (projects.find(p => p.name === pName)) {
        modals.showModal('info', 'pname_exists');
        return false;
    }

    // If preserve is true: keep all cards, and save them to the "new" project
    // If false: create all default cards, then save a "empty" project
    if (!preserve)
        constructDefaultCards();

    const id = generateUUIDv4();
    currentProject = id;
    window.localStorage.setItem('currentProject', currentProject);

    projects.push({ name: pName, id: id, lastModify: Date.now(), cards: serializeAllCards() });
    storeAllProjectsData();
    renderProjectList();
    return true;
}
function storeAllProjectsData() {
    window.localStorage.setItem('projects', JSON.stringify(projects));
}
function saveCurrentProject() {
    const p = projects.find(x => x.id === currentProject);

    if (!p)
        throw new Error("Failed to get project while trying to save: " + currentProject);

    p.cards = serializeAllCards();
    p.lastModify = Date.now();
    storeAllProjectsData();
}
function loadProjectBtnClick(targetPid) {
    // This is a draft, and also there are changes!
    if (isDraft())
        modals.showModal('discard_before_title', 'discard_before_continue&discard_in2', [['cancel', () => { }], ['discard', () => {
            discardDraft();
            loadProject(targetPid);
        }]]);
    else // Not a draft, no problem loading other projects
        loadProject(targetPid);
}
function loadProject(pid) {
    const p = getProject(pid);

    if (!p)
        throw new Error("Failed to load project with id: " + pid);

    currentProject = p.id;
    window.localStorage.setItem('currentProject', currentProject);

    constructNewCardsFrom(JSON.parse(p.cards));
    historyAt = 0;
    history = [];
    renderProjectList();
}
function renameProjectBtnClick(pid) {
    const p = getProject(pid);

    if (!p)
        throw new Error("Failed to find project with id: " + pid);

    const newName = prompt(translate('project_rename'), translate('prename_def'));

    if (!warnIfIncorrectName(newName, 50))
        return;

    if (newName === p.name || projects.find(p => p.name === newName)) {
        modals.showModal('info', 'pname_exists');
        return;
    }

    p.name = newName;
    storeAllProjectsData();
    renderProjectList();
}
function duplicateProjectBtnClick(pid) {
    const p = getProject(pid);
    const newP = JSON.parse(JSON.stringify(p)); // A deep-copy
    newP.id = generateUUIDv4();
    newP.name += ' ' + translate('copy');
    newP.lastModify = Date.now();

    projects.push(newP);
    storeAllProjectsData();
    renderProjectList();

    // Don't try to load the duped project if we've a draft opened
    if (!isDraft())
        loadProject(newP.id);
}
function deleteProjectBtnClick(pid) {
    const p = getProject(pid);

    if (!p)
        throw new Error("Failed to find project with id: " + pid);

    const response = prompt(translate('project_delete'));

    if (response !== translate('yes')) {
        modals.showModal('info', 'project_delete_fail');
        return;
    }

    if (currentProject === pid)
        createNewDraft();

    removeProject(pid);
    storeAllProjectsData();
    renderProjectList();
}
function removeProject(pid) {
    projects.forEach(p => {
        if (p.id === pid)
            p.id = null;
    });
    const n = projects.filter(p => p.id != null);
    projects = n;
}

function createProjectBtnClick() {
    if (isDraft())
        modals.showModal('discard_before_title', 'discard_before_continue&discard_in0', [['cancel', () => { }], ['discard', () => {
            if (addProject()) // Special case: addProject will return true if it has actually created a project, so only in that case discard this project
                discardDraft();
            else {
                modals.showModal('info', 'discard_discarded');
                return 1123; // Special number meant to not hide the modal by default   
            }
        }]]);
    else // Not a draft
        addProject();
}
function createDraftBtnClick() {
    if (isDraft())
        modals.showModal('discard_before_title', 'discard_before_continue&discard_in1', [['cancel', () => { }], ['discard', () => {
            discardDraft();
            createNewDraft();
        }]]);
    else // Not a draft
        createNewDraft();
}
function saveBtnClick() {
    // This is a draft, but don't check against dirtiness, as the user may want to save this before making changes
    if (currentProject == null) {
        addProject(true);
        window.localStorage.removeItem('draftProject');
    }
    else
        saveCurrentProject();
}

function createNewDraft() {
    constructDefaultCards();
    currentProject = null;
    currentDirty = false;
    window.localStorage.removeItem('draftProject');
    window.localStorage.removeItem('currentProject');
}
function loadDraft() {
    try {
        const s = window.localStorage.getItem('draftProject');
        constructNewCardsFrom(JSON.parse(s));
        currentDirty = true;
    } catch (error) {
        modals.showModal('restore_fail_title', 'restore_fail_desc');
        console.error(error);
    }
}
function constructDefaultCards() {
    history = [];
    historyAt = 0;

    allCards.length = 0;
    rootCardlist.length = 0;

    addCardRoot(new HTMLDataCard(), false);
    addCardRoot(new CSSDataCard(), false);
    addCardRoot(new HTMLNavigationCard(), false);

    saveToHistory(false); // Push default state, also don't save just yet
    renderAllCards();
}
function discardDraft() {
    window.localStorage.removeItem('draftProject');
    currentProject = null;
    currentDirty = false;
}
function isDraft() { return currentProject === null && currentDirty; }