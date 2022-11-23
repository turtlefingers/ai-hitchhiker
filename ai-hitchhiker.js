

let model,maxPredictions;
// let detector;

async function ai_init() {
    console.clear();
    console.log("! 인공지능을 연결합니다.");
  
    // teachable machine
    const modelURL = 모델주소 + "model.json";
    const metadataURL = 모델주소 + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
  
    // movenet
    // const detectorConfig = {
    //   modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    // };
    // detector = await poseDetection.createDetector(
    //   poseDetection.SupportedModels.PoseNet,
    //   detectorConfig
    // );
  
   net = await posenet.load();

    console.log("! 인공지능 모델을 불러왔습니다.");
    window.requestAnimationFrame(anim);
}


async function anim(timestamp) {
    // console.log("loop");
    await predict();
    await getPoses();
    window.requestAnimationFrame(anim);
}


// teachablemachine
async function predict() {
  if(video && video.elt && video.loadedmetadata){
    // console.log("predict");
    const { pose, posenetOutput } = await model.estimatePose(video.elt);
    const prediction = await model.predict(posenetOutput);
    let best;
    for(let pred of prediction){
      if(!best)best = pred;
      else if(pred.probability > best.probability)best = pred;
    }
    AI분류 = best.className;
    // _poses = [{pose}];
    // if(!poses.length>0)console.log(_poses);
    // poses = _poses;
  }
}

// async function getPoses() {
//   if(detector){
//     let _poses = await detector.estimatePoses(video.elt);
//     console.loses", _poses);
//   }
// }

const scaleFactor = 0.50;
const flipHorizontal = false;
const outputStride = 16;
let net;
let 관절 = [];
for(let i=0; i<17; i++){
  관절[i] = {x:0,y:0};
}
async function getPoses(){

  if(video && video.elt && video.loadedmetadata && net){
    
    _poses = 기본설정.멀티포즈 ? await net.estimateMultiplePoses(video.elt, scaleFactor, flipHorizontal, outputStride) : [ await net.estimateSinglePose(video.elt, scaleFactor, flipHorizontal, outputStride)];

    if(true /*poses.length == 0*/){
      poses = [];
      if(_poses.length>0){
        관절 = _poses[0].keypoints;
      }
      for(const pose of _poses){
        poses.push({pose});
      }
    }
    // else{
    //   if(_poses.length>0){
    //     let keypoints = _poses[0].keypoints;
    //     for(let i=0; i<keypoints.length; i++){
    //       if(keypoints[i].score > 0.2)관절[i] = keypoints[i];
    //     }
    //   }
    //   for(let i=0; i<_poses.length; i++){
    //     let _pose = _poses[i];
    //     if(poses[i] == undefined)poses[i] = {pose:_pose};
    //     else{
    //       let pose = poses[i].pose;
    //       let keypoints = _poses[i].keypoints;
    //       for(let i=0; i<keypoints.length; i++){
    //         if(keypoints[i].score > 0.2)pose.keypoints[i] = keypoints[i];
    //       }
    //     }
    //   }
    //   if(poses.length > _poses.length)poses.splice(_poses.length,poses.length - _poses.length);
    // }
  }
}

posenet.load().then(function(net) {
        // posenet model loaded
  console.log("posenet loaded");
});

function drawPoints(points) {
  for (let i = 0; i < points.length; i += 1) {
    push();
      translate(points[i].position.x, points[i].position.y);
      fill(255);
      ellipse(0,0, 8, 8);
      textAlign(CENTER,BOTTOM);
      textSize(15);
      text(i,0,-5);
    pop();
  }
}

function getAllPoints(pose) {
  let points = [];
  if(pose){
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      const keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        points.push({
          position: new p5.Vector(keypoint.position.x, keypoint.position.y)
        });
      }
    }
  }
  return points;
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i += 1) {
    const pose = poses[i].pose;
    if(pose){
      for (let j = 0; j < pose.keypoints.length; j += 1) {
        const keypoint = pose.keypoints[j];
        if (keypoint.score > 0.2) {
          ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
      }
    }
  }
}

var bgSat = true;
var strokeSat = false;
var fillSat = true;

// Controller
var Settings = function() {
  this.관절표시 = true;
  this.격자 = false;
  this.좌우반전 = false;
  this.배경색 = "#000000";
  this.배경색_투명도 = 0;
  this.정보출력 = true;
  this.멀티포즈 = true;
};

