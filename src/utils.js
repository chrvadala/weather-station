function lowerFirst(string) {
  return string.startsWith('UUID') ? string :
    string.charAt(0).toLowerCase() + string.slice(1);
}

function upperFirst(string) {
  return string.startsWith('UUID') ? string :
    string.charAt(0).toUpperCase() + string.slice(1);
}

function buildIndex(array, hash){
  const o = {}
  for (const item of array){
    o[hash(item)] = item
  }
  return o
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  lowerFirst,
  upperFirst,
  buildIndex,
  pause
}
