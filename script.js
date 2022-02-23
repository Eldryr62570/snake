var nombreDeJoueurs = 2;

RoomNombreCasesWidth = 300;
RoomNombreCasesHeight = 160;
var score = 0;
var spawnAppleTime = 1000;
var spawnClockTime = 10000;
var spawnStarTime = 7000;
var spawnSniperTime = 8000;

var gameIsRunning = false;
var gameHasStarted = false;

var snake_LargeurEnCase = 10;
var startingSpeed = 0.1;
var startingAcceleration = 5;

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

  directionAxe(snakeThis) {
    var direction = "";
    if (this.direction() == "left" || this.direction() == "right") {
      direction = "horizontal";
    }
    if (this.direction() == "top" || this.direction() == "down") {
      direction = "vertical";
    }

    //lancement
    if (direction == "") {
      if (snakeThis.direction == "left" || snakeThis.direction == "right") {
        direction = "horizontal";
      }
      if (snakeThis.direction == "top" || snakeThis.direction == "down") {
        direction = "vertical";
      }
    }

    return direction;
  }

  corner_arrondi(bouleId, snakeThis) {
    var i = bouleId;
    var cornerArrondi = "nocorner";

    var boule = snakeThis.corps[i];
    var posX = boule.posX;
    var posY = boule.posY;
    var boule_devant = snakeThis.corps[i - 1];
    var boule_derriere = snakeThis.corps[i + 1];

    //queue
    if (i == snakeThis.corps.length - 1) {
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

  setCircleInCorner(cornerValue, goToBoule, snakeThis) {
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
      switch (snakeThis.corps[snakeThis.corps.length - 2].direction()) {
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
    }, snakeThis.speed * 1000);
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
  constructor(id) {
    this.id = id;
    this.corps = [];
    this.direction = startingDirection;
    this.largeurEnCases = snake_LargeurEnCase;
    this.addBoule(2, 0, 0);
    this.direction = startingDirection;
    this.speed = startingSpeed;
    this.oldSpeed = startingSpeed;
    this.godmode = false;
    this.acceleration = 4;
    this.oldAcceleration = 4;
    this.speedPlus = 0.95;
  }
  head() {
    return this.corps[0];
  }
  addBoule(nombre, x, y) {
    for (let i = 0; i < nombre; i++) {
      var bouleDiv = document.createElement("div");
      if (this.id==1)bouleDiv.style.backgroundColor = "#008F7A";
      if (this.id==2)bouleDiv.style.backgroundColor = "#a50000";
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
    this.head().div.style.backgroundImage =
      "url(./asset/img/snakeHead" + this.direction + this.id + ".png)";
    /** CALCULER POSITIONS **************/
    //sauvegarder la position actuelle de la tête dans lastX et lastY pour la donner à la boule suivante
    this.head().lastX = this.head().posX;
    this.head().lastY = this.head().posY;
    switch (this.direction) {
      case "right":
        this.head().posX += this.acceleration;

        break;
      case "left":
        this.head().posX -= this.acceleration;
        break;
      case "down":
        this.head().posY += this.acceleration;
        break;
      case "up":
        this.head().posY -= this.acceleration;
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

      boule.arrondirCornerOfDiv(boule.div, boule.corner_arrondi(i, this));
    }

    /** CHANGER VISUELLEMENT **************/

    //update all positions
    for (var i = 0; i < this.corps.length; i++) {
      //teleportation
      var tp = false;
      var tailleOffset = 1;
      if (boule.posX > RoomNombreCasesWidth + snake_LargeurEnCase*tailleOffset) {
        boule.posX = -snake_LargeurEnCase*tailleOffset;
        boule.lastX = boule.posX;
        tp = true;
      }
      if (boule.posY > RoomNombreCasesHeight + snake_LargeurEnCase*tailleOffset) {
        boule.posY = -snake_LargeurEnCase*tailleOffset;
        boule.lastY = boule.posY;
        tp = true;
      }
      if (boule.posX < -snake_LargeurEnCase*tailleOffset) {
        boule.posX = RoomNombreCasesWidth + snake_LargeurEnCase*tailleOffset;
        boule.lastX = boule.posX;
        tp = true;
      }
      if (boule.posY < -snake_LargeurEnCase*tailleOffset) {
        boule.posY = RoomNombreCasesHeight + snake_LargeurEnCase*tailleOffset;
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
        boule.setCircleInCorner(boule.lastCorner, goToBoule, this);
        boule.arrondirCornerOfDiv(boule.div, boule.corner_arrondi(i, this));
      }

      //sauvegarder corner pour ajouter la boule d'angle
      boule.lastCorner = boule.corner_arrondi(i, this);
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
    checkCollision(this, this.corps, this.id);
  }

checkCollisionWithOtherSnake(){
  if (this.id==1){
    checkCollision(this, snake2.corps, snake2.id);
  }
  if (this.id==2){
    checkCollision(this, snake.corps, snake.id);
  }
}

  checkCollisionWithItems() {
    for (var i = 0; i < room.currentItemList.length; i++) {
      var item = room.currentItemList[i];
      var snakeThis = this;
      if (snakeThis.colide(item)) {
        item.deleteSelf(true, snakeThis);
        room.currentItemList.splice(i, 1);

        switch (item.type) {
          case "pomme":
            var snakeQueue = snakeThis.corps[snakeThis.corps.length - 1];
            snakeThis.addBoule(1, snakeQueue.posX, snakeQueue.posY);
            room.addScore(50);

            if (snakeThis.acceleration < 5) {
              snakeThis.acceleration += 0.05;
            }
            this.speed = this.speed * this.speedPlus;
            if (this.speed < 0.029198902433877242) {
              this.speedPlus = 0.99;
            } else {
              this.speedPlus = 0.95;
            }
            snakeThis.restartBoucle();
            break;
          case "clock":
            room.addScore(25);
            if (!this.godmode) {
              this.speed *= 1.5;
              snakeThis.restartBoucle();
            }
            break;
          case "star":
            room.addScore(100);
            snakeThis.enterGodMode();
            snakeThis.restartBoucle();
            break;
          case "sniper":
            room.addScore(1000);
            clearInterval(snake.miaKhalifa);
            if(nombreDeJoueurs>1){clearInterval(snake2.miaKhalifa);}
            gameIsRunning = false;
            snakeThis.snipeItself();
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
    if (this.godmode == false) {
      this.oldSpeed = this.speed;
      this.oldAcceleration = this.acceleration;
    }
    this.speed = 0.02;
    this.acceleration = 7;
    var snakeThis = this;
    if (!this.godmode) {
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
        snakeThis.speed = snakeThis.oldSpeed;
        snakeThis.acceleration = snakeThis.oldAcceleration;
        snakeThis.restartBoucle();
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
        snakeThis.godmode = false;
        clearInterval(fullRainbow);
        snakeThis.restartBoucle();
        for (var i = 0; i < snakeThis.corps.length; i++) {
          snakeThis.corps[i].div.style.filter = "hue-rotate(0deg)";
        }
      }, 7000);
    }
    this.godmode = true;
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
      snake.restartBoucle()
      if(nombreDeJoueurs>1){snake2.restartBoucle();}
      gameIsRunning = true;
    }, 3000);
  }

  restartBoucle(){
    clearInterval(this.miaKhalifa)
    this.miaKhalifa = setInterval(() => {
      boucle(this);
    }, this.speed * 1000);
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
  deleteSelf(delayed, deleter) {
    var div = this.div;
    var delay = 0;
    if (delayed) {
      delay = deleter.speed * 1000;
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
  }, spawnAppleTime * 5 * snake.speed);

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
              item.deleteSelf(true, snake);
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
        if (snake.head().directionAxe(snake) == "horizontal")
          snake.direction = "down";
        break;
      case "z":
        if (snake.head().directionAxe(snake) == "horizontal") snake.direction = "up";
        break;
      case "q":
        if (snake.head().directionAxe(snake) == "vertical") snake.direction = "left";
        break;
      case "d":
        if (snake.head().directionAxe(snake) == "vertical")
          snake.direction = "right";
        break;
      case "r":
        restart_game();
        return;
    }
    event.preventDefault();
  }
  if (nombreDeJoueurs>1){
  if (!snake2.head().touchesMapBorders()){
    switch (event.key){
      case "ArrowDown":
        if (snake2.head().directionAxe(snake2) == "horizontal")
          snake2.direction = "down";
        break;
      case "ArrowUp":
        if (snake2.head().directionAxe(snake2) == "horizontal") snake2.direction = "up";
        break;
      case "ArrowLeft":
        if (snake2.head().directionAxe(snake2) == "vertical") snake2.direction = "left";
        break;
      case "ArrowRight":
        if (snake2.head().directionAxe(snake2) == "vertical")
          snake2.direction = "right";
        break;
    }
  }}
}

//runtime

const roomContainer = document.getElementById("roomContainer");
var room = new Room(RoomNombreCasesWidth, RoomNombreCasesHeight, roomContainer);
room.setDivHeight();

var snake = null;
var snake2 = null;

function StartGame(){
  snake = new Snake(1);
createSnake(snake);

if (nombreDeJoueurs>1){
snake2 = new Snake(2)
createSnake(snake2);
}

SpawnItemsRandomly();
}

//restart

let btnStart = document.getElementById("buttonStart");
let btnStart2 = document.getElementById("buttonStart2");
let divCache = document.getElementById("cache");
btnStart.addEventListener("click", () => {
  nombreDeJoueurs = 1;
  askForManette();
});
btnStart2.addEventListener("click", () => {
  nombreDeJoueurs = 2;
  askForManettes();
});

function restart_game() {
  score = 0;
  scoreDiv.innerHTML = "Score : " + score;
  gameover.style.display = "none";
  gameover.style.opacity = 0;
  divCache.style.opacity = "0";
  snake.speed = startingSpeed;
  snake.acceleration = startingAcceleration;
  if (nombreDeJoueurs>1){
  snake2.speed = startingSpeed;
  snake2.acceleration = startingAcceleration;}
  for (var i = 0; i < room.currentItemList.length; i++) {
    var item = room.currentItemList[i];
    item.deleteSelf(false, snake);
  }
  room.currentItemList = [];

  snake.cutSnake(2);
  snake.goToRandomPlace();
  snake.restartBoucle();
  if (nombreDeJoueurs>1){
  snake2.cutSnake(2);
  snake2.goToRandomPlace();
  snake2.restartBoucle();}
  gameIsRunning = true;
}

function boucle(snakeThis) {

  if(nombreDeJoueurs>1){
    scoreDiv.style.display = "none";
  }else
  {
    scoreDiv.style.display = "block"
  }
  
  snakeThis.go_forward(snakeThis.speed);
  snakeThis.checkCollisionWithBody();
  snakeThis.checkCollisionWithItems();
  if (nombreDeJoueurs>1){
  snakeThis.checkCollisionWithOtherSnake();}
}
let btnRestart = document.getElementById("buttonRestart");
let gameover = document.getElementById("gameover");
let scoreFinal = document.getElementById("scoreFinal");
btnRestart.addEventListener("click", () => {
  restart_game();
});
function gameOver(id) {
  clearInterval(snake.miaKhalifa);
  if (nombreDeJoueurs>1){
  clearInterval(snake2.miaKhalifa);}
  gameIsRunning = false;
  var votrescore = score;

  var snakecontent = document.getElementById("snakecontent");
  var snakeded = document.getElementById("snakeded");

  if (id==0){
    snakecontent.style.display="none";
    snakeded.src = "./asset/img/snakeded.png";
  scoreFinal.innerText = "Score Final : " + votrescore;
  }else{
    snakecontent.style.display="flex";}
  if (id==2){
    snakecontent.src = "./asset/img/snakecontent.png";
    scoreFinal.innerText = "Le joueur 1 gagne !";
    snakeded.src = "./asset/img/snakededrouge.png";
    }
    if (id==1){
      snakecontent.src = "./asset/img/snakecontentrouge.png";
      scoreFinal.innerText = "Le joueur 2 gagne !";
      snakeded.src = "./asset/img/snakeded.png";
      }
  gameover.style.display = "flex";
  gameover.style.opacity = 0;
  setTimeout(function () {
    gameover.style.opacity = 1;
  }, 1500);
}

function createSnake(snakeThis) {
  snakeThis.goToRandomPlace();
for (let i = 1; i < snakeThis.corps.length; i++) {
  snakeThis.corps[i].div.style.borderRadius = "50%";
}
snakeThis.head().div.style.backgroundColor = "transparent";
snakeThis.head().div.style.backgroundImage =
  "url(./asset/img/snakeHead" + snakeThis.direction + snakeThis.id + ".png)";
  snakeThis.head().div.style.backgroundSize = "contain";
  snakeThis.head().div.style.backgroundRepeat = "no-repeat";
  snakeThis.head().div.style.opacity = "1";
  snakeThis.head().div.style.borderRadius = "50%";
  snakeThis.head().div.style.zIndex = "1";
}

function checkCollision(snakeThis, corps, corpsID){
  for (var i = 1; i < corps.length; i++) {
    var collision = false;
    var boule = corps[i];
    switch (snakeThis.direction) {
      case "right":
        if (boule.directionAxe(snakeThis) == "vertical") {
          if (boule.posX > snakeThis.head().lastX) {
            collision = true;
          }
        }
        if (boule.direction() == "left") {
          collision = true;
        }
        break;
      case "left":
        if (boule.directionAxe(snakeThis) == "vertical") {
          if (boule.posX < snakeThis.head().lastX) {
            collision = true;
          }
        }
        if (boule.direction() == "right") {
          collision = true;
        }
        break;
      case "up":
        if (boule.directionAxe(snakeThis) == "horizontal") {
          if (boule.posY < snakeThis.head().lastY) {
            collision = true;
          }
        }
        if (boule.direction() == "down") {
          collision = true;
        }
        break;
      case "down":
        if (boule.directionAxe(snakeThis) == "horizontal") {
          if (boule.posY > snakeThis.head().lastY) {
            collision = true;
          }
        }
        if (boule.direction() == "top") {
          collision = true;
        }
        break;
    }
    if (
      i == snakeThis.corps.length - 1 &&
      snakeThis.colide(boule) &&
      snakeThis.corps.length > 3
    ) {
      collision = true;
    }
    if (snakeThis.head().isOutOfMap() || boule.isOutOfMap()) {
      collision = false;
    }

    if (snakeThis.colide(boule) && collision) {
      if (nombreDeJoueurs>1){
        if (snakeThis.id==1&&corpsID==2){gameOver(1); console.log("Le Snake vert s'emplafone dans le Snake Rouge")}
        if (snakeThis.id==2&&corpsID==1){gameOver(2); console.log("Le Snake rouge s'emplafone dans le Snake Vert")}
        if (!snakeThis.godmode){
        if (snakeThis.id==1&&corpsID==1){gameOver(1); console.log("Le Snake vert se mort la queue")}
        if (snakeThis.id==2&&corpsID==2){gameOver(2); console.log("Le Snake rouge se mort la queue")}
        }
      }else{
       if (!snakeThis.godmode)gameOver(0);
      }
    }
  }
}


//gamepad

function askForManettes(){
  
  var pasDeManette = document.createElement("div");
  pasDeManette.className = "pasdemannette";
  pasDeManette.innerText = "J'ai pas de mannette"
  pasDeManette.onclick = function(){
    StartGame();
    gameHasStarted = true;
    restart_game();
  }

  var divBg = document.createElement("div");
  divBg.appendChild(pasDeManette);
  divBg.style.position = "absolute";
  divBg.style.width = "100%";
  divBg.style.height = "100%";
  divBg.style.backgroundColor = "black"
  btnStart.style.display = "none";
  btnStart2.style.display = "none";
  divCache.appendChild(divBg);
  divBg.zIndex = "9999";

  var tetej1 = document.createElement("div");
  tetej1.style.position = "absolute";
  tetej1.style.width = "30%";
  tetej1.style.height = "35%";
  tetej1.style.marginLeft = "25%";
  tetej1.style.marginTop = "12%";
  tetej1.style.backgroundImage = "url(./asset/img/snakeHeaddown1.png)"
  tetej1.style.backgroundSize = "contain"
  tetej1.style.backgroundRepeat = "no-repeat"
  tetej1.style.opacity = "0.2"

  var textj1 = document.createElement("div");
  textj1.style.color = "white"
  textj1.innerHTML = "Appuyez sur A"
  textj1.style.position = "absolute";
  textj1.style.marginLeft = "23%";
  textj1.style.width = "20%";
  textj1.style.fontSize = "35px";
  textj1.style.fontFamily = "'Shizuru', cursive";
  textj1.style.textAlign = "center";
  textj1.style.marginTop = "60vh";
  
  divBg.appendChild(tetej1);
  divBg.appendChild(textj1);

  var tetej2 = document.createElement("div");
  tetej2.style.position = "absolute";
  tetej2.style.width = "30%";
  tetej2.style.height = "35%";
  tetej2.style.marginLeft = "60%";
  tetej2.style.marginTop = "12%";
  tetej2.style.backgroundImage = "url(./asset/img/snakeHeaddown2.png)"
  tetej2.style.backgroundSize = "contain"
  tetej2.style.backgroundRepeat = "no-repeat"
  tetej2.style.opacity = "0.2"

  var textj2 = document.createElement("div");
  textj2.style.color = "white"
  textj2.innerHTML = "Appuyez sur A"
  textj2.style.position = "absolute";
  textj2.style.marginLeft = "59%";
  textj2.style.width = "20%";
  textj2.style.fontSize = "35px";
  textj2.style.fontFamily = "'Shizuru', cursive";
  textj2.style.textAlign = "center";
  textj2.style.marginTop = "60vh";

  divBg.appendChild(tetej2);
  divBg.appendChild(textj2);
  
  var j1a = false;
  var j2a = false;

  var waitForBtnA = setInterval(function (){

   
    mannette_1 = navigator.getGamepads()[0]
    mannette_2 = navigator.getGamepads()[1]
  
        //JOUEUR 1
  
        if (mannette_1!=null){
          const myGamepad = mannette_1;
          console.log("lol")
          if (myGamepad.buttons[0].pressed){j1a=true;tetej1.style.opacity="1"}
      }
  
      //JOUEUR 2
      if (mannette_2!=null){
        const myGamepad = mannette_2;
        if (myGamepad.buttons[0].pressed){j2a=true;tetej2.style.opacity="1"}
    }

    if (j1a&&j2a){
      clearInterval(waitForBtnA)
      var btnStartReady = document.createElement("div");
      btnStartReady.style.position = "absolute";
      btnStartReady.style.width = "40%"
      btnStartReady.style.height = "10%"
      btnStartReady.style.marginLeft = "30%"
      btnStartReady.style.borderRadius = "20px"
      btnStartReady.style.textAlign = "center"
      btnStartReady.style.marginTop = "80vh"
      btnStartReady.style.fontSize = "35px";
      btnStartReady.style.fontFamily = "'Shizuru', cursive";
      btnStartReady.style.backgroundColor = "red";
      btnStartReady.style.color = "white";
      btnStartReady.innerText = "START";
      divBg.appendChild(btnStartReady);
      btnStartReady.onclick = function(){
        restart_game();
      }
      
      StartGame();
      gameHasStarted = true;
    }

  },10)

}


function askForManette(){
  
  var pasDeManette = document.createElement("div");
  pasDeManette.className = "pasdemannette";
  pasDeManette.innerText = "J'ai pas de mannette"
  pasDeManette.onclick = function(){
    StartGame();
    gameHasStarted = true;
    restart_game();
  }

  var divBg = document.createElement("div");
  divBg.appendChild(pasDeManette);
  divBg.style.position = "absolute";
  divBg.style.width = "100%";
  divBg.style.height = "100%";
  divBg.style.backgroundColor = "black"
  btnStart.style.display = "none";
  btnStart2.style.display = "none";
  divCache.appendChild(divBg);
  divBg.zIndex = "9999";

  var tetej1 = document.createElement("div");
  tetej1.style.position = "absolute";
  tetej1.style.width = "30%";
  tetej1.style.height = "35%";
  tetej1.style.marginLeft = "41.5%";
  tetej1.style.marginTop = "12%";
  tetej1.style.backgroundImage = "url(./asset/img/snakeHeaddown1.png)"
  tetej1.style.backgroundSize = "contain"
  tetej1.style.backgroundRepeat = "no-repeat"
  tetej1.style.opacity = "0.2"

  var textj1 = document.createElement("div");
  textj1.style.color = "white"
  textj1.innerHTML = "Appuyez sur A"
  textj1.style.position = "absolute";
  textj1.style.marginLeft = "40%";
  textj1.style.width = "20%";
  textj1.style.fontSize = "35px";
  textj1.style.fontFamily = "'Shizuru', cursive";
  textj1.style.textAlign = "center";
  textj1.style.marginTop = "60vh";
  
  divBg.appendChild(tetej1);
  divBg.appendChild(textj1);

  var j1a = false;

  var waitForBtnA = setInterval(function (){

   
    mannette_1 = navigator.getGamepads()[0]
    mannette_2 = navigator.getGamepads()[1]
  
        //JOUEUR 1
  
        if (mannette_1!=null){
          const myGamepad = mannette_1;
          console.log("lol")
          if (myGamepad.buttons[0].pressed){j1a=true;tetej1.style.opacity="1"}
      }
  

    if (j1a){
      clearInterval(waitForBtnA)
      var btnStartReady = document.createElement("div");
      btnStartReady.style.position = "absolute";
      btnStartReady.style.width = "40%"
      btnStartReady.style.height = "10%"
      btnStartReady.style.marginLeft = "30%"
      btnStartReady.style.borderRadius = "20px"
      btnStartReady.style.textAlign = "center"
      btnStartReady.style.marginTop = "80vh"
      btnStartReady.style.fontSize = "35px";
      btnStartReady.style.fontFamily = "'Shizuru', cursive";
      btnStartReady.style.backgroundColor = "red";
      btnStartReady.style.color = "white";
      btnStartReady.innerText = "START";
      divBg.appendChild(btnStartReady);
      btnStartReady.onclick = function(){
        restart_game();
      }
      
      StartGame();
      gameHasStarted = true;
    }

  },10)

}

setInterval(() => {
  
  if (gameHasStarted){

  mannette_1 = navigator.getGamepads()[0]
  mannette_2 = navigator.getGamepads()[1]

      //JOUEUR 1

      if (mannette_1!=null){
        const myGamepad = mannette_1;
        var LeftStickHorizontal = `${myGamepad.axes[0]}`;
        var LeftStickVertical = `${myGamepad.axes[1]}`;
        switch (LeftStickHorizontal) {
          case "-1":
            if (snake.head().directionAxe(snake) == "vertical") snake.direction = "left";
            break;
          case "1":
            if (snake.head().directionAxe(snake) == "vertical")
              snake.direction = "right";
            break;
       }
       switch (LeftStickVertical) {
        case "1":
        if (snake.head().directionAxe(snake) == "horizontal")
          snake.direction = "down";
        break;
      case "-1":
        if (snake.head().directionAxe(snake) == "horizontal") snake.direction = "up";
        break;
     }
     if (myGamepad.buttons[12].pressed){
      if (snake.head().directionAxe(snake) == "horizontal") snake.direction = "up";
     }
     if (myGamepad.buttons[13].pressed){
      if (snake.head().directionAxe(snake) == "horizontal") snake.direction = "down";
     }
     if (myGamepad.buttons[14].pressed){
      if (snake.head().directionAxe(snake) == "vertical") snake.direction = "left";
     }
     if (myGamepad.buttons[15].pressed){
      if (snake.head().directionAxe(snake) == "vertical") snake.direction = "right";
     }
     if (myGamepad.buttons[0].pressed){restart_game()}
    }

    //JOUEUR 2

    if (mannette_2!=null && nombreDeJoueurs>1){
      const myGamepad = mannette_2;
      var LeftStickHorizontal = `${myGamepad.axes[0]}`;
      var LeftStickVertical = `${myGamepad.axes[1]}`;
      switch (LeftStickHorizontal) {
        case "-1":
          if (snake2.head().directionAxe(snake2) == "vertical") snake2.direction = "left";
          break;
        case "1":
          if (snake2.head().directionAxe(snake2) == "vertical")
            snake2.direction = "right";
          break;
     }
     switch (LeftStickVertical) {
      case "1":
      if (snake2.head().directionAxe(snake) == "horizontal")
        snake2.direction = "down";
      break;
    case "-1":
      if (snake2.head().directionAxe(snake) == "horizontal") snake2.direction = "up";
      break;
   }
   
   if (myGamepad.buttons[12].pressed){
    if (snake2.head().directionAxe(snake) == "horizontal") snake2.direction = "up";
   }
   if (myGamepad.buttons[13].pressed){
    if (snake2.head().directionAxe(snake) == "horizontal") snake2.direction = "down";
   }
   if (myGamepad.buttons[14].pressed){
    if (snake2.head().directionAxe(snake) == "vertical") snake2.direction = "left";
   }
   if (myGamepad.buttons[15].pressed){
    if (snake2.head().directionAxe(snake) == "vertical") snake2.direction = "right";
   }
  }
      
}

}, 10)