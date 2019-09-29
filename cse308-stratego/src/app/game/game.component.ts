import {Component, OnInit} from '@angular/core';
import {Block, Board, Card} from './game-models';
import {ApiService} from '../service/api.service';

@Component({
  selector: 'game-page',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']

})
export class GameComponent implements OnInit {
  columns: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  rows: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  private gameBoard: Card[][] = [];
  private redArr: Card[] = [];
  private blueArr: Card[] = [];
  private imageMapred: Map<number, string> = new Map<number, string>();
  private imageMapblue: Map<number, string> = new Map<number, string>();
  private imagelake: Map<number, string> = new Map<number, string>();
  private imageMap: Map<number, string> = new Map<number, string>();
  private selectedCard: Card = this.emptyCard(0, 0);


  constructor(private service: ApiService) {
  }


  ngOnInit() {
    this.populateImageMap();
    this.populateImageMap_red();
    this.populateImagelake();
    this.initializeCards();
    this.setupGameBoard();
    this.setPositions();
    console.log(this.gameBoard);

    let board = new Board();
    board.board = this.gameBoard;

    this.service.arrayManipulation(board).subscribe((data: string) => {
      console.log(data)
    });


  }

  populateImageMap() {

    let basePath = "../assets/";

    for (let i = 1; i <= 12; i++) {
      let name = "";
      if (i == 1)
        name = "marshal.png";
      else if (i == 2)
        name = "general.png";
      else if (i == 3)
        name = "colonel.png";
      else if (i == 4)
        name = "major.png";
      else if (i == 5)
        name = "captain.png";
      else if (i == 6)
        name = "lieutenant.png";
      else if (i == 7)
        name = "sergeant.png";
      else if (i == 8)
        name = "miner.png";
      else if (i == 9)
        name = "scout.png";
      else if (i == 10)
        name = "spy.png";
      else if (i == 11)
        name = "bomb.png";
      else if (i == 12)
        name = "flag.png";

      this.imageMapblue.set(i, basePath + name)
    }
  }

  populateImageMap_red() {

    let basePath = "../assets/";

    for (let i = 1; i <= 12; i++) {
      let name = "";
      if (i == 1)
        name = "redmarshal.png";
      else if (i == 2)
        name = "redgeneral.png";
      else if (i == 3)
        name = "redcolonel.png";
      else if (i == 4)
        name = "redmajor.png";
      else if (i == 5)
        name = "redcaptain.png";
      else if (i == 6)
        name = "redlieutenant.png";
      else if (i == 7)
        name = "redsergeant.png";
      else if (i == 8)
        name = "redminer.png";
      else if (i == 9)
        name = "redscout.png";
      else if (i == 10)
        name = "redspy.png";
      else if (i == 11)
        name = "redbomb.png";
      else if (i == 12)
        name = "redflag.png";

      this.imageMapred.set(i, basePath + name)
    }
  }

  populateImagelake() {

    let basePath = "../assets/";

    for (let i = 1; i <= 4; i++) {
      let name = "";
      if (i == 1)
        name = "1.png";
      else if (i == 2)
        name = "2.png";
      else if (i == 3)
        name = "3.png";
      else if (i == 4)
        name = "4.png";

      this.imagelake.set(i, basePath + name)
    }
  }

  initializeCards() {

    this.initializePlayers("red");
    this.initializePlayers("Blue");

  }


  initializePlayers(color: string) {

    for (let i = 1; i <= 12; i++) {
      let card: Card = new Card();

      // Initially every card has a position of 0,0 regradless
      card.x = 0;
      card.y = 0;

      (i);
      if (i == 1 || i == 2 || i == 10 || i == 12) {
        card.color = color;
        card.value = i;
        card.path = this.imageMapred.get(i);
        if (color == "red")
          this.redArr.push(card);
        else
          this.blueArr.push(card);
      } else if (i == 3) {
        this.initializerHelper(2, color, i)
      } else if (i == 4) {
        this.initializerHelper(3, color, i)
      } else if (i == 5 || i == 6 || i == 7) {
        this.initializerHelper(4, color, i)
      } else if (i == 8) {
        this.initializerHelper(5, color, i)
      } else if (i == 9) {
        this.initializerHelper(8, color, i)
      } else if (i == 11) {
        this.initializerHelper(6, color, i)
      }
    }
  }

  initializerHelper(NOC, color: string, val) {

    for (let j = 0; j < NOC; j++) {
      let temp: Card = new Card();
      temp = this.setPos(temp, 0, 0);
      temp.color = color;
      temp.value = val;
      if (color == "red") {
        temp.path = this.imageMapred.get(val);
        this.redArr.push(temp);
      } else {
        temp.path = this.imageMapblue.get(val);
        this.blueArr.push(temp);
      }
    }
    // this.shuffleElements(this.redArr);
    this.shuffle(this.redArr);
    this.shuffle(this.blueArr);

    // this.shuffleElements(this.blueArr);
  }

