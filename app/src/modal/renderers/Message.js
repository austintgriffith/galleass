import React, { Component } from 'react';
import Writing from '../../Writing.js'
import CitizenFace from '../../tokens/CitizenFace.js'

export default (modalObject)=>{


  //let fishmongerGenes = await contracts["CitizensLib"].methods.getCitizenGenes(1).call()

  const charWidth = 61
  const offsetChars = 12
  const linesOffset = 4
  const offsetPixels = 160

  let writing = []
  let words = modalObject.message.split(" ")
  let line = ""
  let lineWidth = 0
  let lineCount = 0
  for(let w=0;w<words.length;w++){
    let newLine = false
    if(words[w]=="\n"){
      words[w]=" "
      newLine=true
    }
    let lineCharLimit = charWidth-offsetChars
    if(lineCount>linesOffset) lineCharLimit=charWidth

    let lineWidthWillBe = 1
    if(words[w].indexOf("#")<0){
      lineWidthWillBe=words[w].length+1
    }

    if(!newLine && lineWidth+lineWidthWillBe<lineCharLimit){
      lineWidth+=lineWidthWillBe

      if(line!="")line=line+" "
      line=line+words[w]
    }else{
      let style = {
        marginLeft:offsetPixels
      }
      if(lineCount>linesOffset){
        style.marginLeft=0
      }
      lineCount++
      writing.push(
        <div style={style}>
          <Writing style={{opacity:0.9}} string={line} size={22}/>
        </div>
      )
      line=""
      lineWidth=0
      w=w-1
    }
  }

  return (
    <div style={{padding:20}}>
      <div style={{position:'absolute',left:40,top:156}}>
        <CitizenFace size={120} genes={{head:(65535/2+256),hair:(65535/8*5+256),mouth:(65535/28*3+256),nose:(65535/2+256),eyes:(65535/8*5+256)}} />
      </div>
      {writing}
    </div>
  )
}
