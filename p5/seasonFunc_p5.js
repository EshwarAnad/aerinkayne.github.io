// issues: mover collision of top of player from bottom needs fix 
// concat map tiles and fix loop.  rework spike objects so that direction 
// can be changed and collision still works.  fix camera/effect interactions
// notes: ObjectHandler and Game classes are in their own files.

function buttonClicked(x,y,w,h,txt){
    stroke(0);
    strokeWeight(1);
    
    if(mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h){
        fill(65,250,255);
    }
    else{
        fill(75,205,225);
    }
    
    var txtPos=h/30;
	
    if(mouseX>=x&&mouseX<=x+w&&mouseY>=y&&mouseY<=y+h&& mouseIsPressed){
        rect(x,y,w,h,10);
        
        fill(0);
        textAlign(CENTER,CENTER);
        textSize(10);
        text(txt,x+(w/2),y+(h/2)+txtPos);
        textAlign(LEFT,LEFT);
        
        return true; 
    }
    
    rect(x,y,w,h,10);
    
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(10);
    text(txt,x+(w/2),y+(h/2));
    textAlign(LEFT,LEFT);
    strokeWeight(1);
}

var onScreen = function(obj1, obj2, levelW, levelH){ 
	var obj2CX = obj2.P.x + obj2.w/2;
	var obj2CY = obj2.P.y + obj2.h/2;
			//player center - obj1 center <   screen/2    +obj1 size/2  +dif if at L side      +dif if at Rside 
    return (
			abs(obj2CX - (obj1.P.x + obj1.w/2)) < width/2 + obj1.w/2 + max(0, width/2 - obj2CX) + max(0, obj2CX-(levelW-width/2)) &&
			abs(obj2CY - (obj1.P.y + obj1.h/2)) < height/2 + obj1.h/2 + max(0, height/2 - obj2CY) + max(0, obj2CY-(levelH-height/2))
			);   
};

//sorts an array by a property value, where str is the property name)
function sortArrByProperty(arr, str){
    var holder;
        for (var i = 0; i < arr.length; i++){
            for (var j = i+1; j < arr.length; j++) {
                if (arr[j][str] < arr[i][str]){ 
                    holder = arr[i];
                    arr[i] = arr[j];
                    arr[j] = holder;
                    }
            }
        }
}

class Player {
	constructor (x,y,w,h){
		this.P = createVector(x,y);
		this.w = w;
		this.h = h;
		this.V = createVector(0,0);
		this.moveSpeed = 0.25;
		this.MAXSPEED = 4;
		this.MAXHEALTH = 6;
		this.falling = false;
		this.gravity = createVector(0,0.4);
		//this.move = [false,false,false,false];  //R,L,U,D
		this.keyInputs=[39,37,38]; //RIGHT,LEFT,UP.  40 DOWN
		this.color = (50, 50, 50);
		this.health = 3;
		this.gotKey = false;
		this.delay = 41; //for damaging collisions
		this.z_Index = 2;
	}

	update(arr){  //arr used to check collision with tiles that affect position
		// key inputs
		if(keys[this.keyInputs[0]]){  //39
			this.V.x += this.moveSpeed;
		}
		if(keys[this.keyInputs[1]]){  //37
			this.V.x -= this.moveSpeed;
		}
		if(keys[this.keyInputs[2]] && !this.falling){ //38 jump
			this.V.y = -this.h/3.11;  
			this.falling=true;
			soundJump.play();
		}
		// limit horizontal speed
		if (this.V.x < -this.MAXSPEED){  
			this.V.x = -this.MAXSPEED;
		}
		if (this.V.x > this.MAXSPEED){
			this.V.x = this.MAXSPEED;
		}
		if (this.V.y > 3/7*this.h){
			this.V.y = 3/7*this.h;
		}
		
		//update x position
		this.P.x += this.V.x;
		//check x collision 
		this.checkCollision(arr,this.V.x, 0); 
		//update y position
		this.falling=true;
		this.V.add(this.gravity);
		this.P.y += this.V.y;
		//check y collision
		this.checkCollision(arr,0,this.V.y);  
		
		//decelerate.  TODO vary dec with different surfaces
		if( !keys[this.keyInputs[0]] && !keys[this.keyInputs[1]]){
			if(this.V.x > 0){
				this.V.x -= this.moveSpeed;
			}
			if(this.V.x < -0){
				this.V.x += this.moveSpeed;
			}
		}
	
		//dmg delay timer
		if (this.delay < 41){
			this.delay++;
		}	
	}
	
