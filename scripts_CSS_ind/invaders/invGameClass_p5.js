class Game{
	constructor(){
		this.timeRef = new Date();
		this.timeNow = 0;
		this.timer = 0;
		this.gameState = "gameStart"; //"testing"; //"gameStart";
		this.currentWave = 0;
		this.spawned = [false, false, false, false, false, false];
		this.waveTimer = 300;  //tenths of a second.
		this.waveMap = [
			[	//0
				"221122",  //game.waveMap[currentWave===0].length === 3
				"111111",  //game.waveMap[currentWave===0][row].length === 8
				"121121"
			],
			
			[	//1
				"222222",
				"212121",
				"121212"
			],
			
			[	//2
				"122221",
				"112211",
				"233332"
			],
			
			[	//3
				"242242",
				"213312",
				"343343"
			],
			
			[	//4
				"324423",
				"343243",
				"434343"
			],
			
			[	//5
				"5"
			]
		];
	}
	manageScenes(){
		if (this.gameState === "gameStart"){
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update();
			btnStart.draw(color(0,150,200));
		}
		else if (this.gameState === "inGame"){
			gameCamera(ship);
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update(); 
			this.updateTimer();
			this.waveCheck();

			ship.update();
			//ship.animate();  
			ship.draw();
		
			for (var i = bads.length-1; i >=0 ; i--){
				bads[i].update();
				if(onScreen(bads[i], ship)){
					bads[i].draw();
				}
				//do not remove enm from array until its possible shots are also removed.
				if (bads[i].health<=0 && bads[i].shots.length===0){bads.splice(i,1);} 
			}
			//update powerups and remove them if they go offscreen(Y).
			if (pups.length>0){
				for (var i = pups.length-1; i >=0 ; i--){
					pups[i].draw();
					pups[i].update();
					//splice pup out if it goes offscreen or if it's picked up
					if (pups[i].P.y > height+100){
						pups.splice(i,1);
					}
					else if (collide(pups[i], ship)){
						pups[i].modShip();
						sPup.play();
						pups.splice(i,1);
					}
				}
			}
			resetMatrix();
			btnPause.draw(color(0,175,150));
			ship.healthBar();	
		}
		else if (this.gameState === "gamePaused"){
			gameCamera(ship);
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update();
			
			if (ship.shots.length>0){
					for (var s = ship.shots.length-1; s >= 0; s--){
						ship.shots[s].draw();
					}
			}
			ship.draw();

			for (var i = bads.length-1; i >=0 ; i--){
				if(onScreen(bads[i], ship)){
					bads[i].draw();
					bads[i].update();
				}	
			}
			resetMatrix();
			btnPause.draw(color(0,125,100));
			ship.healthBar();	
		}
		else if (this.gameState === "gameOver"){
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update(); 
			btnStart.draw(color(0,150,200));	
		}
		else if (this.gameState === "testing"){
			//original drawings, screenshot for sprite images
			background(2,0,10);
			this.updateTimer();
			
			ship.update(); 
			ship.draw();
			
			if(bads.length === 0){
				bads.push(new Enemy(0, 0, "ship4"));
				bads[0].w*=3;
				bads[0].h*=3;
				bads[0].P = createVector(width/2-bads[0].w/2, height/2-bads[0].h/2);
			}
		}
	}
	waveCheck(){
		if (!this.spawned[this.currentWave] && this.currentWave < this.waveMap.length && 
							this.timer > this.currentWave*this.waveTimer){  //  1/10sec: 0,300,600,900,1200,1500
			this.spawnBads(this.currentWave); 
			this.spawned[this.currentWave] = true; 
			this.currentWave++;
			sEnmSpawn.play();
		}
	}
	updateTimer(){
		this.timeNow = new Date();
		//if dif between now and ref is 1 sec, timer++ and reset ref point
		if (this.timeNow - this.timeRef >= 100){
			this.timer++;
			this.timeRef = new Date();
		}
	}
	spawnBads(wave){
		for(var row=0; row<this.waveMap[wave].length; row++){  //0-2
			for(var col=0; col<this.waveMap[wave][row].length; col++){  //0-5
				var s=this.waveMap[wave][row][col];  //character in game.waveMap array
			
			if(s==="1"){bads.push(new Enemy(50+60*col, 50+50*row, "ship1"));}
			else if(s==="2"){bads.push(new Enemy(50+60*col, 50+50*row, "ship2"));}
			else if(s==="3"){bads.push(new Enemy(50+60*col, 50+50*row, "ship3"));}
			else if(s==="4"){bads.push(new Enemy(50+60*col, 50+50*row, "ship4"));}
			else if(s==="5"){bads.push(new Enemy(50+60*col, 50+50*row, "ship5"));}
			else {console.log("unexpected char in game waveMap: " + s);}
			}
		}
		if (wave!==this.waveMap.length-1){ //if it's not the final wave
			var L = this.waveMap[wave][0].length;  //#bads per row, eg 6
			var r = ceil(random(0,L));  //random int based on bads per row, eg 1-6

			bads[bads.length-r].drop = true; 
		}
	}
}