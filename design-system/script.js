function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setRandomColor(colorId) {
  const randomColor = getRandomColor();
  document.getElementById(colorId).value = randomColor;
  const colorPanel = document.querySelector(`.color-panel[data-color-id="${colorId}"]`);
  if (colorPanel) {
    colorPanel.style.backgroundColor = randomColor;
    colorPanel.querySelector('.color-hex').textContent = randomColor;
  }
}

function setColor(elementId, colorPickerId) {
  const colorPicker = document.getElementById(colorPickerId);
  const selectedColor = colorPicker.value;
  const element = document.querySelector(`.color-panel[data-color-id="${elementId}"]`);
  if (element) {
    element.style.backgroundColor = selectedColor;
  } else {
    console.error("Element with ID '${elementId}' not found");
  }

}

function changeFont() {
  const selectedFont = document.getElementById("font").value;
  const fontPanels = document.querySelectorAll(".font-panel");
  fontPanels.forEach(panel => {
    const fontClass = panel.dataset.fontClass;
    const elements = panel.querySelectorAll(`.${fontClass}`);
    elements.forEach(el => {
      el.style.fontFamily = selectedFont;
    });
  });
}

function changeTextStyle() {
  const selectedStyle = document.getElementById("textStyle").value;
  const textPanels = document.querySelectorAll(".text-panel");
  textPanels.forEach(panel => {
    // Reset to default
    panel.innerHTML = '';
    const styleClass = panel.dataset.styleClass;

    if (styleClass === 'style1') {
      panel.innerHTML = `<h1>H1: Main page heading</h1><ul><li>Font-weight: 700 (bold)</li><li>Font-size: 26px</li><li>Font-family: ${document.getElementById("font").value}</li></ul>`;
      panel.querySelector('h1').style.fontFamily = document.getElementById("font").value;
    } else if (styleClass === 'style2') {
      panel.innerHTML = `<h2>H2: Subheading</h2><ul><li>Font-weight: 500</li><li>Font-size: 18px</li><li>Font-family: ${document.getElementById("font").value}</li></ul>`;
      panel.querySelector('h2').style.fontFamily = document.getElementById("font").value;
    } else if (styleClass === 'style3') {
      panel.innerHTML = `<p>P: Paragraph text</p><ul><li>Font-weight: 400 (regular)</li><li>Font-size: 14px</li><li>Font-family: ${document.getElementById("font").value}</li></ul>`;
      panel.querySelector('p').style.fontFamily = document.getElementById("font").value;
    }
  });
}

function randomizeAll() {
  // Randomize colors
  setRandomColor('color1');
  setRandomColor('color2');
  setRandomColor('color3');
  setRandomColor('color4');

  // Randomize font
  const fontOptions = [
    "Source Code Pro",
    "Nunito Sans",
    "Poppins",
    "ABeeZee",
    "Abel",
    "Abhaya Libre",
    "Abril Fatface",
    "Aclonica",
    "Acme",
    "Actor",
    "Adamina",
    "Advent Pro",
    "Aguafina Script",
    "Akronim",
    "Aladin",
    "Alata",
    "Alatsi",
    "Aldrich",
    "Alef",
    "Alegreya",
    "Alegreya Sans",
    "Alegreya SC",
    "Aleo",
    "Alex Brush",
    "Alfa Slab One",
    "Alice",
    "Alike",
    "Alike Angular",
    "Allan",
    "Allerta",
    "Allerta Stencil",
    "Allura",
    "Almendra",
    "Almendra Display",
    "Almendra SC",
    "Amaranth",
    "Amatic SC",
    "Amethysta",
    "Amiri",
    "Amita",
    "Anaheim",
    "Andada Pro",
    "Andika",
    "Angkor",
    "Annie Use Your Telescope",
    "Anonymous Pro",
    "Antic",
    "Anton",
    "Arapey",
    "Arbutus",
    "Arbutus Slab",
    "Architects Daughter",
    "Archivo",
    "Archivo Black",
    "Archivo Narrow",
    "Aref Ruqaa",
    "Arima Madurai",
    "Arimo",
    "Arizonia",
    "Armata",
    "Artifika",
    "Arvo",
    "Asap",
    "Asset",
    "Astloch",
    "Asul",
    "Athiti",
    "Atma",
    "Atomic Age",
    "Aubrey",
    "Audiowide",
    "Autour One",
    "Average",
    "Average Sans",
    "Averia Gruesa",
    "Averia Libre",
    "Averia Sans Libre",
    "Averta",
    "Bad Script",
    "Bahiana",
    "Bahianita",
    "Bai Jamjuree",
    "Baloo 2",
    "Baloo Bhai 2",
    "Baloo Chettan 2",
    "Baloo Da 2",
    "Baloo Paaji 2",
    "Baloo Tamma 2",
    "Baloo Thambi 2",
    "Balsamiq Sans",
    "Balthazar"
  ];

  const randomFont = fontOptions[Math.floor(Math.random() * fontOptions.length)];
  document.getElementById("font").value = randomFont;
  changeFont();

  // Randomize text style
  const styleOptions = ['style1', 'style2', 'style3'];
  const randomStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
  document.getElementById("textStyle").value = randomStyle;
  changeTextStyle();
}

// Initial setup to apply default font on load
setRandomColor("color1");
setRandomColor("color2");
setRandomColor("color3");
setRandomColor("color4");
changeFont();
changeTextStyle();