	//collision with map tiles that affect position.  check x and y separately in player.update.
	checkCollision(arr, Vx, Vy){  
		for(var i=0; i<arr.length; i++){
			//don't bother checking collision for blocks that are more than a few tiles away
			if(abs(arr[i].P.dist(this.P)) < 3*arr[i].w && arr[i].collide(this)){ 
				if(Vy > 0){
					this.V.y=0;
					this.falling=false;
					this.P.y=arr[i].P.y-this.h;  
				}
				if (arr[i].img === "mover" && !keys[this.keyInputs[0]] && !keys[this.keyInputs[1]]){
					this.V.x = arr[i].V.x*(1+this.moveSpeed);  //accounts for deceleration
				}
				//can jump through movers from below.
				if(Vy < 0 && arr[i].img !== "mover"){
					this.V.y=0;
					this.P.y=arr[i].P.y+arr[i].h;
				}
				if(Vx < 0 && arr[i].img !== "mover"){
					this.V.x=0;
					this.P.x=arr[i].P.x+arr[i].w;
				}
				if(Vx > 0 && arr[i].img !== "mover"){
					this.V.x=0;
					this.P.x=arr[i].P.x-this.w;
				}
			}
		}
	}
	draw() {  
		noStroke();
		fill(this.color);
		push();
		translate(this.P.x, this.P.y);
		rect(0,0,this.w,this.h,8);
		
		//eyes.  set height relative to width so size doesn't change while ducking
		fill(59, 255, 180);
		if( sin(radians(frameCount/2))>0 && sin(radians(frameCount/2))< 0.05 ) {
		ellipse(this.w/3.3,this.h/3,  this.w/3,this.w/15);
		ellipse(this.w/1.4,this.h/3,  this.w/3,this.w/15);
		}
		else {
		ellipse(this.w/3.5,this.h/3,  this.w/4,this.w/4.2);
		ellipse(this.w/1.4,this.h/3,  this.w/4,this.w/4.2);
		}
		fill(0, 0, 0);
		if (keys[this.keyInputs[0]]){ //(this.move[0]){//(keys[this.keyInputs[0]]){
			 ellipse(this.w/2.80,this.h/3,  this.w/14,this.w/14);
			 ellipse(this.w/1.25,this.h/3,  this.w/14,this.w/14);
		}
		else if (keys[this.keyInputs[1]]){ //(this.move[1]){//(keys[this.keyInputs[1]]){
			 ellipse(this.w/4.80,this.h/3,  this.w/14,this.w/14);
			 ellipse(this.w/1.55,this.h/3,  this.w/14,this.w/14);
		}
			else {
				ellipse(this.w/3.19,this.h/3,  this.w/14,this.w/14);
				ellipse(this.w/1.34,this.h/3,  this.w/14,this.w/14);
			}
		pop();    
	}
	stats(){
		noStroke();
		fill(255, 255, 255);
		textSize(height/25);
		textAlign(LEFT,CENTER);
		text("Health ", width/50,height/35);
		
		for(var i = 0; i< this.MAXHEALTH; i++){
			rect(width/50+i*21, height/17, 20, 10, 4);
		}
		fill(200, 50, 75);
		for(var i=0; i<this.health; i++){
			rect(width/50+i*21, height/17, 20, 10, 4);
		}
		//change to inventory slots with images 
		fill(255, 255, 255);
		textSize(height/25);
		text("Got Key?: ", 0.78*width,height/35);

		if(this.gotKey){
			text("Yes!",0.91*width,height/35);
		} else {
				text("NO", 0.91*width, height/35); 
				textSize(height/25);
				fill(255, 255, 255, 100*abs(sin(radians(1.5*frameCount))));
				text("Get the key !", 0.78*width, height/15);
				}
	}
}

