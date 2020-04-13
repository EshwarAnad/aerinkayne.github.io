const scrWidth = 600;
const scrHeight = 400;

const levelData = [
    
    {   //0 winter
        levelMap: 
        [
            "                                                                                                                        ",
            "0h                                       		                                                                         ",
            "0C 0d                                                                                                                   ",
            "                                                                                                                        ",
            "         0c 0C 0C 0C 0C 0C 0d                                                                                           ",
            "                                                                                                                        ",
            "0C 0d                                                                                                                   ",  
            "                                                            02                                                          ",
            "               0m                                           01                                                          ",    
            "            0^       0^                                     01                                                          ",     
            "         02 02 02 02 02 02       02 02       02             01                                     0^    0^       07    ",    
            "02                                              02       02 01                            02 02 02 02 02 02 02 02 02 02 ",    
            "                                                01       0v 01                   02 02                                  ",    
            "   02                                           01 02       01                                                          ",    
            "         02 02                                  01       09 01             02                                           ",    
            "                                                01 02 02 02 01 02 02 02 02 01                                           ",    
            "                  02 02                                                             02 02                               ",    
            "                                                                                                                        ",    
            "         02 02 02                                                                            02 02                      ",    
            "                                                                                                                        ",    
            "02                                                                                                       02 02          ",    
            "   02 02 02                                                                                     02 02                   ",    
            "   0v                                                                                                                02 ",    
            "00                02                                                    0m                02                            ",    
            "            02          02             0m             02 02                               01                   02       ",    
            "            01 0^                                     01 01                         02 02 01 0h    0^    0^             ",    
            "02 02 0L 02 01 02 02 02 02 02 0L 0L 0L 0L 0L 0L 0L 0L 01 01 0L 0L 0L 0L 0L 0L 0L 0L 01 01 01 02 02 02 02 02 02 02 02 02 "  
        ],
        skyStart: [82,149,204],
        skyEnd: [250, 200, 255],
        music: undefined,   //assign in sketch preload
        levelEffect: "snow",
        numBGeffects: 140,
        numFGeffects: 15  
    },


    //***************************************************************************************************/


    {   //spring
        levelMap: 
        [ 	//03 rocks  04 rocks w grass   05 dirt   06 dirt w grass
            "                                                   0F 0F 0F 0f 0F 0F 0f 0f       07    0f                                              ",  
            "                                             04 04 04 04 04 04 04 04 04 04 04 04 04 04 04                                              ",  
            "                     0c 0C 0C 0C 0d                                                                                                    ",
            "0f 0f 0f                                                                                                                               ",
            "04 04 04 04                                                                                                                            ",
            "03 03 03 03 04                                                                                                                      0h ",
            "                           0m                                                    0c 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C ",
            "                                       0c 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0d                                                    ",
            "                                                                                                                                       ",
            "                           0m                                                                                                          ",
            "                                                                                                                                       ",
            "               0m                                                                                                                      ",
            "                                                                                                      0^    0^                         ",
            "0C 0C 0d                               0^                0c 0d             0c 0d                   0c 0C 0C 0C 0d                      ",
            "            0^       0^          0c 0C 0C 0C 0d                                        0c 0d                      0c 0d             0f ",
            "         0c 0C 0C 0C 0C 0d                                                                                                          06 ",
            "                                                                                                                     0F    0f          ",
            "                                                                                 0^ 0f                            06 06 06 06          ",
            "                                                                              06 06 06                                              0h ",
            "                                                                        0^    05 05 05                                              06 ",
            "                                                0F                   06 06 06 05 05 05                                           06 05 ",
            "0F    0f 00 0f 0F                0^ 0f          06 06             0f 05 05 05 05                                           0F    05 05 ", 
            "06 06 06 06 06 06 06          06 06 06                         06 06 05 05 05 05                      0m                   06 06 05 05 ", 
            "05 05 05 05 05 05 05                                           05 05 05 09                                                 05 05 05 05 ", 
            "05 05 05 05 05 05 05 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 06 06 06 06 06 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 05 05 05 05 "
        ],
        skyStart: [70,110,120],
        skyEnd: [242,252,255],
        music: undefined,   //assign in sketch preload
        levelEffect: "rain",
        numBGeffects: 120,
        numFGeffects: 15
    },


    //***************************************************************************************************/


    {   //summer
        levelMap:
        [	//03 10 rocks   04 11 rocks w grass
            "                                                                                          ",  
            "                                                                                       07 ",
            "                                                                              0c 0C 0C 0C ",
            "                                                         0c 0C 0C 0C 0d                   ",
            "                                                                                          ",
            "                              0c 0C 0C 0C 0C 0C 0d                                        ", 
            "                                                                                          ",
            "            0m                                                                            ",
            "   0h                                                                                     ",
            "04 04 04                                                                                  ",
            "         11                                                                               ",
            "                        0m                                                                ",
            "                                 0F                         0e 0E 0e 0E 0e 0E 0e 0E 0e 0E ",
            "                              04 04                         0e 0g 0e 0g 0e 0g 0e 0g 0e 0g ",
            "                                             04             0e 0E 0e 0E 0e 0E 0e 0E 0e 0E ",
            "                                             10 0w 0w 0w 0w 0B 0B 0B 0B 0B 0B 0B 0B 0B 0B ", 
            "00                                        04 03 11 11 11 04 11 04 11 04 04 04 11 04 04 11 ",
            "   0f       0F                   0^ 11                                        0v          ",
            "04 04 11 11 11 04          04 11 11                                                    09 ",
            "                        04                            0f 0^       0^                0f 11 ",
            "                                                      04 04 11 11 04 11       11 04 04 10 ",
            "                  11                                                                   03 ",
            "                     04                0m                                              03 ",
            "0h       0^ 0^          0f 0F                                                          10 ",
            "04 11 11 04 04 11 11 11 04 11 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 0L 03 "
        ],
        skyStart: [150, 205, 255],
        skyEnd: [255, 237, 244],
        music: undefined,   //assign in sketch preload
        levelEffect: "rain",
        numBGeffects: 1,
        numFGeffects: 1
    },


    //***************************************************************************************************/


    {   //fall
        levelMap:
        [   //12, 13 leaves.  05, 14 dirt
            "                                                                        ",
            "                                                                        ",
            "                                                                     07 ",
            "0h          0c 0C 0C 0C 0d       0c 0C 0d          0c 0C 0C 0C 0C 0C 0C ",
            "13                                                                      ",
            "                                                                        ",
            "            0m                                                          ",
            "0p                                                                      ",
            "12          13          12                12       13 12                ",
            "14                               0p    12    0^ 0^       13             ",
            "05                            12 13 13 05 12 12 13 13 12 dF 12 13       ",
            "14             12          12                                        12 ",
            "dF       12                05    09                               12    ",
            "05       05             12 05 12 12 12 13       12 0^ 12 13 0^          ",
            "05    13 05             14    00                   12       12 13 13 12 ",
            "14       14 0^    0^ 12 05          0p                                  ",
            "05 12    05 12 13 12 05 14 12 13 13 12 12 12 13 13 12 12 12             ",
            "         05                                                             ",
            "      12                                        12    13    12          ",
            "                  0^                         0^    0^    0^    0^    0p ",
            "12 13 12 12 13 13 12 12 12 0L 0L 0L 12 12 13 13 12 12 13 12 12 12 13 12 "
        ],
        skyStart: [45, 50, 90],
        skyEnd: [255, 180, 200],
        music: undefined,   //assign in sketch preload
        levelEffect: "leaf",
        numBGeffects: 30,
        numFGeffects: 5
    },

    //end
    {
        levelMap: ["1"]
    }

]




