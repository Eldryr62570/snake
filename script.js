RoomNombreCasesWidth = 300;
RoomNombreCasesHeight = 130;
var score = 0;
var spawnAppleTime = 1000;
var spawnClockTime = 10000;
var spawnStarTime = 7000;
var spawnSniperTime = 8000;

var gameIsRunning = true;
var godmode = false;

var snake_LargeurEnCase = 10;
var startingSpeed = 0.1;
var speedPlus = 0.95;
var startingAcceleration = 5;

var speed = startingSpeed;
var oldSpeed = startingSpeed;
var oldAcceleration = startingAcceleration;
var acceleration = startingAcceleration; //min 3 max 7 pour les bons espacements
var startingDirection = "right";

class Boule {
  constructor(posX, posY, div) {
    this.posX = posX;
    this.posY = posY;
    this.lastX = posX;
    this.lastY = posY;
    this.div = div;
    this.lastCorner = "nocorner";
    this.largeurEnCases = snake_LargeurEnCase;
  }
  direction() {
    var direction = "";
    if (this.posX > this.lastX) {
      direction = "right";
    }
    if (this.posX < this.lastX) {
      direction = "left";
    }
    if (this.posY > this.lastY) {
      direction = "down";
    }
    if (this.posY < this.lastY) {
      direction = "top";
    }
    return direction;
  }

  directionAxe() {
    var direction = "";
    if (this.direction() == "left" || this.direction() == "right") {
      direction = "horizontal";
    }
    if (this.direction() == "top" || this.direction() == "down") {
      direction = "vertical";
    }

    //lancement
    if (direction == "") {
      if (snake.direction == "left" || snake.direction == "right") {
        direction = "horizontal";
      }
      if (snake.direction == "top" || snake.direction == "down") {
        direction = "vertical";
      }
    }

    return direction;
  }

  corner_arrondi(bouleId) {
    var i = bouleId;
    var cornerArrondi = "nocorner";

    var boule = snake.corps[i];
    var posX = boule.posX;
    var posY = boule.posY;
    var boule_devant = snake.corps[i - 1];
    var boule_derriere = snake.corps[i + 1];

    //queue
    if (i == snake.corps.length - 1) {
      if (boule_devant.posX > posX) {
        boule.div.style.borderTopLeftRadius = "50%";
        boule.div.style.borderBottomLeftRadius = "50%";
      }
      if (boule_devant.posX < posX) {
        boule.div.style.borderTopRightRadius = "50%";
        boule.div.style.borderBottomRightRadius = "50%";
      }
      if (boule_devant.posY > posY) {
        boule.div.style.borderTopLeftRadius = "50%";
        boule.div.style.borderTopRightRadius = "50%";
      }
      if (boule_devant.posY < posY) {
        boule.div.style.borderBottomLeftRadius = "50%";
        boule.div.style.borderBottomRightRadius = "50%";
      }
    } else {
      //reste du corps
      if (i > 0) {
        //bottomright
        if (boule_derriere.posY < posY && boule_devant.posX < posX) {
          cornerArrondi = "bottomright";
        }
        if (boule_devant.posY < posY && boule_derriere.posX < posX) {
          cornerArrondi = "bottomright";
        }
        //topright
        if (boule_derriere.posY > posY && boule_devant.posX < posX) {
          cornerArrondi = "topright";
        }
        if (boule_devant.posY > posY && boule_derriere.posX < posX) {
          cornerArrondi = "topright";
        }
        //bottomleft
        if (boule_derriere.posY < posY && boule_devant.posX > posX) {
          cornerArrondi = "bottomleft";
        }
        if (boule_devant.posY < posY && boule_derriere.posX > posX) {
          cornerArrondi = "bottomleft";
        }
        //topleft
        if (boule_derriere.posY > posY && boule_devant.posX > posX) {
          cornerArrondi = "topleft";
        }
        if (boule_devant.posY > posY && boule_derriere.posX > posX) {
          cornerArrondi = "topleft";
        }
      }
    }

    //premiere boule apres la tete
    if (i == 1) {
      if (boule_devant.posX > posX) {
        boule.div.style.borderTopRightRadius = "25%";
        boule.div.style.borderBottomRightRadius = "25%";
      }
      if (boule_devant.posX < posX) {
        boule.div.style.borderTopLeftRadius = "25%";
        boule.div.style.borderBottomLeftRadius = "25%";
      }
      if (boule_devant.posY > posY) {
        boule.div.style.borderBottomLeftRadius = "25%";
        boule.div.style.borderBottomRightRadius = "25%";
      }
      if (boule_devant.posY < posY) {
        boule.div.style.borderTopLeftRadius = "25%";
        boule.div.style.borderTopRightRadius = "25%";
      }
    }

    return cornerArrondi;
  }
  arrondirCornerOfDiv(div, cornerValue) {
    div.style.borderTopRightRadius = "0%";
    div.style.borderTopLeftRadius = "0%";
    div.style.borderBottomRightRadius = "0%";
    div.style.borderBottomLeftRadius = "0%";

    switch (cornerValue) {
      case "topright":
        div.style.borderTopRightRadius = "50%";
        break;
      case "topleft":
        div.style.borderTopLeftRadius = "50%";
        break;
      case "bottomright":
        div.style.borderBottomRightRadius = "50%";
        break;
      case "bottomleft":
        div.style.borderBottomLeftRadius = "50%";
        break;
    }
  }