class Block {  
	constructor(x,y,w,h,img,flip){  //pass image var, flip with 'H' or 'V'
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.img=img;
		this.flip = flip;
	}
	collide(obj){
		//rect(this.P.x, this.P.y, this.w, this.h);  character distance check
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
                this.P.y < obj.P.y + obj.h && this.P.y + this.h > obj.P.y;
	}
	draw() {
		push();
		if (this.flip === "H"){  //horizontal flip
			scale(-1.0,1.0)
			image(this.img, -this.P.x-this.w, this.P.y, this.w+1, this.h+1);
			}	
		else if (this.flip === "V"){  //vertical flip. 
			scale(1.0,-1.0)
			image(this.img, this.P.x, -this.P.y-this.h, this.w+1, this.h+1);
			}				
		else {
			image(this.img, this.P.x, this.P.y, this.w+1, this.h+1);  //overlap helps with spaces
		}	
		pop();
	}  
}
class Mover extends Block{
	constructor(x,y,w,h,img){
		super(x,y,w,h,img);
		this.V = createVector(1,0);
		this.img = "mover";  //needed for now for char position updates
		this.disp = floor(random(-75,75));  //so they don't all start at same P.x
		this.P.x += this.disp;
	}
	draw(){
		push();
		fill(50, 205, 235);
		stroke(200, 255, 255);
		strokeWeight(2);
		rect(this.P.x, this.P.y, this.w, this.h, 4);
		strokeWeight(1);
		noStroke();
		fill(0, 0, 50,100);
		rect(this.P.x, this.P.y+3/4*this.h, this.w, this.h/4, 4);
		fill(255, 255, 255, 125);
		rect(this.P.x, this.P.y, this.w, this.h/4, 4);
		pop();
		}
	update(player){ 
		if (this.disp > 3*player.w || this.disp < -3*player.w){
			this.V.x *= -1;
			this.P.x -= 2*this.V.x; //fixes turn around jitter
		}
		this.disp += this.V.x;
		this.P.add(this.V); 
	}
}
class Portal extends Block{
	constructor(x,y,w,h,img,flip){
		super(x,y,w,h,img,flip);
		this.collected=false;
	}
	update(player){
		if(this.collide(player) && player.gotKey){
			fadeColor=color(255, 255, 255, transparency);
			transparency+=10;
			if(transparency>255){
				this.collected=true;
			} 
		}else if(this.collide(player) && !player.gotKey){ 
			fill(0, 0, 0);
			textSize(15);
			textAlign(CENTER,CENTER);
			text("You need the key",this.P.x+this.w/2,this.P.y-this.h/2);
		}
	}
}
class Portkey extends Block{
	constructor(x,y,w,h,img,flip){
		super(x,y,w,h,img,flip);
		this.collected=false;
	}
	draw(player) {
		if(!player.gotKey){
			image(this.img, this.P.x, this.P.y, this.w, this.h);
		}
	}
	update(player){
		if(!player.gotKey && this.collide(player)){
			soundKey.play();
			this.collected=true;
			player.gotKey=true;
		}
	}
}
class Spike extends Block{
	constructor(x,y,w,h){
		super(x,y,w,h);
		this.jab;
		this.hurt;
	}
	collide(obj) {
		//rect(this.P.x, this.P.y, this.w, this.h); //checking dist from character when called
		var subX;
        if (this.P.y + this.jab < obj.P.y + obj.h && this.P.y + this.h > obj.P.y){
            subX =  this.w/2 * ( (this.P.y + this.h)-(obj.P.y + obj.h) ) / this.h;
            return  this.P.x + subX < obj.P.x + obj.w && 
                    this.P.x - subX + this.w > obj.P.x &&
                    this.P.y < obj.P.y + obj.h && 
                    this.P.y + this.h > obj.P.y;
        }
    }
	draw() {
		push();
		noStroke();
		this.jab = 2.5*abs(sin(radians(1/2*frameCount*2%100))*this.h/6);

		fill(212, 232, 255);
		triangle(this.P.x,this.P.y+this.h,
				this.P.x+this.w,this.P.y+this.h,
				this.P.x+this.w/2,this.P.y + this.jab);
		fill(22, 124, 171);
		triangle(this.P.x+this.w/2,this.P.y+this.h,
				this.P.x+this.w-this.w/15,this.P.y+this.h,
				this.P.x+this.w/2,this.P.y + this.jab);
		stroke(255, 255, 255);
		strokeWeight(2);
		line(this.P.x, this.P.y+this.h-1, 
			this.P.x+this.w/2, this.P.y+1+ this.jab);
		
		line(this.P.x+this.w/2, this.P.y+this.h-1, 
			this.P.x+this.w/2, this.P.y+2+ this.jab);
		strokeWeight(1);
		noStroke();
		pop();
	}
	update(player){
		if(abs(player.P.dist(this.P)) < 5/4*this.h && this.collide(player) && player.delay >40){ 
			this.hurt=true;
			transparency=150;  
			player.health--;
			player.delay = 0;
			soundSpike.play();
		}
		if(this.hurt){
			fadeColor=color(255, 0, 0,transparency);
			transparency-=15;
			if(transparency<0){
				transparency=0;
				fadeColor=color(255, 255, 255,transparency);
				this.hurt=false;
			}
		}
	}
}
class Heart extends Block{
	constructor(x,y,w,h,img,flip){
		super(x,y,w,h,img,flip);
		this.collected=false;
	}
	draw() {
		if (!this.collected){
			push();
			image(this.img, this.P.x, this.P.y, this.w, this.h);
			pop();
		}
	}
	update(player){
		if(!this.collected && player.health < player.MAXHEALTH && this.collide(player) ){
			soundHeart.play();
			player.health++;
			this.collected = true;	
		}
	}
}

