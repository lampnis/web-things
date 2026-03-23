// Energy calculator
// Calculates bidirectionally wavelengths, eV, wavenumbers in cm-1,
// joules and frequency!
const planckConst = 6.62607015 * 1e-34; // J*s
const speedOfLight = 299792458; // m/s
const elementaryCharge = 1.602176634 * 1e-19;

function wavenumberToNanometers(wavenumber) {
  let nanometers;
  nanometers = 1e7 / wavenumber;
  return nanometers;
}

function nmToJoules(nm) {
  let joules;
  joules = planckConst * speedOfLight / (nm * 1e-9);
  return joules;
}

function wavenumberToJoules(wavenumber) {
  let joules;
  let nm;
  nm = wavenumberToNanometers(wavenumber);
  joules = nmToJoules(nm);
  return joules;
}

function evToJoules(ev) {
  let joules;
  joules = ev * elementaryCharge;
  return joules;
}

function freqToJoules(freq) {
  let joules;
  joules = freq * planckConst;
  return joules;
}

function joulesToFreq(joules) {
  let freq;
  freq = joules / planckConst;
  return freq;
}

function joulesToNm(joules) {
  let nm;
  nm = planckConst * speedOfLight / joules * 1e9;
  return nm;
}

function joulesToWavenumber(joules) {
  let wav;
  wav = 1e7 / joulesToNm(joules);
  return wav;
}

function joulesToEv(joules) {
  let ev;
  ev = joules / elementaryCharge;
  return ev;
}

const unitConverters = {
  'input-cm-1': {
    toJoules: wavenumberToJoules,
    fromJoules: joulesToWavenumber
  },
  'input-nm': {
    toJoules: nmToJoules,
    fromJoules: joulesToNm
  },
  'input-hz': {
    toJoules: freqToJoules,
    fromJoules: joulesToFreq
  },
  'input-j': {
    toJoules: (val) => parseFloat(val),
    fromJoules: (joules) => joules
  },
  'input-ev': {
    toJoules: evToJoules,
    fromJoules: joulesToEv
  }
}

function updateValues(sourceID, value) {

  let numValue = parseFloat(value);
  if (isNaN(numValue)) return;

  console.log("Triggered by:", sourceID, "Value:", value);
  let joules = unitConverters[sourceID].toJoules(numValue);

  Object.keys(unitConverters).forEach(key => {
    if (key == sourceID) return;
    let newValue = unitConverters[key].fromJoules(joules).toExponential(4);
    let existingValue = parseFloat(document.getElementById(key).value);
    let threshold = 1e-22;

    if (isNaN(existingValue) || Math.abs(existingValue - newValue) > threshold) {
      document.getElementById(key).value = newValue;
    }
  })

}