  setCircleInCorner(cornerValue, goToBoule) {
    var divRonde = document.createElement("div");
    divRonde.style.top = "0px";
    divRonde.style.position = "absolute";
    divRonde.style.width = this.div.style.width;
    divRonde.style.height = this.div.style.height;
    divRonde.style.backgroundColor = this.div.style.backgroundColor;
    room.div.appendChild(divRonde);
    divRonde.style.transform =
      "translate(" +
      room.caseWidth * this.lastX +
      "px," +
      room.caseWidth * this.lastY +
      "px)";
    if (goToBoule) {
      switch (snake.corps[snake.corps.length - 2].direction()) {
        case "right":
          divRonde.style.borderTopLeftRadius = "50%";
          divRonde.style.borderBottomLeftRadius = "50%";
          break;
        case "left":
          divRonde.style.borderTopRightRadius = "50%";
          divRonde.style.borderBottomRightRadius = "50%";
          break;
        case "down":
          divRonde.style.borderTopLeftRadius = "50%";
          divRonde.style.borderTopRightRadius = "50%";
          break;
        case "top":
          divRonde.style.borderBottomLeftRadius = "50%";
          divRonde.style.borderBottomRightRadius = "50%";
          break;
      }
    } else {
      this.arrondirCornerOfDiv(divRonde, cornerValue);
    }
    setTimeout(function () {
      divRonde.parentNode.removeChild(divRonde);
    }, speed * 1000);
  }

  isOutOfMap() {
    var boule = this;
    if (boule.posX >= RoomNombreCasesWidth + snake_LargeurEnCase) {
      return true;
    }
    if (boule.posY >= RoomNombreCasesHeight + snake_LargeurEnCase) {
      return true;
    }
    if (boule.posX <= -snake_LargeurEnCase) {
      return true;
    }
    if (boule.posY <= -snake_LargeurEnCase) {
      return true;
    }
  }

