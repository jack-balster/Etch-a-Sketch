const canvasContainer = document.querySelector('.canvas-container');
const slider = document.querySelector('#grid-slider');
const gridSizeLabel = document.querySelector('.grid-size-label');
const shakeButton = document.querySelector('#shake-button');
const appContainer = document.querySelector('.app-container');
const colorSelector = document.querySelector('#color-selector');
const modeSelector = document.querySelector('#mode-selector');
const colorControl = document.querySelector('#color-control');

//Grid ratio - wanted to use a wide format like real etchsketch
const gridRatio = 2; 

let mouseDown = false
window.onmousedown = () => mouseDown = true;
window.onmouseup = () => mouseDown = false;

let colorChoice = "Classic";
colorSelector.textContent = colorChoice;
colorSelector.addEventListener('click',setColor);

const colorPicker = document.createElement('input');
colorPicker.setAttribute('type','color','class','picker');
colorPicker.addEventListener('input',pickColor);

let pickedColor = "#000"

function pickColor(e){
  console.log(e.target.value);
  pickedColor = e.target.value;
}

function setColor () {
  if (colorChoice === "Classic") {
  colorChoice = "Rainbow";
  } else if (colorChoice === "Rainbow") {
  colorChoice = "Grey";
  } else if (colorChoice === "Grey") {
    colorChoice = "Retro";
  } else if (colorChoice === "Retro") {
    colorChoice = "Picker";
    colorControl.appendChild(colorPicker);
  } else if (colorChoice === "Picker") {
    colorChoice = "Classic";
    colorControl.removeChild(colorPicker);
  };
  colorSelector.textContent = colorChoice;
};

let drawMode = "Draw";
modeSelector.textContent = drawMode;
modeSelector.addEventListener('click',setMode);

function setMode () {
  if (drawMode === "Draw") {
    drawMode = "Erase";
  } else {
    drawMode = "Draw";
  };
  modeSelector.textContent = drawMode;
};

let currentSize = 12;
//Input default canvas settings
defaultCanvas(currentSize,5,50);//starting rows, min rows , max rows

//Setup default canvas
function defaultCanvas(size,min,max) {
  changeGridSize(size);
  slider.setAttribute('value',size);
  slider.setAttribute('min',min);
  slider.setAttribute('max',max);
  gridSizeLabel.textContent = `Grid size: ${size} x ${size * gridRatio}`; 
};

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function sliderInput() {
  gridSizeLabel.textContent = `Grid size: ${this.value} x ${this.value * gridRatio}`;
  currentSize = this.value;
  changeGridSize(this.value);
};

function changeGridSize(gridSize) {
  setupNewCanvas(gridSize);
  addSquares(gridSize);
};

//Clear the canvas and then add CSS grid properties to the canvas element
function setupNewCanvas(gridSize) {
  canvasContainer.innerHTML = '';
  canvasContainer.style.gridTemplateColumns = `repeat(${gridSize * gridRatio}, 1fr)`;
  canvasContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
};

//Add the correct amount of divs to the grid
function addSquares(gridSize) {
  for (let i = 1; i <= gridSize * (gridSize * gridRatio); i++) {
  const gridSquare = document.createElement('div');
  gridSquare.classList.add('grid-square');
  gridSquare.id = `Sq${i}`;
  gridSquare.addEventListener('mousedown', setBg);
  gridSquare.addEventListener('mouseover', mousetrail);
  canvasContainer.appendChild(gridSquare);
  };  
};

shakeButton.addEventListener('click',shakeCanvas);

//adds a class containing an animation
function shakeCanvas() {
  const squares = document.querySelectorAll('.grid-square');
  squares.forEach(square => square.style.backgroundColor = "");
  appContainer.classList.add('canvas-shake');
  //when the animation is finished, remove the class so it's ready to run again
  appContainer.addEventListener('animationend',() => appContainer.classList.remove('canvas-shake'));
};

function mousetrail(e) {
 if (mouseDown === true) {
  setBg(e);
 }
 e.target.classList.add('hover');
 e.target.addEventListener('transitionend',() => e.target.classList.remove('hover'));
};

//Change the background color of the squares
function setBg(e){
  if (drawMode === "Draw") {
    if(colorChoice === "Classic") {
      e.target.style.backgroundColor = "rgb(60, 60, 60)";
    } else if (colorChoice === "Rainbow"){
      //This line generates a random HEX value
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      e.target.style.backgroundColor = "#" + randomColor;
    } else if (colorChoice === "Grey"){
      tintBg(e);
    } else if (colorChoice === "Retro"){
      colorSwatches(e);
    } else if (colorChoice === "Picker"){
      e.target.style.backgroundColor = pickedColor;
  };
  //If drawMode is not 'draw', assume it's 'erase' and remove the background color
  } else {
    e.target.style.backgroundColor = "";
  };
};


//this variable references the array index of the color we want to use
let colorSelection = 0;

function colorSwatches(e) {
  const colors = ["#3F8A8C", "#0C5679", "#0B0835",	"#E5340B","#F28A0F", "#FFE7BD"];
  if(colorSelection > colors.length - 1){colorSelection = 0}; 
  e.target.style.backgroundColor = colors[colorSelection];
  colorSelection++;
}

//This function is used for the 'Grey' draw mode
function tintBg(e) {
  //If there's no rgb color on the square, set it to the lightest tint
  if(e.target.style.backgroundColor === "") {
    e.target.style.backgroundColor = "rgb(180, 180, 180)";

  //Otherwise, get the RGB value of the current bg color and map it to an array
  } else {
    const currnetColor = e.target.style.backgroundColor;
    const currentArray = currnetColor.match(/\d+/g).map(Number);

    //If the color is already the darkest grey, stop tinting
    if (currnetColor === "rgb(60, 60, 60)") {
      return

    //Otherwise, if the color is grey, make it darker
    } else if (currentArray[0] === currentArray[1] && currentArray[0] === currentArray[2]) {
      const newValue = currentArray[0] - 40;
      e.target.style.backgroundColor = `rgb(${newValue}, ${newValue}, ${newValue})`

    //If it's a color other than grey, also set it to the lightest tint
    } else {
      e.target.style.backgroundColor = "rgb(180, 180, 180)";
    };
  };
};