//************************ buttons **************************/

const btnStart1 = {
	x: 8.62*scrWidth/10, 
	y: 8.5*scrHeight/10,
	w: scrWidth/15,
    h: scrHeight/15,
    r: 3,
	txt: "➤",
	txtSize: 16,
	txtColor: [200,255,255],
    btnColor: [0,75,50],
    borderColor: [0, 0, 0],
	onClick: ()=> {
		game.gameState = "gameStart";
    },
    onHover: function() {
        this.borderColor = color(255,255,255);
        this.txtColor = [225,255,255];
    },
    offHover: function() {
        this.borderColor = [0, 0, 0];
        this.txtColor = [180,255,255];
    }
}

const pause1 = { 
    x: 1.75*scrWidth/10,               
	y: scrHeight/100,              
	w: scrWidth/18, 
    h: scrHeight/25,
    r: 2,               
    txt: "❚❚",
    txtSize: 12,    
    btnColor: [50,175,150],
    txtColor: [200,255,255], 
    onClick: function(){
        (!game.paused) ? game.paused = true : game.paused = false;
        (!game.paused) ? this.txt = "❚❚" : this.txt =  "➤";
    }
}
const continue1 = {
	x: scrWidth/2-3*scrWidth/20,               
	y: scrHeight/2,              
	w: scrWidth/8, 
    h: scrHeight/15,
    r: 8,               
	txt: "continue",    
    btnColor: [75,200,255], 
    onClick: function(){
         game.clickToContinue();
    }
}
const restart1 = {
	x: scrWidth/2 + scrWidth/20,               
	y: scrHeight/2,               
	w: scrWidth/8,
    h: scrHeight/15,
    r: 1,               
	txt: "Restart",    
    btnColor: [255,75,110], 
    onClick: function(){
        game.removeMap(game.mapTiles); 
        transparency=0;
        canvasOverlay=color(255, 255, 255,transparency);
        game = new Game();
   }
}

const btnLevelSelect = {
	x: 0,
	y: 0,
	w: scrWidth/3.5,
    h: scrHeight/3.1,
    r: 2,
    txtSize: 18,
	onClick: function() {
        game.setLevel(this.accessLevel);
        btnLevels.forEach(btn=> {
            btn.btnColor = [0,0,0];
            btn.selected = false;
        });
        this.selected = true;
        this.btnColor = [255,255,255];
    },
    onHover: function() {
        this.overlayAlpha = 0;
        textAlign(CENTER,CENTER);
        textSize(this.txtSize);
        fill(this.txtColor);
        text(
`Selecting this will
 take you to ${this.season}`,this.P.x+this.w/2, this.P.y+this.h/2);
    },
    offHover: function() {
        if (!this.selected){
            this.overlayAlpha = 100;
        } 
    }
}