var 기본설정 = new Settings();
var gui = new dat.GUI();
let f1 = gui.addFolder("기본설정");
f1.add(기본설정, '관절표시').listen();
f1.add(기본설정, '격자').listen();
f1.add(기본설정, '좌우반전').listen();
f1.addColor(기본설정, '배경색').listen();
f1.add(기본설정, '배경색_투명도', 0, 255).step(1).listen();
f1.add(기본설정, '정보출력').listen();
f1.add(기본설정, '멀티포즈').listen();

// Controller
var ParticleSetting = function() {
  this.활성화 = false;
  this.생성부위 = "전체";
  this.지속시간 = 1;
  this.중력 = 0;
  this.생성위치흐트림 = 1;
  this.난기류 = 0.2;
  this.빈도 = 1;
};
var 입자설정 = new ParticleSetting();

let f6 = gui.addFolder("입자설정");
f6.add(입자설정, '지속시간', 1, 60).step(0.1).listen();
f6.add(입자설정, '중력', -1, 1).step(0.01).listen();
f6.add(입자설정, '생성위치흐트림', 0, 1).step(0.01).listen();
f6.add(입자설정, '난기류', 0, 1).step(0.01).listen();
f6.add(입자설정, '빈도', 1, 60).step(1).listen();
var particles = [];

// Controller
var TrajectorySetting = function() {
  this.빈도 = 1;
  this.길이 = 100;
  this.궤적초기화 = 궤적초기화;
};
var 궤적설정 = new TrajectorySetting();

let f7 = gui.addFolder("궤적설정");
f7.add(궤적설정, '빈도', 1, 60).step(1).listen();
f7.add(궤적설정, '길이', 1, 500).step(1).listen();
f7.add(궤적설정, '궤적초기화');

const 이미지리스트 = ["고양이","똥","번개","토마토","하트"];

let trajectory = [];
궤적초기화();

function 궤적초기화(){
  trajectory = [];
  for(let i=0; i<17; i++){
    trajectory.push([]);
  }
}

function 디자인(){}
function 궤적디자인(){}

function 궤적(callback=궤적디자인,index=0){
  if(poses && poses.length>0){
    let pose = poses[0];
    if(pose.pose){
      if(frameCount%궤적설정.빈도==0)trajectory[index].push(
        {
          design:callback?callback:궤적디자인,
          pos:pose.pose.keypoints[index].position
        }
      );

      let limit = 궤적설정.길이;
      if(trajectory[index].length > limit){
        trajectory[index].splice(0, trajectory[index].length - limit);
      }
    }
  }
}

function 그리기(callback=디자인, index=0){
  if(poses && poses.length>0){
    for(let pose of poses){
      if(pose.pose){
        let 관절 = pose.pose.keypoints.map(kp=>kp.position);
        if(callback)callback(관절,관절[index],new p5.Vector());
        else 디자인(관절,관절[index],new p5.Vector());
      }
    }
  }
}

function drawTrajectory(){
  for(let traj of trajectory){
    if(traj.length > 1){
      
      for(let i=0; i<traj.length-1; i++){
        let d = {
          x:traj[i].pos.x-traj[traj.length-1].pos.x,
          y:traj[i].pos.y-traj[traj.length-1].pos.y
        };
        let 점 = new p5.Vector(traj[i].pos.x,traj[i].pos.y), 
            연결점 = new p5.Vector(traj[i+1].pos.x,traj[i+1].pos.y);
        
        let 관절 = [];
        for(let i=0; i<17; i++){
          관절.push(new p5.Vector());
        }
        if(poses.length > 0 &&poses[0].pose){
          관절 = [];
          관절 = poses[0].pose.keypoints.map(kp=>{return {
            x:kp.position.x+d.x,
            y:kp.position.y+d.y
          }});
        }

        if(!점) 점 = new p5.Vector();
        if(!연결점) 연결점 = new p5.Vector();
        
        push();
        traj[i].design(관절,점,연결점);
        pop();
      }
    }
  }
}

function drawGrid(gap=10){
  
  strokeWeight(1);
  for(let x=0; x<=width; x+=gap){
    if(x%100==0)stroke(255);
    else stroke(255,100);
    line(x,0,x,height);
  }
  for(let y=0; y<=height; y+=gap){
    if(y%100==0)stroke(255);
    else stroke(255,100);
    line(0,y,width,y);
  }
}

function 입자(callback=디자인,index=0){
  if(poses && poses.length>0){
    for(let pose of poses){
      if(pose.pose){
        let pos = pose.pose.keypoints[index].position;
        if( (frameCount%입자설정.빈도) == 0) particles.push(new Particle(index,pos,callback?callback:디자인));
      }
    }
  }
}

