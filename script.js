RoomNombreCasesWidth = 200;
RoomNombreCasesHeight = 100;

var snake_LargeurEnCase = 8;
var speed = 0.05;
var acceleration = 2;
var startingDirection = "right";

class Boule {
  constructor(posX, posY, div) {
    this.posX = posX;
    this.posY = posY;
    this.lastX = posX;
    this.lastY = posY;
    this.div = div;
  }
}
class Snake {
  constructor() {
    this.corps = [];
    this.direction = startingDirection;
    this.largeurEnCases = snake_LargeurEnCase;
    this.addBoule(5, 0, 0);
    this.direction = startingDirection;
  }
  head() {
    return this.corps[0];
  }
  addBoule(nombre, x, y) {
    for (let i = 0; i < nombre; i++) {
      var bouleDiv = document.createElement("div");
      bouleDiv.style.backgroundColor = "blue";
      bouleDiv.style.width = snake_LargeurEnCase * room.caseWidth + "px";
      bouleDiv.style.height = bouleDiv.style.width;
      // bouleDiv.style.border = "solid 1px black";
      bouleDiv.style.borderRadius = "50%";
      bouleDiv.style.position = "absolute";
      let newBoule = new Boule(x, y, bouleDiv);
      this.corps.push(newBoule);
      room.spawnItem(newBoule);
    }
  }
  cutSnake(index) {
    if (index > this.corps.length - 1) return;
    this.corps = this.corps.slice(index);
  }
  collide(element) {}
  go_forward(speed) {
    /** CALCULER POSITIONS **************/
    //sauvegarder la position actuelle de la tête dans lastX et lastY pour la donner à la boule suivante
    this.head().lastX = this.head().posX;
    this.head().lastY = this.head().posY;
    switch (this.direction) {
      case "right":
        this.head().posX += acceleration;

        break;
      case "left":
        this.head().posX -= acceleration;
        break;
      case "down":
        this.head().posY += acceleration;
        break;
      case "up":
        this.head().posY -= acceleration;
        break;
    }

    for (let i = 1; i < this.corps.length; i++) {
      var boule = this.corps[i];
      var boule_precedente = this.corps[i - 1];
      //sauvegarder la position actuelle de chaque boule du corps pour la donner à chaque boule suivante
      boule.lastX = boule.posX;
      boule.lastY = boule.posY;
      boule.posX = boule_precedente.lastX;
      boule.posY = boule_precedente.lastY;
    }
    /** CHANGER VISUELLEMENT LES POSITIONS **************/

    //update all positions
    for (var i = 0; i < this.corps.length; i++) {
      room.updatePosition(this.corps[i], speed);
    }
  }

  colide(item) {
    var coliding = false;
    var coliding_horizontal = false;
    var coliding_vertical = false;

    if (this.head().posX + this.largeurEnCases > item.posX) {
      //div1.cotedroite > div2.cotegauche

      if (this.head().posX < item.posX + item.largeurEnCases) {
        //div1.cotegauche < div2.cotedroite
        coliding_horizontal = true;
      }
    }

    if (this.head().posY + this.largeurEnCases > item.posY) {
      //div1.cotebas > div2.cotehaut

      if (this.head().posY < item.posY + item.largeurEnCases) {
        //div1.cotehaut < div2.cotebas
        coliding_vertical = true;
      }
    }

    if (coliding_horizontal && coliding_vertical) {
      coliding = true;
    }

    return coliding;
  }
}
class Room {
  constructor(nombreCasesWidth, nombreCasesHeight, div) {
    this.nombreCasesWidth = nombreCasesWidth;
    this.nombreCasesHeight = nombreCasesHeight;
    this.currentItemList = [];
    this.div = div;
    this.caseWidth = this.div.offsetWidth / this.nombreCasesWidth;
    console.log(this.caseWidth);
  }
  setDivHeight() {
    //Fait apparaître le terrain
    this.div.style.height = this.caseWidth * this.nombreCasesHeight + "px";
  }
  spawnItem(item) {
    //Fait apparaître une div
    this.div.appendChild(item.div);
    this.updatePosition(item, 0);
  }

  updatePosition(element, animationTime) {
    //if (element.isOutOfBounds){animationTime = 0}2
    element.div.style.transition = "all " + animationTime + "s linear";
    element.div.style.transform =
      "translate(" +
      room.caseWidth * element.posX +
      "px," +
      room.caseWidth * element.posY +
      "px)";
  }
}
class Item {
  constructor(posX, posY, largeurEnCases, type, div) {
    this.posX = posX;
    this.posY = posY;
    this.largeurEnCases = largeurEnCases;
    this.type = type;
    this.div = div;

    this.div.style.width = largeurEnCases * room.caseWidth + "px";
    this.div.style.height = this.div.style.width;
  }
  deleteSelf() {
    this.div.parentNode.removeChild(this.div);
  }
}

const roomContainer = document.getElementById("roomContainer");
var room = new Room(RoomNombreCasesWidth, RoomNombreCasesHeight, roomContainer);
room.setDivHeight();
var snake = new Snake();
snake.head().div.style.backgroundColor = "red";
snake.head().div.style.zIndex = "1";

var pommediv = document.createElement("div");
//3cases
pommediv.style.backgroundColor = "green";
var pomme = new Item(50, 10, 15, "pomme", pommediv);

room.spawnItem(pomme);

setInterval(() => {
  snake.go_forward(speed);
  if (snake.colide(pomme)) {
    pomme.div.style.opacity = "0.5";
  } else {
    pomme.div.style.opacity = "1";
  }
}, speed * 1000);

document.body.addEventListener("keydown", keyboard_press);

function keyboard_press() {
  switch (event.key) {
    case "ArrowDown":
      snake.direction = "down";
      break;
    case "ArrowUp":
      snake.direction = "up";
      break;
    case "ArrowLeft":
      snake.direction = "left";
      break;
    case "ArrowRight":
      snake.direction = "right";
      return;
  }

  event.preventDefault();
}