class Lava{
	constructor(x,y,w,h, colorChar){
		this.P = createVector (x,y);
		this.w = w;
		this.h = h;
		if (colorChar === "l"){
			this.color= color(180, 0, 0);
		}
		if (colorChar === "p"){
			this.color= color(0, 120, 0);
		}
	}
	draw() {
		push();
		translate(this.P.x, this.P.y);
		fill(this.color);
		stroke(this.color);
		beginShape();

		var alt = 2.5;
		for (var i=0; i<11; i++){
			vertex(i*this.w/10, alt*sin(radians(1.5*frameCount)));
			alt*=-1;
		}
		vertex(this.w, this.h);
		vertex(0, this.h);
		vertex(0,-alt*sin(radians(1.5*frameCount)));
		endShape();
		pop();
		noStroke();
	}
}

//background/foreground objects.  
class Snowflake{
	constructor(player, lvW, lvH){
		this.lvW = lvW;
		this.lvH = lvH;
		this.player = player;
		this.P = createVector(random(width),random(height));
		this.V = createVector(random(-1,1),2.0);
		this.SF = random(0.3,1.5);
		this.w = this.h = 15;  //just for bounds check
		this.V.mult(this.SF);
	}
	update(){
		if(this.P.y <  -this.h){ 
			this.P.y = height + this.h;         
		}
		if(this.P.y > height + this.h){ 
			this.P.y = -this.h;         
		}
		if(this.P.x > width + this.w){ 
			this.P.x = -this.w;
		}
		if(this.P.x < -this.w){
			this.P.x = width + this.w;
		}
		this.P.add(this.V);
		
		//so falling objects don't move with char.  
		if (this.player.P.x + this.player.w/2 > width/2 &&
			this.player.P.x + this.player.w/2 < this.lvW-width/2){ 
			this.P.x-=this.player.V.x;  
		}
		if (this.player.P.y + this.player.h/2 < this.lvH-height/2) {
			this.P.y-=this.player.V.y;
		}
	}
	draw() {
		push();
		fill(255, 255, 255, 50+150*this.SF);
		ellipse(this.P.x, this.P.y, this.SF*random(2.5,4.5), this.SF*random(2.5,4.5));
		pop();
	}
}
class Raindrop extends Snowflake{
	constructor(player, lvW, lvH){
		super(player, lvW, lvH);
		this.V = createVector(4,10);
		this.SF = random(0.3,1.3);
	}
	draw() {
		stroke(186, 219, 255, 25+150*this.SF);
		push();
		translate(this.P.x, this.P.y);
		line(0,0,this.V.x,this.V.y);
		pop();
	}
}
class Leaf extends Snowflake{
	constructor(player, lvW, lvH){
		super(player, lvW, lvH);
		this.V = createVector(random(-1,1), random(0.5, 1));
		this.SF = random(0.65,1.10);
		this.w = random(5, 10);
		this.h = random(5, 10);
		this.angle = 0;
		this.spinSpeed = random(1,5);
		this.R = random(150,230);
		this.G = random(50, 200);
		this.B = random(25, 50);
	}
	draw() {
		this.angle += this.spinSpeed; //updating spin here
		noStroke();
		fill(this.R, this.G, this.B);
		push();
		translate(this.P.x,this.P.y);
		rotate(radians(this.angle));
		ellipse(0,0,this.SF*this.w,this.SF*this.h);
		pop();
	}
}

