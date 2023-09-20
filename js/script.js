const form = document.forms.main;
const encryptBtn = form.encryption;
const dencryptBtn = form.dencryption;
const option = form.option;
const copyBtn = form.copy;

copyBtn.addEventListener("click", ()=>{
  let text = form.result.innerHTML;
  console.log(text);
  copyTextToClipboard(text);
})

encryptBtn.addEventListener("click", ()=>{
  let text = form.text.value;
  let key = form.key.value;
  if(checkInput(text, key)){
    let output;
    if(option.value == "regular"){
      output = columnarTranspositionCipher(text, key);
    }
    else{
      output = advancedTranspositionCipher(text, key);
    }
    showResult(output);
  }
})

dencryptBtn.addEventListener("click", ()=>{
  let text = form.text.value;
  let key = form.key.value;
  if(checkInput(text, key)){
    let output 
    if(option.value == "regular"){
      output = columnarTranspositionDecipher(text, key);
    }
    else{
      output = advancedTranspositionDecipher(text, key);
    }
    showResult(output);
  }
})

function checkInput(text, key){
  let isCorrect = true;
  if(text == "" || text == " "){
    form.text.classList.add("input-mistake");
    form.text.classList.remove("input-success");
    isCorrect = false;
  }
  else{
    form.text.classList.add("input-success");
    form.text.classList.remove("input-mistake")
  }
  if(key == "" || key == " "){
    form.key.classList.add("input-mistake");
    form.key.classList.remove("input-success")
    isCorrect = false;
  }
  else{
    form.key.classList.add("input-success");
    form.key.classList.remove("input-mistake")
  }
  return isCorrect;
}

function showResult(result){
  let textArea = form.result;
  textArea.innerText = result;
}

function showTable(message, key) {
  var x = key.length;
  var y = message.length / x;
  var table = document.getElementById("myTable");
  table.innerHTML = '';
  var i, j, row, cell;
  for (i = 0; i < y; i++) {
    row = table.insertRow(i);
    for (j = 0; j < x; j++) {
      cell = row.insertCell(j);
      cell.innerHTML = message.charAt(i * x + j);
    }
  }
  var header = table.createTHead();
  var row = header.insertRow(0);
  for(i = 0; i < x; i++){
    cell = row.insertCell(i);
    cell.innerHTML = key.charAt(i);
  }
}

function advancedTranspositionCipher(text, key){
  // Add padding if necessary
  id = 0;
  while (text.length % key.length !== 0) {
    text += key[id];
    id++;
  }
  result = columnarTranspositionCipher(text, key);
  return columnarTranspositionCipher(result, key);
}

function advancedTranspositionDecipher(text, key){
  // Add padding if necessary
  id = 0;
  while (text.length % key.length !== 0) {
    text += key[id];
    id++;
  }
  result = columnarTranspositionDecipher(text, key);
  return columnarTranspositionDecipher(result, key);
}

function columnarTranspositionCipher(text, key) {
  let columns = Array(key.length).fill("");
  let sortedKey = Array.from(key).sort().join("");

  for (let i = 0; i < text.length; i++) {
      columns[i % key.length] += text[i];
  }

  let ciphertext = "";
  for (let char of sortedKey) {
      let index = key.indexOf(char);
      ciphertext += columns[index];
      key = key.replace(char, " ");  // Ensure each character in the key is used only once
  }

  return ciphertext;
}

function columnarTranspositionDecipher(ciphertext, key) {
  let sortedKey = Array.from(key).sort().join("");
  let segmentLength = Math.ceil(ciphertext.length / key.length);
  let totalSegments = key.length - (segmentLength * key.length - ciphertext.length);
  let segments = Array(key.length).fill("");

  let index = 0;
  for (let char of sortedKey) {
      let originalIndex = key.indexOf(char);
      let length = originalIndex < totalSegments ? segmentLength : segmentLength - 1;
      segments[originalIndex] = ciphertext.substr(index, length);
      index += length;
      key = key.replace(char, " ");  // Ensure each character in the key is used only once
  }

  let plaintext = "";
  for (let i = 0; i < segmentLength; i++) {
      for (let segment of segments) {
          if (segment[i] !== undefined) {
              plaintext += segment[i];
          }
      }
  }

  return plaintext;
}

async function copyTextToClipboard(text) {
  try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
  } catch (err) {
      console.error('Error in copying text: ', err);
  }
}