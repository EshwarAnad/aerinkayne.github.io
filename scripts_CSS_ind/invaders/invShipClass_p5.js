//ship class  
class Ship{
	constructor(x,y,w,h){
	this.P = createVector(x,y); 
	this.V = createVector(0,0);
	this.w = w;
	this.h = h;
	this.move = [false,false,false,false];  //R,L,U,D {R: false, L: false, U: false, D: false} move.keys();
	this.acc = 1.0;
	this.dec = 0.25;
	this.MAXSP = 4.5;
	this.thruster = 0; 
	this.gunType = startLaser;
	this.shots = [];
	this.firing = false;
	this.firingDelay = 0;
	this.modifyLocation = 0; //0 or 1.  used as a multiplier for some image alterations
	this.shotDirection = -1;  //-1 for player ship, 1 for enemy ships
	this.powerLevel = 0;  //zero based
	this.powerLevelMAX = 2;
	this.healthMAX = 2000;  //for testing
	this.health = this.healthMAX;  
	this.score = 0;
	this.dmgDelay = 30;
	this.dmgDelayTimer = this.dmgDelay;
	this.dmgTaken = sEnmDestr;
	this.dest = sShipDestr;
	}

	spreadShot(number){
		let angleRadians = radians(15);
		let vMag = this.gunType.speed;
		let a = angleRadians/(number-1);
		let a0 = PI/2-angleRadians/2;
		let lastIndex = this.shots.length-1;
		for (let i = 0; i < number; i++){
			this.shots[lastIndex - i].V.x = cos(a0 + i*a);
			this.shots[lastIndex - i].V.y = sin(a0 + i*a)*this.shotDirection;
			this.shots[lastIndex - i].V.setMag(vMag);
		}
	}

	shoot(){ 
		let P = createVector(this.P.x + this.w/2 - this.gunType.w/2, this.P.y + this.h*this.modifyLocation);
		let V = createVector(0, this.gunType.speed*this.shotDirection);

		P.x -= this.w/8*this.powerLevel;
		for (let p = 0; p <= this.powerLevel; p++){
			for (let i=0; i< this.gunType.pushNumber; i++){
				this.shots.push(new WeaponShot(this, P, V));
			}
			if(this.gunType === spreader){
				this.spreadShot(this.gunType.pushNumber);
			}
			P.x += this.w/4;
		}	
	}
	healthBar(){
		noStroke();
		fill(225,225,255);
		textAlign(LEFT);
		text("score: " + this.score, width-65, height-20);
		
		fill(0,0,0);
		stroke(150,175,255);
		rect(width-65, height-10, 51, 7,2);
		noStroke();
		fill(155,0,40);
		//or map() will hate you
		if (this.health < 0){
			this.health = 0;
		}
		rect(width-64, height-9, map(this.health,0,this.healthMAX,0,50), 5,2);
	}
	draw(){
		push();
		translate(this.P.x, this.P.y);

		//glow effects
		noStroke();
		
		fill(0, 62, 156, 30+60*abs(sin(radians(frameCount))));
		//animate thruster with UP
		if (this.move[2]){
			this.thruster = this.h/3;
		} else {this.thruster = 0;}
		rect(this.w/2-14/40*this.w, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 25);
		rect(this.w/2-2*this.w/50, this.h-this.h/8, this.w/2.5, this.h/2+this.thruster, 25);
		
		fill(0, 62, 156, 25+50*abs(sin(radians(frameCount))));
		rect(this.w/2-12/40*this.w, this.h-this.h/10, this.w/3, this.h/3+2/3*this.thruster, 25);
		rect(this.w/2-1/40*this.w, this.h-this.h/10, this.w/3, this.h/3+2/3*this.thruster, 25);
		
		fill(0, 166, 255, 3*this.thruster+85+155*abs(sin(radians(frameCount))));
		ellipse(this.w/2-this.w/8, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		ellipse(this.w/2+this.w/7, this.h+this.h/50, this.w/5, this.h/5+this.thruster);
		
		fill(184, 230, 255);
		ellipse(this.w/2-this.w/8, this.h-this.h/50, this.w/9.5, this.h/10+this.thruster/2); //left
		ellipse(this.w/2+this.w/7, this.h-this.h/50, this.w/9.5, this.h/10+this.thruster/2);
		
		//2020: wut.  it's on the list of fixes
		//adjust h+ the aprox fraction of image height not associated with the image hitbox 
		if (this.firing){
			image(sprShipF, this.w/2, this.h/2, this.w, this.h+ .2275*this.h);
		}
		else {
			image(sprShip1, this.w/2, this.h/2, this.w, this.h+ .2275*this.h);
		}
		pop();	
	}	
	
	playerShipDestroyed(){
		this.dest.play();
		//remove remaining shots, enemies and powerups
		if (bads.length > 0){
			for (let i = bads.length-1; i >=0; i--){
				for (let s = bads[i].shots.length-1; s>=0; s--){
					bads[i].shots.splice(s,1);
				}
				bads.splice(i,1);
			}
		}			
		if (pups.length > 0){
			for (let i = pups.length-1; i >= 0; i--){
				pups.splice(i,1);
			}
		}
		invGame.gameState = "gameOver";
	}
	
	damageTaken(damage){  
		this.health -= damage;
		this.dmgDelayTimer = 0;
		this.dmgTaken.play();	
	}
	
	update(){
		//constrain
		this.P.x= constrain(this.P.x, 0, levelW-this.w);
		this.P.y= constrain(this.P.y, 0, levelH-this.h);
		//accelerate according to speed and arrow keys specified in sketch keypressed function
		if (this.move[0]){this.V.x+=this.acc;}
		if (this.move[1]){this.V.x-=this.acc;}
		if (this.move[2]){this.V.y-=this.acc;}
		if (this.move[3]){this.V.y+=this.acc;}
		this.V.limit(this.MAXSP);
		this.P.add(this.V);

		//slow down if key not pressed
		if (!this.move[0] && this.V.x < 0){this.V.x+=this.dec;}
		if (!this.move[1] && this.V.x > 0){this.V.x-=this.dec;}
		if (!this.move[2] && this.V.y > 0){this.V.y-=this.dec;}
		if (!this.move[3] && this.V.y < 0){this.V.y+=this.dec;}
		//keeps ship from sliding 
		if (!this.move[0] && !this.move[1] && this.V.x < 0.5 && this.V.x > -0.5){this.V.x=0;}
		if (!this.move[2] && !this.move[3] && this.V.y < 0.5 && this.V.y > -0.5){this.V.y=0;}
		
		//limit firing rate
		if (this.firingDelay <= this.gunType.rechargeTime){ //weaponRecharge){
			this.firingDelay++;  
		}  
		if (this.firingDelay > this.gunType.rechargeTime){
			this.firing=false;
		}
		
		//fire gun
		if (mouseIsPressed && !this.firing && this.health > 0){ 
			this.gunType.weaponSound.play(); 
			this.shoot(); 
			this.firing = true;
			this.firingDelay = 0;
		}
		
		//update shots fired
		if (this.shots.length > 0){
			for (let i = this.shots.length-1; i >= 0; i--){
				this.shots[i].draw(this);
				if(invGame.gameState==="inGame"){
					this.shots[i].update(this);
				}
				if (this.shots[i].P.y < -this.shots[i].h){ 
					this.shots.splice(i,1);
				}
			}
		}

		//dmgDelay update
		this.dmgDelayTimer++
		
		//end game if no health remaining
		if(this.health <= 0){
			this.playerShipDestroyed()
		}
	}
}