  setupGameBoard() {
    let s = 4;
    let random = Math.floor((Math.random() * 11) + 1);
    while (s > 0) {
      this.gameBoard.push(this.redArr.splice(0, 10));
      s--;
    }

    for (let i = 0; i < 2; i++) {
      let cd = new Card();
      cd.color = "purple";
      cd.value = 0;
      cd.path = "";
      cd = this.setPos(cd, 0, 0);
      // @ts-ignore
      const temp = [cd, cd, cd, cd, cd, cd, cd, cd, cd, cd];
      if (i==0) {
        temp[2].path = this.imagelake.get(1);
        temp[3].path = this.imagelake.get(2);
        temp[6].path = this.imagelake.get(1);
        temp[7].path = this.imagelake.get(2);
      }else {
        temp[2].path = this.imagelake.get(3);
        temp[3].path = this.imagelake.get(4);
        temp[6].path = this.imagelake.get(3);
        temp[7].path = this.imagelake.get(4);
      }
      console.log(temp);
      this.gameBoard.push(temp);
    }

    s = 4;
    while (s > 0) {
      this.gameBoard.push(this.blueArr.splice(0, 10));
      s--;
    }
  }

  setPositions() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[0].length; j++) {
        this.gameBoard[i][j].x = i;
        this.gameBoard[i][j].y = j;
      }
    }
  }

  setPos(tcard: Card, x: number, y: number) {
    tcard.x = x;
    tcard.y = y;

    return tcard;
  }


  trClick(row, column) {


    // flag and the bomb isn't moved.
    if ( this.gameBoard[row][column].value == 11 ||  this.gameBoard[row][column].value == 12)
      return;

    // if(this.selectedCard.value != 9 && this.selectedCard.value != 0){
    //    if (this.validatePosition(this.gameBoard[row][column].x, this.gameBoard[row][column].y) == false)
    //      // this.trClick( row, column);
    //    return;
    // }

    // this is where the attacks on the other cards happen.
    if (this.gameBoard[row][column].value != 0 && this.selectedCard.value != 0) {
      this.validateMove(row, column);
    }

    else if (this.gameBoard[row][column].value != 0) {                                                // this is where the control comes just before attacking some card or moving (basically when you select a card).
      console.log("Inside TrClick, else if part", this.selectedCard, this.gameBoard[row][column]);
      this.addGreen(row, column);
      this.selectedCard = this.gameBoard[row][column];
      this.gameBoard[row][column] = this.emptyCard(row, column)
    }

    // this else part deals with moving the card to another empty space.
    else {

      console.log("Inside TrClick, else part", this.selectedCard, this.gameBoard[row][column]);

      // this.validatePosition(this.selectedCard.x, this.selectedCard.y);
      this.removeGreen(this.selectedCard.x, this.selectedCard.y);
      this.gameBoard[row][column] = this.selectedCard;
      this.gameBoard[row][column].x = row;
      this.gameBoard[row][column].y = column;
      this.selectedCard = this.emptyCard(0, 0);

    }

  }

  validatePosition(row, col){

    if(((row+1) == this.selectedCard.x || (row - 1) == this.selectedCard.x)
        && ((col+1) == this.selectedCard.y || (col-1) == this.selectedCard.y))
      return true;

    console.log("Card can only move one block away");
    return false;
  }

  validateMove(row, column) {
    console.log("in validate move", this.selectedCard, this.gameBoard[row][column]);


    if (this.selectedCard.color != this.gameBoard[row][column].color) {


      if (this.selectedCard.value < this.gameBoard[row][column].value) {            // if the card in hand is
        console.log("in validate move, if", this.selectedCard, this.gameBoard[row][column]);

        this.removeGreen(this.selectedCard.x, this.selectedCard.y);
        this.gameBoard[row][column] = this.selectedCard;
        this.selectedCard = this.emptyCard(0, 0);
      }

      else if (this.selectedCard.value == this.gameBoard[row][column].value) {    // if the card values are equal destroy both.
        console.log("in validate move, else if", this.selectedCard, this.gameBoard[row][column]);

        this.removeGreen(this.selectedCard.x, this.selectedCard.y);
        this.selectedCard = this.emptyCard(0, 0);
        this.gameBoard[row][column] = this.emptyCard(0, 0);
      }

      else {
        console.log("in validate move, else", this.selectedCard, this.gameBoard[row][column]);

        this.removeGreen(this.selectedCard.x, this.selectedCard.y);
        this.selectedCard = this.emptyCard(0, 0);
      }


      if (true) {
      }
      if (true) {
      }
      if (true) {
      }
      if (true) {
      }
      if (true) {
      }
      if (true) {
      }
      if (true) {
      }


    } else {
      this.gameBoard[this.selectedCard.x][this.selectedCard.y] = this.selectedCard;
      this.removeGreen(this.selectedCard.x, this.selectedCard.y);
      this.selectedCard = this.emptyCard(0, 0);
    }
  }

  showOptions(x, y, yes) {
    const id: string = String(x) + String(y);
    const el = (document.getElementById(id) as HTMLTableRowElement);
    console.log(x, y)

    if (yes)
      el.classList.add("options");

    else
      el.classList.remove("options")
  }

  showAttackPossibility(x, y, yes) {
    const id: string = String(x) + String(y);
    const el = (document.getElementById(id) as HTMLTableRowElement);
    console.log(x, y);

    if (yes)
      el.classList.add("attack_possibility");
    else
      el.classList.remove("attack_possibility");
  }

  addGreen(row, column) {
    let x = 0;
    let y = 0;

    if ((row - 1) >= 0 && this.gameBoard[row - 1][column].path == "") {
      x = row - 1;
      y = column;
      this.showOptions(x, y, 1);
    } else if (this.gameBoard[row - 1][column].color != this.gameBoard[row][column].color) {
      x = row - 1;
      y = column;
      this.showAttackPossibility(x, y, 1);
    }

    if ((row + 1) <= 9 && this.gameBoard[row + 1][column].path == "") {
      x = row + 1;
      y = column;
      this.showOptions(x, y, 1);
    } else if ((row + 1) <= 9 && this.gameBoard[row + 1][column].color != this.gameBoard[row][column].color) {
      x = row + 1;
      y = column;
      this.showAttackPossibility(x, y, 1);
    }

    if ((column - 1) >= 0 && this.gameBoard[row][column - 1].path == "") {
      x = row;
      y = column - 1;
      this.showOptions(x, y, 1);
    } else if ((column - 1) >= 0 && this.gameBoard[row][column - 1].color != this.gameBoard[row][column].color) {
      x = row;
      y = column - 1;
      this.showAttackPossibility(x, y, 1);
    }

    if ((column + 1) <= 9 && this.gameBoard[row][column + 1].path == "") {
      x = row;
      y = column + 1;
      this.showOptions(x, y, 1);
    } else if ((column + 1) <= 9 && this.gameBoard[row][column + 1].color != this.gameBoard[row][column].color) {
      x = row;
      y = column + 1;
      this.showAttackPossibility(x, y, 1);
    }
  }

  removeGreen(row, column) {
    let x = 0;
    let y = 0;

    if ((row - 1) >= 0 && this.gameBoard[row - 1][column].path == "") {
      x = row - 1;
      y = column;
      this.showOptions(x, y, 0);
    } else if ((row - 1) >= 0 && this.gameBoard[row - 1][column].color != this.gameBoard[row][column].color) {
      x = row - 1;
      y = column;
      this.showAttackPossibility(x, y, 0);
    }

    if ((row + 1) <= 9 && this.gameBoard[row + 1][column].path == "") {
      x = row + 1;
      y = column;
      this.showOptions(x, y, 0);
    } else if ((row + 1) <= 9 && this.gameBoard[row + 1][column].color != this.gameBoard[row][column].color) {
      x = row + 1;
      y = column;
      this.showAttackPossibility(x, y, 0);
    }

    if ((column - 1) >= 0 && this.gameBoard[row][column - 1].path == "") {
      x = row;
      y = column - 1;
      this.showOptions(x, y, 0);
    } else if ((column - 1) >= 0 && this.gameBoard[row][column - 1].color != this.gameBoard[row][column].color) {
      x = row;
      y = column - 1;
      this.showAttackPossibility(x, y, 0);
    }

    if ((column + 1) <= 9 && this.gameBoard[row][column + 1].path == "") {
      x = row;
      y = column + 1;
      this.showOptions(x, y, 0);
      this.showAttackPossibility(x, y, 0);
    } else if ((column + 1) <= 9 && this.gameBoard[row][column + 1].color != this.gameBoard[row][column].color) {
      x = row;
      y = column + 1;
      this.showAttackPossibility(x, y, 0);
    }
  }

  shuffle(array: Card[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  emptyCard(row, column) {
    let cd = new Card();
    cd.color = "Blank Baba bakchod";
    cd.value = 0;
    cd.path = "";
    cd = this.setPos(cd, row, column);
    return cd;
  }

  hide() {

    let i = 0;
    for (i = 0; i < 10; i++) {
      const id: string = String(0) + String(i);

      const el = (document.getElementById(id) as HTMLTableRowElement);

      el.classList.add("displayNone");
    }
  }

  unhide() {

    let i = 0;
    for (i = 0; i < 10; i++) {
      const id: string = String(0) + String(i);

      const el = (document.getElementById(id) as HTMLTableRowElement);

      el.classList.remove("displayNone");
    }
  }

  // setimage(){
  //
  //   this.gameBoard[4][2].path=this.imagelake.get(1);
  //   this.gameBoard[4][3].path=this.imagelake.get(2);
  //   this.gameBoard[5][2].path=this.imagelake.get(3);
  //   this.gameBoard[5][3].path=this.imagelake.get(4);
  //
  // }


}


// private selectedCard: Card = new Card();
//
// trClick(row, column) {
//   if(this.gameBoard[row][column].value != 0) {
//     this.selectedCard = this.gameBoard[row][column];
//     this.gameBoard[row][column] = new Card();
//     this.emptyCard(this.gameBoard[row][column], row, column)
//   }
//   else {
//     this.gameBoard[row][column] = this.selectedCard;
//     this.selectedCard = new Card();
//   }
// }
//

