//initializing variables
var sky, skyImg;
var bird,birdImg;
var pipesGroup,pipe1,pipe2,pipe1Img,pipe2Img,randY,currentPipe;
var ground;
var score = 0;
var GAMESTATE = "START";
var loss = false;
var numFont;

function preload(){
    //loading images
    skyImg = loadImage("background.png");
    birdImg = loadAnimation("bird1.png","bird2.png","bird3.png");
    
    pipe1Img = loadImage("pipe1.png");
    pipe2Img = loadImage("pipe2.png");

    numFont = loadFont("birdfont2.ttf");
}

function setup() {
    createCanvas(800,400);

    //creating sky
    sky = createSprite(640,200);
    sky.addImage("background",skyImg);
    sky.scale = 2.4;
    sky.velocityX = -1;

    //creating bird
    bird = createSprite(100,250,50,50);
    bird.addAnimation("bird",birdImg);
    bird.scale = 0.2;
    bird.setCollider("circle",0,0,80);

    //creating ground
    ground = createSprite(0,450,800,100);
    ground.visible = false;

    //creating pipes group
    pipesGroup = new Group();

    //DELETE WHEN DONE!!!
    // GAMESTATE = "PLAY";
    // ground.debug = true;
    // bird.debug=true;

}

function draw() {
    background(200);

    //game state if condition
    if(GAMESTATE == "PLAY") {

        //jump mechanic when pressing space or tapping the screen on mobile
        if(keyWentDown("SPACE") || touches[0]) {
            bird.velocityY = -9;
            touches = [];
        }


        //increasing score
        
        if(pipesGroup[0] && pipesGroup[0].position.x == bird.position.x) {
            score++;
        }

        //gravity
        bird.velocityY += 0.75;


        // pipes spawning at random intervals
        if(frameCount%150 ==0) {
            createPipes();
        }

        //lose condition
        loss = bird.collide(ground) || 
               bird.collide(pipesGroup) || 
                   (pipesGroup[0] &&  
                    pipesGroup[0].position.x <= 150 && 
                    bird.position.y < 0);
        if(loss) {
            lose();
        }

    } else if (GAMESTATE == 'END') {

        //stops the bird from sliding when it hits the ground
        if(bird.collide(ground) || bird.collide(pipesGroup)) {
            bird.velocityX = 0;
        }
        // bird.collide(ground)
        //gravity + pipes collision
        bird.velocityY += 0.75;
        // bird.collide(pipesGroup);

        if(bird.position.x <= 20) {
            bird.velocityX = 0;
        }

    
        //resetting game
        if (keyWentDown("SPACE")) {
            resetGame();
        }
    } else if (GAMESTATE == 'START') {


        if(bird.position.y > 210) {
            bird.velocityY -= 0.5;
        }
        if(bird.position.y < 190) {
            bird.velocityY += 0.5;
        }

        if(keyWentDown("SPACE")) {
            GAMESTATE = "PLAY";
        }
    }


    //infinite scrolling of background
    if(sky.x < width/2) {
        sky.x = 640;
    }
    
    drawSprites();

    //display score
    textAlign(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(10);
    textSize(75);
    textFont(numFont);
    text(score,400,100);

    //display gameover if loss
    if(GAMESTATE=='END') {
        text('GAMEOVER',400,200);
    } else if (GAMESTATE == 'START') {
        text('PRESS SPACE TO START',400,200);
    }
}

function lose() {
    GAMESTATE = 'END';
    sky.velocityX = 0;
    pipesGroup.setVelocityXEach(0);
    pipesGroup.setLifetimeEach(-1);
}

function resetGame() {
    GAMESTATE = 'START';
    bird.y = 250;
    bird.x = 100;
    sky.velocityX = -1;
    pipesGroup.destroyEach();
    score = 0;
    bird.velocityY = 0.5;
    bird.velocityX = 0;
}

function createPipes() {
    // random value for the height of the pipes
    randY = Math.round(random(100,300));

    //making pipe 1 
    pipe1 = createSprite(850,randY+220);
    pipe1.addImage("pipe1",pipe1Img);
    pipe1.scale = 0.2;
    pipe1.velocityX = -2;
    pipe1.lifetime = 450;
    pipe1.setCollider("rectangle",0,0,240,1700);

    //making pipe 2
    pipe2 = createSprite(850,randY-220);
    pipe2.velocityX = -2;
    pipe2.scale=0.2;
    pipe2.addImage("pipe2",pipe2Img);
    pipe2.lifetime = 450;
    pipe2.setCollider("rectangle",0,0,240,1700);

    //adding to pipes group
    pipesGroup.add(pipe1);
    pipesGroup.add(pipe2);

    if(pipesGroup.length < 3) {
        currentPipe = 0
    }

    //DELETE WHEN DONE
    // pipe1.debug = true;
    // pipe2.debug = true;
}