// var for global time
let t=0;
let x=0;
let y=0;


class Baddie{
  constructor(){
    this.pos = createVector(random()*3*width, random()*3*height);
    this.r = 10.00;
    this.render = true;
    this.color = [255*random(), 255*random(), 255*random()];
  }
  
  draw(){
    if (this.render == true){
      fill(this.color[0],this.color[1], this.color[2]);
      stroke(this.color[0],this.color[1], this.color[2]);
      circle(this.pos.x, this.pos.y, this.r*2);
      stroke(0);
      
    }
    
  }
  
  collision(baddie) {
    let a = this.r + baddie.r;
    let x = this.pos.x - baddie.pos.x;
    let y = this.pos.y - baddie.pos.y;

    if (a > Math.sqrt((x * x) + (y * y))) {
      return true;
    } else {
      return false;
    }
  }
  
  eat(baddie){
    
    if (this.collision(baddie) == true && this.r >= baddie.r){
      baddie.render=false;
      this.r+=0.1;
      
      // debugging for collision
      //stroke(255,0,0);
      //line(this.pos.x, this.pos.y, baddie.pos.x, baddie.pos.y)  
    
    }
    //stroke(0);
    
    
  }
}

// class for player objects

class Player extends Baddie{
  
}

class Thorne extends Baddie{
  constructor(){
    super();
    this.pos = createVector(width/2, height/2);//createVector(random()*3*width, random()*3*height);
    this.r = 10.00;
    this.render = true;
    this.color = [255, 0, 0];
    this.fgcolor = [255, 255, 255];
    
  }
  
  draw(){
    if (this.render == true){
      fill(this.color[0],this.color[1], this.color[2]);
      stroke(this.fgcolor[0],this.fgcolor[1], this.fgcolor[2]);
      circle(this.pos.x, this.pos.y, this.r*2);
      stroke(0);
      
    }
    
  }
  eat(baddie){
    
    if (this.collision(baddie) == true && this.r >= baddie.r){
      //baddie.render=false;
      this.r-=0.1;
      
      // debugging for collision
      //stroke(255,0,0);
      //line(this.pos.x, this.pos.y, baddie.pos.x, baddie.pos.y)  
    
    }
    }
}

let baddies = [];
let player;

//********************************* SETUP
function setup() {
  createCanvas(700, 500);
  
  for (let i=0; i<70; i++)
    {
      baddies.push(new Baddie());
      
    }
  player = new Player();
  player.r = 35;
  baddies.push(player);
  
  //debug code
  enemy = new Thorne();
  baddies.push(enemy);
  
  
  //firebase config
  var config = {
    apiKey: "AIzaSyAx0IPIbqY-d9ZcJnUYHpgKQKtpOydAEjc",
    authDomain: "aviato-jpcpds.firebaseapp.com",
    databaseURL: "https://aviato-jpcpds.firebaseio.com",
    projectId: "aviato-jpcpds",
    storageBucket: "aviato-jpcpds.appspot.com",
    messagingSenderId: "489287753654"
  }
  firebase.initializeApp(config); 
  database = firebase.database();
  
  var ref = database.ref('scores');
  ref.on('value', gotData, errData);
  //submitScore();
  
  var leadsRef = database.ref('scores');
  leadsRef.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        //console.log(childData);
        player.r = childData.score+1;
      });
  });
  
}


////////////////////////////////// END SETUP

function gotData (data) {
  	//console.log(data.val());
	var scores = data.val();
  	var keys = Object.keys(scores);
  	//console.log(keys);
  
	for (var i = 0; i < keys.length; i++) {
		var k = keys[i];
	  	var submittedScore = scores[k].score;
	  	var submittedName = scores[k].name;
	  	//console.log("Key: " + k + "   Score: " + submittedScore + "   Name: " + submittedName);
	}
}

function errData(err) {
	console.log('Error!');
  	console.log(err);
}

function submitScore() {
  	var data = {
  		name: "agario",
		score: player.r
  	}
  	var ref = database.ref('scores');
  	ref.push(data);
  	//console.log(data);
  	score = 0;
}


function collision_detection(){
  // collision detection
  
  for (let i=0; i<baddies.length; i++){
    for (let j=0; j<baddies.length; j++){
      
      if (baddies[i].render == true && baddies[j].render == true && baddies[i] !== baddies[j]){
        
        baddies[i].eat(baddies[j]);
        
      }
    }
    //baddies[i].pos.x += random() * random([1,-1]);
    //baddies[i].pos.y += random() * random([1,-1]);
  }
}


function canvasTranslate(player){
  if (mouseX > width-player.r){
    x+=10;
  }
  else if (mouseX <player.r){
    x-=10;
  }
  else if (mouseY > height-player.r){
    y+=10;
  }
  else if (mouseY <player.r){
    y-=10;
  }
  
}

function draw() {
  background(0);
  
  noCursor();
  push();
  //noFill();
  translate(-x, -y);
  
  collision_detection()
  
  
  player.pos.x = mouseX+x;
  player.pos.y = mouseY+y;

  if (x+mouseX-player.r > 1 && x+mouseX-player.r < 3*width && y+mouseY-player.r>1 && y+mouseY-player.r<3*height){
    canvasTranslate(player)
  }
 

  
  // draw loop
  for (let i=0; i<baddies.length; i++){
    baddies[i].draw();
  }
  
  for (let i=0; i<baddies.length; i++){
    if (baddies[i].render==false){
      baddies.splice(i,1);
      baddies.push(new Baddie());
    }
  
  }
  textSize(20)
  text("Score:"+player.r,x+20,y+40)
  
  stroke(255,0,0);
  strokeWeight(10);
  noFill();
  rect(10,10, 3*width, 3*height);
  
  pop();
  
  if (player.r%100==0){
    submitScore();
  }
  t++;
}