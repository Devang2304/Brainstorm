import React, { act, useLayoutEffect } from 'react';
import { useRef,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { MENU_ITEMS } from '@/constants'
import { menuItemClick,actionItemClick } from '@/slice/menuSlice';


const  Board = () => {
    const dispatch=useDispatch();
    const canvasRef=useRef(null);
    const shouldDraw=useRef(false);
    const {activeMenuItem,actionMenuItem}=useSelector((state)=>state.menu);
    const {color,size}=useSelector((state)=>state.toolbox[activeMenuItem]);

    useEffect(()=>{
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context=canvas.getContext('2d');

      if(actionMenuItem===MENU_ITEMS.DOWNLOAD){
        const URL = canvas.toDataURL();
        const anchor=document.createElement('a');
        anchor.href=URL;
        anchor.download='sketch.png';
        anchor.click();
        dispatch(actionItemClick(null));
        // console.log(URL);
      }
    },[actionMenuItem]);

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
    // before browser render/paint
    useLayoutEffect(() => {
      if(!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context=canvas.getContext('2d');

      // mounting 
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;


      const beginPath=(x,y)=>{
        context.beginPath(); // initialise
        context.moveTo(x, y);
      }

      const drawLine=(x,y)=>{
        context.lineTo(x, y); //draw
        context.stroke();
      }
      
      const handleMouseDown=(e)=>{
        shouldDraw.current=true;
        beginPath(e.clientX, e.clientY);
      }
      const handleMouseUp=(e)=>{
        shouldDraw.current=false;
        // context.closePath();
      }
      const handleMouseMove=(e)=>{
        if(!shouldDraw.current) return;
        drawLine(e.clientX, e.clientY);
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