  //TouchesMapBorders: detect out of map avant d'être totalement dehors
  touchesMapBorders() {
    var boule = this;
    if (boule.posX >= RoomNombreCasesWidth) {
      return true;
    }
    if (boule.posY >= RoomNombreCasesHeight) {
      return true;
    }
    if (boule.posX <= 0) {
      return true;
    }
    if (boule.posY <= 0) {
      return true;
    }
  }
}
class Snake {
  constructor() {
    this.corps = [];
    this.direction = startingDirection;
    this.largeurEnCases = snake_LargeurEnCase;
    this.addBoule(2, 0, 0);
    this.direction = startingDirection;
  }
  head() {
    return this.corps[0];
  }
  addBoule(nombre, x, y) {
    for (let i = 0; i < nombre; i++) {
      var bouleDiv = document.createElement("div");
      bouleDiv.style.backgroundColor = "#008F7A";
      bouleDiv.style.width = snake_LargeurEnCase * room.caseWidth + "px";
      bouleDiv.style.height = bouleDiv.style.width;
      // bouleDiv.style.border = "solid 1px black";
      bouleDiv.style.position = "absolute";
      let newBoule = new Boule(x, y, bouleDiv);
      this.corps.push(newBoule);
      room.spawnItem(newBoule);
    }
  }
  cutSnake(index) {
    if (index < this.corps.length) {
      var taille_corps_initiale = this.corps.length;
      for (let i = index; i < taille_corps_initiale; i++) {
        var boule = this.corps[index];
        boule.div.parentNode.removeChild(boule.div);
        this.corps.splice(index, 1);
      }
    }
  }
  go_forward(speed) {
    snake.head().div.style.backgroundImage =
      "url(./asset/img/snakeHead" + snake.direction + ".png)";
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

      boule.arrondirCornerOfDiv(boule.div, boule.corner_arrondi(i));
    }

    /** CHANGER VISUELLEMENT **************/

