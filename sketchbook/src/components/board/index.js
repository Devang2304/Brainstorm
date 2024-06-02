import React, { useLayoutEffect } from 'react';
import { useRef,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';

const  Board = () => {
    const canvasRef=useRef(null);
    const shouldDraw=useRef(false);
    const activeMenuItem=useSelector((state)=>state.menu.activeMenuItem);
    const {color,size}=useSelector((state)=>state.toolbox[activeMenuItem]);

    useEffect(() => {
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context=canvas.getContext('2d');

      const changeConfig=()=>{
        context.strokeStyle=color;
        context.lineWidth=size;
      }
      changeConfig();
    },[color,size])
    //mount
    useLayoutEffect(() => {
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context=canvas.getContext('2d');

      // mounting 
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;


      const handleMouseDown=(e)=>{
        shouldDraw.current=true;
        context.beginPath(); // initialise
        context.moveTo(e.clientX, e.clientY);
      }
      const handleMouseUp=(e)=>{
        shouldDraw.current=false;
        // context.closePath();
      }
      const handleMouseMove=(e)=>{
        if(!shouldDraw.current) return;
        context.lineTo(e.clientX, e.clientY); //draw
        context.stroke();
      }

      canvas.addEventListener('mousedown',handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);
      return ()=>{
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      //unmount
    },[]);

    console.log(color,size);
  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default Board