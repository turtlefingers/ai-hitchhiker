/*
  이 코드는 ABC LAB 의 인공지능으로 춤추는 히치하이커 워크샵을 위하여 정효에 의해 개발되었습니다.
  The code was developed by Jeonghyo for ABC LAB's AI-dancing hitchhiker workshop.
*/

/* 관절번호 */
/*
0 코
1 눈 왼쪽
2 눈 오른쪽
3 귀 왼쪽
4 귀 오른쪽
5 어깨 왼쪽
6 어깨 오른쪽
7 팔꿈치 왼쪽
8 팔꿈치 오른쪽
9 손목 왼쪽
10 손목 오른쪽
11 엉덩이 왼쪽
12 엉덩이 오른쪽
13 무릅 왼쪽
14 무릅 오른쪽
15 발목 왼쪽
16 발목 오른쪽
*/

const 모델주소 = "https://teachablemachine.withgoogle.com/models/rbCgBipSE/";

function keyPressed() {
  씬번호바꾸기();
}

function setup() {
  createCanvas(640, 480);
  기본설정.포즈분류 = false;
  초기설정();
}

function draw() {
  
  시작();
  
  입자(동그라미,0);
  
  끝();

}

/* 아래에 디자인을 위한 함수를 추가해주세요 */
  function 동그라미(관절,점){
    fill(255);
    ellipse(점.x,점.y, 50,50);
  }