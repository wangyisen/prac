var father=document.getElementById("father"),
  sons=father.children,
  sonsLength=sons.length/3,
  showWidth=432+20*2, //432: width; 20*2: margin*2
  showingId=parseInt(sonsLength/2)+sonsLength-1,
  transform=-showingId*showWidth+showWidth/2,
  checkTime=new Date()

father.style.transform=`translate3d(${transform}px, 0, 0)`
sons[showingId].className="showing"

function go(nowShowingId, direction) {
  // Direction: "-1" stands for left, "1" stands for right.
  //+ Avoid continuous sliding
  if(new Date()-checkTime<700)return
  checkTime=new Date()
  //+ Standard show change
  sons[nowShowingId].className=""
  //- Change here
  nowShowingId=nowShowingId+direction
  showingId=nowShowingId;
  transform=nowShowingId*showWidth-showWidth/2
  father.style.transform=`translate3d(-${transform}px, 0, 0)`
  sons[nowShowingId].className="showing"
  //+ Special show change
  if(nowShowingId==1){
    showingId=sonsLength*2+1 // How does it works?
  }
  else if(nowShowingId==sonsLength*2+2){
    showingId=1+1 // Imagine the answer. (Use DevTools!
  }
  else {return}
  //- change here
  setTimeout(function(){
    father.classList.add("moving")
    sons[showingId].className="showing"
    setTimeout(function(){
      father.style.transform=`translate3d(-${showingId*showWidth-showWidth/2}px, 0, 0)`
      sons[nowShowingId].className=""
      setTimeout(function(){
        father.classList.remove("moving")
      },50) // =1.
    },530) // =2.
  },100) // =3. /= 1,2,3: Specified like that because of setTimeout's time error
}

document.getElementById("left").onclick=function (){go(showingId, -1)}
document.getElementById("right").onclick=function (){go(showingId, 1)}