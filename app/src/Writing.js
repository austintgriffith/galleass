import React, { Component } from 'react';

class Writing extends Component {
  render(){
    let size = this.props.size;
    let letterSpacing;
    if(typeof this.props.letterSpacing == "undefined"){
      letterSpacing = size/-2;
    }else{
      letterSpacing = parseFloat(this.props.letterSpacing)*(-1);
    }
    //console.log("letterSpacing for size",size,letterSpacing)
    let word = [];
    let usedChars = [];
    let string = ""+(this.props.string);
    for (var i = 0; i < string.length; i++) {
      let character = string.charAt(i);
      let image = "handwritten/";
      if(character == " "){
        image = image+"space.png"
      }else if(character == "."){
        image = image+"dot.png"
      }else if (character == character.toUpperCase()) {
        image = image+character+".png"
      }else{
        if((character=="a"||character=="l"||character=="s")&&usedChars.indexOf(character)>=0){
          image = image+character+"_2.png"
        }else{
          image = image+character+"_.png"
        }
      }
      word.push(
        <img style={{maxHeight:size,marginRight:letterSpacing+extraKern(character,letterSpacing)}} src={image} />
      )
      usedChars.push(character);
    }
    return (
      <span style={{paddingRight:this.props.space}}>
        {word}
      </span>
    )
  }
}

let extraKern = (character,letterSpacing)=>{
  if(character=="l"){
    return letterSpacing*(0.5);
  }else if(character=="1"){
    return letterSpacing*(0.42);
  }else if(character=="."){
    return letterSpacing*(0.6);
  }else if(character=="i"){
    return letterSpacing*(0.42);
  }else if(character=="t"){
    return letterSpacing*(0.15);
  }else if(character=="e"){
    return letterSpacing*(0.2);
  }else if(character=="s"){
    return letterSpacing*(0.2);
  }else{
    return 0;
  }
}

export default Writing;