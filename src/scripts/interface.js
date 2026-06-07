const theme = {
    themeIsDark: false,

    initializeSettings: () => {
        let t = window.localStorage.getItem('theme');

        if (t != null)
            theme.themeIsDark = t === 'true' || t === true;

        theme.setTheme(theme.themeIsDark);
    },
    setTheme: (val) => {
        theme.themeIsDark = val;

        document.documentElement.classList.toggle('dark-mode', theme.themeIsDark);
        window.localStorage.setItem('theme', theme.themeIsDark);
    },
    toggleTheme: () => {
        theme.setTheme(!theme.themeIsDark);
    },
};
// This will run immediately when the page loads, even before dom content is loaded, to ensure there's no flash of white content when about to change the theme
theme.initializeSettings();

const interface = {
    smallScreen: false,
    sideMode: 0,
    _sideModeToggled: 0,

    switchSide: () => {
        interface._sideModeToggled++;
        interface.applySideLayout();
    },
    applySideLayout: () => {
        const editor = document.getElementById('editor');
        const viewer = document.getElementById('viewer');
        const mod = interface.smallScreen ? 2 : 3;
        interface.sideMode = interface._sideModeToggled % mod + (interface.smallScreen ? 1 : 0);

        editor.classList.toggle('hidden', interface.sideMode === 2);
        viewer.classList.toggle('hidden', interface.sideMode === 1);
    },
    toggleSidebar: (t) => {
        t.parentElement.classList.toggle('collapsed');
    },
    resized: () => {
        const width = window.innerWidth;
        interface.smallScreen = width < 1000;
        interface.applySideLayout();
    }
};

const modals = {
    modalActions: [],
    showModal: (title, desc, buttons) => {
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');

        modal.querySelector('h1').textContent = translate(title);
        modal.querySelector('p').textContent = translate(desc);

        buttons = buttons && Array.isArray(buttons) && buttons.length > 0 ? buttons : [['ok', () => { }]];

        let b = document.getElementById('modal-button-0');
        b.textContent = translate(buttons[0][0])
        modals.modalActions[0] = buttons[0][1];

        b = document.getElementById('modal-button-1');

        if (buttons.length === 2) {
            b.classList.remove('hidden');
            b.textContent = translate(buttons[1][0])
            modals.modalActions[1] = buttons[1][1];
        }
        else
            b.classList.add('hidden');
    },
    hideModal: () => {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
    },
    modalButtonClicked: (btn) => {
        const act = modals.modalActions[btn];
        if (act && typeof act === 'function') {
            const r = act();

            if (r !== 1123)
                modals.hideModal();
        }
    }
};

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toUpperCase() === 'Z')
        historyUndo();
    else if (e.ctrlKey && e.key.toUpperCase() === 'Y')
        historyRedo();
    else if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        saveBtnClick();
        e.preventDefault();
    }
});

window.addEventListener('DOMContentLoaded', () => { interface.resized(); });
window.addEventListener('resize', () => { interface.resized(); });