    //update all positions
    for (var i = 0; i < this.corps.length; i++) {
      //teleportation
      var tp = false;
      if (boule.posX > RoomNombreCasesWidth + snake_LargeurEnCase) {
        boule.posX = -snake_LargeurEnCase;
        boule.lastX = boule.posX;
        tp = true;
      }
      if (boule.posY > RoomNombreCasesHeight + snake_LargeurEnCase) {
        boule.posY = -snake_LargeurEnCase;
        boule.lastY = boule.posY;
        tp = true;
      }
      if (boule.posX < -snake_LargeurEnCase) {
        boule.posX = RoomNombreCasesWidth + snake_LargeurEnCase;
        boule.lastX = boule.posX;
        tp = true;
      }
      if (boule.posY < -snake_LargeurEnCase) {
        boule.posY = RoomNombreCasesHeight + snake_LargeurEnCase;
        boule.lastY = boule.posY;
        tp = true;
      }
      if (tp) {
        boule.div.style.transition = "all 0s linear";
        boule.div.style.transform =
          "translate(" +
          room.caseWidth * boule.posX +
          "px," +
          room.caseWidth * boule.posY +
          "px)";
      }

      var boule = this.corps[i];
      room.updatePosition(boule, speed);

      //radius
      var goToBoule = false;
      if (i == this.corps.length - 2) {
        goToBoule = true;
      }
      if (boule.lastCorner != "nocorner") {
        boule.setCircleInCorner(boule.lastCorner, goToBoule);
        boule.arrondirCornerOfDiv(boule.div, boule.corner_arrondi(i));
      }

      //sauvegarder corner pour ajouter la boule d'angle
      boule.lastCorner = boule.corner_arrondi(i);
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
  checkCollisionWithBody() {
    for (var i = 1; i < this.corps.length; i++) {
      var collision = false;
      var boule = this.corps[i];
      switch (snake.direction) {
        case "right":
          if (boule.directionAxe() == "vertical") {
            if (boule.posX > snake.head().lastX) {
              collision = true;
            }
          }
          if (boule.direction() == "left") {
            collision = true;
          }
          break;
        case "left":
          if (boule.directionAxe() == "vertical") {
            if (boule.posX < snake.head().lastX) {
              collision = true;
            }
          }
          if (boule.direction() == "right") {
            collision = true;
          }
          break;
        case "up":
          if (boule.directionAxe() == "horizontal") {
            if (boule.posY < snake.head().lastY) {
              collision = true;
            }
          }
          if (boule.direction() == "down") {
            collision = true;
          }
          break;
        case "down":
          if (boule.directionAxe() == "horizontal") {
            if (boule.posY > snake.head().lastY) {
              collision = true;
            }
          }
          if (boule.direction() == "top") {
            collision = true;
          }
          break;
      }
      if (
        i == snake.corps.length - 1 &&
        this.colide(boule) &&
        snake.corps.length > 3
      ) {
        collision = true;
      }
      if (snake.head().isOutOfMap() || boule.isOutOfMap()) {
        collision = false;
      }

      if (this.colide(boule) && collision && !godmode) {
        gameOver();
      }
    }
  }
  checkCollisionWithItems() {
    for (var i = 0; i < room.currentItemList.length; i++) {
      var item = room.currentItemList[i];
      if (this.colide(item)) {
        item.deleteSelf(true);
        room.currentItemList.splice(i, 1);

        switch (item.type) {
          case "pomme":
            var snakeQueue = snake.corps[snake.corps.length - 1];
            snake.addBoule(1, snakeQueue.posX, snakeQueue.posY);
            room.addScore(50);

            if (acceleration < 5) {
              acceleration += 0.05;
            }
            speed = speed * 0.95;
            if (speed < 0.029198902433877242) {
              speedPlus = 0.999;
            } else {
              speedPlus = 0.95;
            }
            clearInterval(miaKhalifa);
            miaKhalifa = setInterval(() => {
              boucle();
            }, speed * 1000);
            break;
          case "clock":
            room.addScore(25);
            if (!godmode) {
              speed *= 1.5;
              clearInterval(miaKhalifa);
              miaKhalifa = setInterval(() => {
                boucle();
              }, speed * 1000);
            }
            break;
          case "star":
            room.addScore(100);
            snake.enterGodMode();
            clearInterval(miaKhalifa);
            miaKhalifa = setInterval(function () {
              boucle();
            }, speed * 1000);
            break;
          case "sniper":
            room.addScore(1000);
            clearInterval(miaKhalifa);
            gameIsRunning = false;
            snake.snipeItself();
            break;
        }
      }
    }
  }

  goToRandomPlace() {
    //spawn dans une area au milieu qui fait la moitié de la map
    var randomX =
      room.nombreCasesWidth / 4 +
      Math.floor((Math.random() * room.nombreCasesWidth) / 2);
    var randomY =
      room.nombreCasesHeight / 4 +
      Math.floor((Math.random() * room.nombreCasesHeight) / 2);
    for (var i = 0; i < this.corps.length; i++) {
      var boule = this.corps[i];
      boule.posX = randomX;
      boule.lastX = randomX;
      boule.posY = randomY;
      boule.lastY = randomY;
      boule.div.style.transition = "all 0s";
      boule.div.style.transform =
        "translate(" +
        room.caseWidth * boule.posX +
        "px," +
        room.caseWidth * boule.posY +
        "px)";
    }
    var direction = parseInt(Math.random() * 4, 4);
    switch (direction) {
      case 0:
        this.direction = "right";
        break;
      case 1:
        this.direction = "left";
        break;
      case 2:
        this.direction = "up";
        break;
      case 3:
        this.direction = "down";
        break;
    }
  }

  enterGodMode() {
    if (godmode == false) {
      oldSpeed = speed;
      oldAcceleration = acceleration;
    }
    speed = 0.02;
    acceleration = 7;
    var snakeThis = this;
    if (!godmode) {
      //Clignoter
      var fullRainbow = setInterval(function () {
        for (var i = 0; i < snakeThis.corps.length; i++) {
          var randomVal = Math.random() * 350;
          if (!gameIsRunning) {
            randomVal = 0;
          }
          snakeThis.corps[i].div.style.filter =
            "hue-rotate(" + randomVal + "deg)";
        }
      }, 100);

      //Clignoter lentement
      setTimeout(function () {
        clearInterval(fullRainbow);
        speed = oldSpeed;
        acceleration = oldAcceleration;
        clearInterval(miaKhalifa);
        miaKhalifa = setInterval(() => {
          boucle();
        }, speed * 1000);
        fullRainbow = setInterval(function () {
          for (var i = 0; i < snakeThis.corps.length; i++) {
            var randomVal = Math.random() * 75;
            if (!gameIsRunning) {
              randomVal = 0;
            }
            snakeThis.corps[i].div.style.filter =
              "hue-rotate(" + randomVal + "deg)";
          }
        }, 500);
      }, 5000);

      setTimeout(function () {
        godmode = false;
        clearInterval(fullRainbow);
        clearInterval(miaKhalifa);
        miaKhalifa = setInterval(() => {
          boucle();
        }, speed * 1000);
        for (var i = 0; i < snakeThis.corps.length; i++) {
          snakeThis.corps[i].div.style.filter = "hue-rotate(0deg)";
        }
      }, 7000);
    }
    godmode = true;
  }

  snipeItself() {
    var snakeThis = this;

    var lol = this.corps.length / 2 - 1;
    var mdr = parseInt(Math.random() * lol, lol);
    var RandomCutIndex = this.corps.length - 1 - mdr;
    if (RandomCutIndex >= this.corps.length - 1) {
      RandomCutIndex = this.corps.length - 2;
    }
    if (RandomCutIndex <= 3) {
      RandomCutIndex = 4;
    }

    var scope = document.createElement("div");
    scope.style.width = "200px";
    scope.style.height = scope.style.width;
    scope.style.backgroundImage = "url(./asset/img/scope.png)";
    scope.style.backgroundSize = "contain";
    scope.style.backgroundRepeat = "no-repeat";
    scope.style.transform = "translate(-200px, -200px)";
    scope.style.position = "absolute";
    scope.style.transition = "all 2s";

    room.div.appendChild(scope);

    setTimeout(function () {
      scope.style.transform =
        "translate(" +
        (-100 +
          (snake_LargeurEnCase / 2) * room.caseWidth +
          snakeThis.corps[RandomCutIndex + 1].posX * room.caseWidth) +
        "px, " +
        (-100 +
          (snake_LargeurEnCase / 2) * room.caseWidth +
          snakeThis.corps[RandomCutIndex + 1].posY * room.caseWidth) +
        "px)";
    }, 200);
    setTimeout(function () {
      snakeThis.cutSnake(RandomCutIndex);
    }, 2500);
    setTimeout(function () {
      room.div.removeChild(scope);
      clearInterval(miaKhalifa);
      miaKhalifa = setInterval(() => {
        boucle();
      }, speed * 1000);
      gameIsRunning = true;
    }, 3000);
  }
}
class Room {
  constructor(nombreCasesWidth, nombreCasesHeight, div) {
    this.nombreCasesWidth = nombreCasesWidth;
    this.nombreCasesHeight = nombreCasesHeight;
    this.currentItemList = [];
    this.div = div;
    this.caseWidth = this.div.offsetWidth / this.nombreCasesWidth;
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
  addScore(value) {
    score += value;
    scoreDiv.innerHTML = "Score : " + score;
  }
  updatePosition(element, animationTime) {
    if (element.isOutOfMap()) {
      animationTime = 0;
    }
    element.div.style.transition = "all " + animationTime + "s linear";
    element.div.style.transform =
      "translate(" +
      room.caseWidth * element.posX +
      "px," +
      room.caseWidth * element.posY +
      "px)";
  }
}
let scoreDiv = document.getElementById("score");
class Item {
  constructor(posX, posY, largeurEnCases, type, div) {
    this.posX = posX;
    this.posY = posY;
    this.largeurEnCases = largeurEnCases;
    this.type = type;
    this.div = div;

    this.div.style.width = largeurEnCases * room.caseWidth + "px";
    this.div.style.position = "absolute";
    this.div.style.height = this.div.style.width;
    this.div.style.backgroundSize = "contain";
    this.div.style.backgroundRepeat = "no-repeat";
    this.div.style.backgroundColor = "transparent";

    if (this.type == "pomme") {
      this.div.style.backgroundImage = "url(./asset/img/apple.png)";
    }
    if (this.type == "clock") {
      this.div.style.backgroundImage = "url(./asset/img/horloge.png)";
    }
    if (this.type == "star") {
      this.div.style.backgroundImage = "url(./asset/img/star.png)";
    }
    if (this.type == "sniper") {
      this.div.style.backgroundImage = "url(./asset/img/sniper.png)";
    }
  }
  deleteSelf(delayed) {
    var div = this.div;
    var delay = 0;
    if (delayed) {
      delay = speed * 1000;
    }
    setTimeout(function () {
      div.parentNode.removeChild(div);
    }, delay);
  }
  isOutOfMap() {
    return false;
  }
}
function SpawnItemsRandomly() {
  var rate = 1;

  //POMME
  setInterval(function () {
    var random = Math.floor(Math.random() * 10);
    if (random < rate && gameIsRunning) {
      var pommediv = document.createElement("div");
      randomTaille = 5 + parseInt(Math.random() * 8, 8);
      randomX = Math.random() * (RoomNombreCasesWidth - randomTaille * 2);
      randomY = Math.random() * (RoomNombreCasesHeight - randomTaille * 2);
      // constructor(posX, posY, largeurEnCases, type, div)
      var pomme = new Item(
        randomTaille + randomX,
        randomTaille + randomY,
        randomTaille,
        "pomme",
        pommediv
      );
      room.spawnItem(pomme);
      room.currentItemList.push(pomme);
      rate = 1;
    }
    rate += 1;
    if (rate > 10) {
      rate = 1;
    }
  }, spawnAppleTime * 5 * speed);

  //CLOCK

  setInterval(function () {
    var random = Math.floor(Math.random() * 10);
    if (random < 2 && gameIsRunning) {
      var clockdiv = document.createElement("div");
      randomTaille = 12;
      randomX = Math.random() * (RoomNombreCasesWidth - randomTaille * 2);
      randomY = Math.random() * (RoomNombreCasesHeight - randomTaille * 2);
      // constructor(posX, posY, largeurEnCases, type, div)
      var clock = new Item(
        randomTaille + randomX,
        randomTaille + randomY,
        randomTaille,
        "clock",
        clockdiv
      );
      room.spawnItem(clock);
      room.currentItemList.push(clock);
      rate = 1;
    }
    rate += 1;
    if (rate > 10) {
      rate = 1;
    }
  }, spawnClockTime);

  //STAR

  setInterval(function () {
    var random = Math.floor(Math.random() * 10);
    var RoomContainStar = false;
    for (var i = 0; i < room.currentItemList.length; i++) {
      if (room.currentItemList[i].type == "star") {
        RoomContainStar = true;
      }
    }

    if (random < 1 && gameIsRunning && !RoomContainStar) {
      var clockdiv = document.createElement("div");
      randomTaille = 10;
      randomX = Math.random() * (RoomNombreCasesWidth - randomTaille * 2);
      randomY = Math.random() * (RoomNombreCasesHeight - randomTaille * 2);
      // constructor(posX, posY, largeurEnCases, type, div)
      var clock = new Item(
        randomTaille + randomX,
        randomTaille + randomY,
        randomTaille,
        "star",
        clockdiv
      );
      room.spawnItem(clock);
      room.currentItemList.push(clock);
      rate = 1;
    }
    rate += 1;
    if (rate > 10) {
      rate = 1;
    }
  }, spawnStarTime);

  //SNIPER

  setInterval(function () {
    var random = Math.floor(Math.random() * 10);
    var RoomContainsSniper = false;
    for (var i = 0; i < room.currentItemList.length; i++) {
      if (room.currentItemList[i].type == "sniper") RoomContainsSniper = true;
    }
    if (
      random < 1 &&
      gameIsRunning &&
      snake.corps.length > 4 &&
      !RoomContainsSniper
    ) {
      var clockdiv = document.createElement("div");
      randomTaille = 25;
      randomX = Math.random() * (RoomNombreCasesWidth - randomTaille * 2);
      randomY = Math.random() * (RoomNombreCasesHeight - randomTaille * 2);
      // constructor(posX, posY, largeurEnCases, type, div)
      var clock = new Item(
        randomTaille + randomX,
        randomTaille + randomY,
        randomTaille,
        "sniper",
        clockdiv
      );
      room.spawnItem(clock);
      room.currentItemList.push(clock);
      rate = 1;

      setTimeout(function () {
        clockdiv.style.opacity = "0.2";
        setTimeout(function () {
          for (var i = 0; i < room.currentItemList.length; i++) {
            if (room.currentItemList[i].type == "sniper") {
              var item = room.currentItemList[i];
              item.deleteSelf(true);
              room.currentItemList.splice(i, 1);
            }
          }
        }, 2000);
      }, 3000);
    }
    rate += 1;
    if (rate > 10) {
      rate = 1;
    }
  }, spawnSniperTime);
}

document.body.addEventListener("keydown", keyboard_press);

function keyboard_press() {
  if (!snake.head().touchesMapBorders()) {
    switch (event.key) {
      case "s":
        if (snake.head().directionAxe() == "horizontal")
          snake.direction = "down";
        break;
      case "z":
        if (snake.head().directionAxe() == "horizontal") snake.direction = "up";
        break;
      case "q":
        if (snake.head().directionAxe() == "vertical") snake.direction = "left";
        break;
      case "d":
        if (snake.head().directionAxe() == "vertical")
          snake.direction = "right";
        break;
      case "ArrowDown":
        if (snake.head().directionAxe() == "horizontal")
          snake.direction = "down";
        break;
      case "ArrowUp":
        if (snake.head().directionAxe() == "horizontal") snake.direction = "up";
        break;
      case "ArrowLeft":
        if (snake.head().directionAxe() == "vertical") snake.direction = "left";
        break;
      case "ArrowRight":
        if (snake.head().directionAxe() == "vertical")
          snake.direction = "right";
        break;
      case "r":
        restart_game();
        return;
    }
    event.preventDefault();
  }
}

//runtime

const roomContainer = document.getElementById("roomContainer");
var room = new Room(RoomNombreCasesWidth, RoomNombreCasesHeight, roomContainer);
room.setDivHeight();
var snake = new Snake();
snake.goToRandomPlace();
for (let i = 1; i < snake.corps.length; i++) {
  snake.corps[i].div.style.borderRadius = "50%";
}
snake.head().div.style.backgroundColor = "transparent";
snake.head().div.style.backgroundImage =
  "url(./asset/img/snakeHead" + snake.direction + ".png)";
snake.head().div.style.backgroundSize = "contain";
snake.head().div.style.backgroundRepeat = "no-repeat";
snake.head().div.style.opacity = "1";
snake.head().div.style.borderRadius = "50%";
snake.head().div.style.zIndex = "1";

var miaKhalifa = setInterval(() => {
  boucle();
}, speed * 1000);
SpawnItemsRandomly();

//restart

let btnStart = document.getElementById("buttonStart");
let divCache = document.getElementById("cache");
btnStart.addEventListener("click", () => {
  restart_game();
});
function restart_game() {
  score = 0;
  scoreDiv.innerHTML = "Score : " + score;
  gameover.style.display = "none";
  gameover.style.opacity = 0;
  divCache.style.opacity = "0";
  speed = startingSpeed;
  acceleration = startingAcceleration;
  for (var i = 0; i < room.currentItemList.length; i++) {
    var item = room.currentItemList[i];
    item.deleteSelf(false);
  }
  room.currentItemList = [];

  clearInterval(miaKhalifa);
  snake.cutSnake(2);
  snake.goToRandomPlace();
  clearInterval(miaKhalifa);
  miaKhalifa = setInterval(() => {
    boucle();
  }, speed * 1000);
  gameIsRunning = true;
}

function boucle() {
  snake.go_forward(speed);
  snake.checkCollisionWithBody();
  snake.checkCollisionWithItems();
}
let btnRestart = document.getElementById("buttonRestart");
let gameover = document.getElementById("gameover");
let scoreFinal = document.getElementById("scoreFinal");
btnRestart.addEventListener("click", () => {
  restart_game();
});
function gameOver() {
  clearInterval(miaKhalifa);
  gameIsRunning = false;
  var votrescore = score;
  scoreFinal.innerText = "Score Final : " + votrescore;
  gameover.style.display = "flex";
  gameover.style.opacity = 0;
  setTimeout(function () {
    gameover.style.opacity = 1;
  }, 1000);
}
