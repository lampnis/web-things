// Pressure calculator
// Calculates bidirectionally mbar, atm, Torr and mmHg

function torrToPascal(torr) {
  let pascal;
  pascal = 133.3224 * torr;
  return pascal;
}

function mbarToPascal(mbar) {
  let pascal;
  pascal = mbar * 100;
  return pascal;
}

function atmToPascal(atm) {
  let pascal;
  pascal = 101325 * atm;
  return pascal;
}

function pascalToTorr(pascal) {
    let torr;
    torr = pascal / 133.3224;
    return torr;
}

function pascalToMbar(pascal) {
    let mbar;
    mbar = pascal / 100;
    return mbar;
}

function pascalToAtm(pascal) {
    let atm;
    atm = pascal / 101325;
    return atm;
}

const pressureConverters = {
  'input-mbar': {
    toPascal: mbarToPascal,
    fromPascal: pascalToMbar
  },
  'input-atm': {
    toPascal: atmToPascal,
    fromPascal: pascalToAtm
  },
  'input-torr': {
    toPascal: torrToPascal,
    fromPascal: pascalToTorr
  },
  'input-pa': {
    toPascal: (val) => parseFloat(val),
    fromPascal: (pascal) => pascal
  }
}

function updatePressure(sourceID, value) {

  let numValue = parseFloat(value);
  if (isNaN(numValue)) return;

  console.log("Triggered by:", sourceID, "Value:", value);
  let pascal = pressureConverters[sourceID].toPascal(numValue);

  Object.keys(pressureConverters).forEach(key => {
    if (key == sourceID) return;
    let newValue = pressureConverters[key].fromPascal(pascal).toExponential(5);
    let existingValue = parseFloat(document.getElementById(key).value);
    let threshold = 1e-22;

    if (isNaN(existingValue) || Math.abs(existingValue - newValue) > threshold) {
      document.getElementById(key).value = newValue;
    }
  })

}
