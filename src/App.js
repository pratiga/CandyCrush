import React,{useState, useEffect} from 'react';
import './style.css';
import redcandy from './images/red-candy.jpg';
import bluecandy from './images/blue-candy.jpg';
import purplecandy from './images/purple.jpg';
import greencandy from './images/green-candy.jpg';
import yellowcandy from './images/yellow.jpg';
import orangecandy from './images/orange-candy.jpg';

const width = 8;
const candyColors = [
    bluecandy,
    orangecandy,
    purplecandy,
    greencandy,
    yellowcandy,
    redcandy
]

const App = () => {
  const[currentColorArrangement, setCurrentColorArrangement] = useState([])
  const[squareBeingDragged, setSquareBeingDragged] = useState(null)
  const[squareBeingReplaced, setSquareBeingReplaced] = useState(null)

  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnOfFour = () => {
    for (let i=0; i<=39; i++){
      const columnOfFour = [i,i+width, i + width *2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      
      if ( columnOfFour.every(square => currentColorArrangement[square] === decidedColor)){
        columnOfFour.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfFour = ()=> {
    for( let i=0; i<64; i++){
      const rowOfFour = [i, i+1, i+2, i+3]
      const decidedColor = currentColorArrangement[i]
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,56]
      
      if (notValid.includes(i)) continue
      if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor)){
        rowOfFour.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }
  
  
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnOfThree = () => {
    for (let i = 0; i<=47; i++){
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[1]
      
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor )){
          columnOfThree.forEach(square => currentColorArrangement[square] = '')
          return true
      }
      
    }
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfThree = () => {
    for (let i =0; i< 64; i++) {
      const rowOfThree = [i, i+1, i+2]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
      
      if (notValid.includes(i)) continue
      if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor)){
        rowOfThree.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const moveIntoSquareBelow = () => {
    for (let i=0; i <=55; i++){
        const firstRow = [0, 1, 2, 3, 4, 5,6,7]
        const isFirstRow = firstRow.includes(i);
        
        if ( isFirstRow && currentColorArrangement[i] === '') {
          let randomNumber = Math.floor(Math.random() * candyColors.length)
          currentColorArrangement[i] = candyColors[randomNumber]
          return true
        }
      
      if((currentColorArrangement[i + width]) === '') {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = ''
      }
    }
  }
  
  const dragStart = (e) => {
    console.log(e.target)
    console.log('drag start')
    setSquareBeingDragged(e.target)
  }
  const dragDrop = (e) => {
    console.log(e.target)
    console.log('drag drop')
    setSquareBeingReplaced(e.target)
  }
  const dragEnd = (e) => {
    console.log(e.target)
    console.log('drag end')
    
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('date-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('date-id'))
    
    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')
    
    
    console.log('squareBeingDraggedId', squareBeingDraggedId)
    console.log('squareBeingReplacedId', squareBeingReplacedId)
    
    const validMovies = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId-width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]
    const validMove = validMovies.includes(squareBeingReplacedId)
    
    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()
    
    if (squareBeingReplacedId && validMove &&
        (isAColumnOfFour||isARowOfThree||isARowOfFour||isAColumnOfThree)){
          setSquareBeingDragged(null)
          setSquareBeingReplaced(null)
        } else {
          currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
          currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
          setCurrentColorArrangement([...currentColorArrangement])
        }
    
  }

  const createBoard = () => {
    const randomColorArrangement = []
    for (let i=0; i < width * width; i++){
      const randomColor = candyColors[Math.floor(Math.random()
       * candyColors.length)]
      randomColorArrangement.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangement)
  }
  useEffect(()=> {
    createBoard()
  }, [])
  
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    },100)
    return () => clearInterval(timer)
  }, [ checkForColumnOfFour,checkForRowOfFour, currentColorArrangement,moveIntoSquareBelow,checkForColumnOfThree,checkForRowOfThree])
  
  
  


  return (
    <div className='app'>
      <div className='game'>
        {currentColorArrangement.map((candyColors,index) =>(
          <img
            key={index}
            src={candyColors}
            alt={candyColors}
            date-id ={index}
            draggable={true}
          
            onDragStart={dragStart}
           
            
            onDragOver = {(e) => e.preventDefault()}
            onDragEnter = {(e) => e.preventDefault()}
            onDragLeave = {(e) => e.preventDefault()}
            
            onDrop={dragDrop}
          
            onDragEnd={dragEnd}

          />
          
        )
                                     
        )}
      </div>
    </div>
  )
}

export default App