class Hills {  
	constructor(arrPV, levelW, levelH, player, speed){ //lvW,H,player from objecthandler per level
		this.arrPV=arrPV;
		this.levelW = levelW;
		this.levelH = levelH;
		this.player = player;
		this.speed = speed;
		this.lake = false;
	}
	draw(color) {
		push();
		//parallax effect 
		if (this.player.P.x + this.player.w/2 > width/2 &&
			this.player.P.x + this.player.w/2 < this.levelW-width/2){ 
				translate(this.speed*(width/2-this.player.w/2-this.player.P.x),   0);
		}
		if (this.player.P.x + this.player.w/2 >= this.levelW-width/2) {
				translate(this.speed*(-this.levelW+width),   0);
		}        
		if (this.player.P.y + this.player.h/2 < this.levelH-height/2){
				translate(0,   this.speed*(this.levelH-height/2-this.player.h/2-this.player.P.y));
		}
		
		fill(color);
		beginShape();
		curveVertex(0, this.levelH);
		curveVertex(0, this.levelH);
		curveVertex(0, this.arrPV[0].y); 
		
			for (var i = 0; i < this.arrPV.length; i++){
				curveVertex(this.arrPV[i].x,  this.arrPV[i].y); 
			}
			
		curveVertex(this.levelW, this.arrPV[this.arrPV.length-1].y);
		curveVertex(this.levelW, this.levelH);
		curveVertex(this.levelW, this.levelH);
		endShape(CLOSE); 
		
		//draw a lake effect if it has been set to true.
		if (this.lake){
			fill(30, 100, 150);
			rect(this.arrPV[0].x, this.arrPV[0].y+66, this.levelW, this.levelH-this.arrPV[0].y);
			fill(150, 190, 220, 60);  //was (color, 60), but alpha not working with argument color pass
				for (var i = 1; i<6; i++){
					rect(0, this.arrPV[0].y+66, this.levelW, height/(5+5*i*i));
				}
		}
		pop();
	}
}

//decorative images with draw method or sprite but no updates
class Deco{
	constructor(x, y, w, h, img, z){
		this.P = createVector(x,y);
		this.w=w;
		this.h=h;
		this.img = img; 
		this.z_Index = z;
	}
	draw(){
		image(this.img, this.P.x, this.P.y, this.w+1, this.h);
	}
}	
class Glass extends Deco{
	constructor(x, y, w, h, img, z){
		super(x, y, w, h, img, z);
	}	
	draw(){
		push();
		translate(this.P.x, this.P.y);
		noStroke();
		fill(100,150,200);
		rect(0,0,this.w,this.h);
		for (var r = 0; r < 2; r++){  //pane row position
			for (var c = 0; c < 2; c++){  //pane col position
				noStroke();
				fill(0, 0, 30, 125);
				rect(13/50*this.w+c*this.w/2, 13/50*this.h+r*this.h/2, 1/5*this.w, 1/5*this.h);
				fill(245, 245, 255, 200);
				rect(1/25*this.w+c*this.w/2, 1/25*this.h+r*this.h/2, 1/5*this.w, 1/5*this.h);
				stroke(204, 238, 255);
					line(this.w/2*c, 0,  this.w/2*c, this.h);
			}
			line(0, this.w/2*r,  this.w, this.w/2*r);
		}
		line(this.w, 0,  this.w, this.h);
		line(0, this.h,  this.w, this.h);
		noStroke();
		pop();
	}
}
class Water extends Deco{
	constructor(x, y, w, h, img, z){
		super(x, y, w, h, img, z);
	}	
	draw(){
		var waveH = this.w/12.5;
		push();

		translate(this.P.x, this.P.y);
		fill(76, 117, 222,150);
		rect(0,0,this.w,this.h);
		fill(230, 245, 255);
		beginShape(); 
		
		curveVertex(0,0);
		curveVertex(0,0);
		curveVertex(this.w/2, waveH*sin(radians(frameCount))); 
		
		curveVertex(this.w,0);
		waveH = -waveH;
			
		curveVertex(this.w,0);
		curveVertex(this.w/2, waveH*sin(radians(frameCount))); 
		
		curveVertex(0,0);
		curveVertex(0,0);
		this.waveH = -waveH;
		
		endShape();
		pop();
		strokeWeight(1);
	}
}	