/* 
  입자 관련 코드
*/

class Particle {
  constructor(index,pos,design) {
    let x = pos.x, y = pos.y;
    
    var move = 10 * 입자설정.생성위치흐트림;
    this.pos = new p5.Vector(x + random(-move, move), y + random(-move, move));

    this.prevPosArray = [];
    this.vel = new p5.Vector();
    this.acc = new p5.Vector();
    this.지속시간 = 10 + 5 * 입자설정.지속시간;
    this.dying_speed = 1;
    this.design = design;
    this.index = index;
  }

  applyForce(force) {
    this.acc.add(force);
  }


  update() {
    this.지속시간 -= this.dying_speed;

    this.applyForce(new p5.Vector(0, 입자설정.중력));

    if (입자설정.난기류 > 0) {
      var nforce = new p5.Vector(입자설정.난기류 / 2, 0);
      nforce.rotate(noise(this.pos.x * 0.01 + frameCount*0.01, this.pos.y * 0.01) * TWO_PI * 2);
      this.applyForce(nforce);
    }

    this.vel.add(this.acc);


    this.prevPosArray.push(this.pos.copy());
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    ) {
      this.지속시간 = 0;
    }
  }

  display() {
    push();
      if(poses && poses.length>0){
        for(let pose of poses){
          if(pose.pose){
            let 점 = this.pos;
            let 선택관절 = pose.pose.keypoints[this.index].position;
            let 관절 = pose.pose.keypoints.map(kp=>new p5.Vector(
              kp.position.x+(점.x-선택관절.x),
              kp.position.y+(점.y-선택관절.y)
            ));

            if(!점 || (점 && !점.x)) 점 = new p5.Vector();
            this.design(관절,점,new p5.Vector());
          }
        }
      }
      else this.design(
        Array.from({length: 17}, () => new p5.Vector()),
        this.pos?this.pos:new p5.Vector(),
        new p5.Vector()
      );
      
    pop();
  }

  run() {
    this.update();
    this.display();
  }
}

/* 
  이 프로젝트에 필요한 추가적인 함수들 
*/

function deepClone(obj) {
  if(obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const result = Array.isArray(obj) ? [] : {};
  
  for(let key of Object.keys(obj)) {
    result[key] = deepClone(obj[key])
  }
  
  return result;
}

function hexCon(number) {
  let h = number.toString(16);
  return h.length > 1 ? h : "0" + h;
}
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

let video;
let poseNet;
let poses = [];
let 씬번호 = 1;
let AI분류 = "";

function 초기설정(화면크롭=false){
  if(화면크롭){
    resizeCanvas(480, 480);
    video = createCapture({
      video: {
        mandatory: {
          minWidth: 240,
          minHeight: 240,
          maxWidth: 240,
          maxHeight: 240
        }
      },
      audio: false
    },function(){
      ai_init();
    });
  }
  else{
    video = createCapture(VIDEO,function(){
      ai_init();
    });
  }
  video.size(width, height);
  video.hide();
  textAlign(CENTER);
}

function 시작(){
  clear();

  if (기본설정.좌우반전) {
    translate(width, 0);
    scale(-1, 1);
  }

  imageMode(CORNER);
  image(video, 0, 0, width, height);
  
  imageMode(CENTER);

  // 배경 그리기
  noStroke();
  rectMode(CENTER);
  fill(기본설정.배경색 + (hexCon(기본설정.배경색_투명도)));
  rect(width / 2, height / 2, width, height);
  
  if(기본설정.격자)drawGrid();
}

function 끝(){
  for (var p of particles) {
    p.run();
  }
  particles = particles.filter(p =>p.지속시간 > 0);
  drawTrajectory();
  
  if(기본설정.관절표시){
    for (let i = 0; i < poses.length; i += 1) {
      let points = getAllPoints(poses[i].pose);
      stroke(255);
      fill(255);
      drawPoints(points);
    }
  }
  
  if(기본설정.정보출력){
    fill(255);
    noStroke();
    textAlign(LEFT,BOTTOM);
    textSize(30);
    text(AI분류,0,height);

    textAlign(RIGHT,BOTTOM);
    textSize(30);
    text(씬번호,width-15,height);
  }
}

function 씬번호바꾸기(){
  if (keyCode === LEFT_ARROW && 씬번호>1) {
    씬번호--;
  } else if (keyCode === RIGHT_ARROW && 씬번호<9) {
    씬번호++;
  }
  var n = int(key);
  if(n>0 && n<10)씬번호=n;
}