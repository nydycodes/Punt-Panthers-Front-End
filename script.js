
const googleFontsAPI = 'https://www.googleapis.com/webfonts/v1/webfonts?key= AIzaSyDSZsWKLu6DAOQVhsGenXR8q1ggBPaSCD4 ';

const fontFamilySelector = document.getElementById('font-family');
const fontWeightSelector = document.getElementById('font-weight');
const italicToggle = document.getElementById('italic-toggle');
const textArea = document.getElementById('text-area');

async function initializeEditor() {
    await loadGoogleFonts();
    loadSavedData();
    attachEventListeners();
}

async function loadGoogleFonts() {
    try {
        const response = await fetch(googleFontsAPI);
        const data = await response.json();
        populateFontFamilySelector(data.items);
    } catch (error) {
        console.error('Error loading Google Fonts:', error);
    }
}

function populateFontFamilySelector(fonts) {
    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.family;
        option.textContent = font.family;
        fontFamilySelector.appendChild(option);
    });
}

function loadSavedData() {
    const savedText = localStorage.getItem('text');
    const savedFontFamily = localStorage.getItem('font-family');
    const savedFontWeight = localStorage.getItem('font-weight');
    const savedItalic = localStorage.getItem('italic');

    if (savedText) {
        textArea.value = savedText;
    }
    if (savedFontFamily) {
        fontFamilySelector.value = savedFontFamily;
        loadFontWeights(savedFontFamily);
    }
    if (savedFontWeight) {
        fontWeightSelector.value = savedFontWeight;
    }
    if (savedItalic === 'true') {
        italicToggle.classList.add('active');
    }
    applyStyles();
}

function attachEventListeners() {
    fontFamilySelector.addEventListener('change', handleFontFamilyChange);
    fontWeightSelector.addEventListener('change', handleFontWeightChange);
    italicToggle.addEventListener('click', handleItalicToggle);
    textArea.addEventListener('input', handleTextInput);
}

function handleFontFamilyChange() {
    const fontFamily = fontFamilySelector.value;
    loadFontWeights(fontFamily);
    saveData();
    applyStyles();
}

async function loadFontWeights(fontFamily) {
    try {
        const response = await fetch(googleFontsAPI);
        const data = await response.json();
        const font = data.items.find(item => item.family === fontFamily);
        populateFontWeightSelector(font.variants);
    } catch (error) {
        console.error('Error loading font weights:', error);
    }
}

function populateFontWeightSelector(variants) {
    fontWeightSelector.innerHTML = '';
    variants.forEach(variant => {
        if (variant.includes('italic')) return; 
        const option = document.createElement('option');
        option.value = variant;
        option.textContent = variant;
        fontWeightSelector.appendChild(option);
    });
}

function handleFontWeightChange() {
    saveData();
    applyStyles();
}

function handleItalicToggle() {
    italicToggle.classList.toggle('active');
    saveData();
    applyStyles();
}

function handleTextInput() {
    saveData();
}

function applyStyles() {
    const fontFamily = fontFamilySelector.value;
    const fontWeight = fontWeightSelector.value;
    const isItalic = italicToggle.classList.contains('active');

    textArea.style.fontFamily = fontFamily;
    textArea.style.fontWeight = fontWeight;
    textArea.style.fontStyle = isItalic ? 'italic' : 'normal';

    loadGoogleFont(fontFamily, fontWeight, isItalic);
}

function loadGoogleFont(fontFamily, fontWeight, isItalic) {
    const italicPart = isItalic ? 'italic' : '';
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@${fontWeight}${italicPart}&display=swap`;
    document.getElementById('google-fonts').href = fontUrl;
}

function saveData() {
    localStorage.setItem('text', textArea.value);
    localStorage.setItem('font-family', fontFamilySelector.value);
    localStorage.setItem('font-weight', fontWeightSelector.value);
    localStorage.setItem('italic', italicToggle.classList.contains('active'));
}

initializeEditor();
