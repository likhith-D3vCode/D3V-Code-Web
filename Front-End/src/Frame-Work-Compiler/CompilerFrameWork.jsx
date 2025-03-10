import { useCallback, useEffect, useState } from "react";
import "../App.css";
import Terminal from "./Terminal";
import FileTree from "./Tree";
import socket from "../socket";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import BACKEND_URL from '../config';


function CompilerFrame() {
   const [fileTree, setFileTree]=useState({})
   const [selectedFile,setSelectedFile]=useState('')
   const [selectedFileContent,setSelectedFileContent]=useState('')
   const [code,setCode]=useState('')


   const isSaved=selectedFileContent===code

   useEffect(()=>{
    if(code && !isSaved ){
      const timer=setTimeout(()=>{
          socket.emit("file:change",{
            path:selectedFile,
            content:code
          })
      },5*1000)
      return ()=>{
        clearTimeout(timer)
      };
    }
  },[code,selectedFile,isSaved])



  useEffect(()=>{
    setCode("");
 
 },[selectedFile]);
 
 useEffect(()=>{
    setCode(selectedFileContent)
 },[selectedFileContent])


   const getFileTree=async()=>{
       const response=await fetch(`${BACKEND_URL}/files`)
       const result =await response.json();
       setFileTree(result.tree);
      
   }

   const getFileContents= useCallback(async () =>{
    if(!selectedFile) return;
    const response =await fetch(`${BACKEND_URL}/files/content?path=${selectedFile}`);
    const result =await response.json();
    setSelectedFileContent(result.content);
  },[selectedFile])    
  

  useEffect(()=>{

    if(selectedFile) getFileContents();
  
   },[getFileContents,selectedFile])



   useEffect(()=>{
    socket.on('file:refresh',getFileTree);
  
    return ()=>{
      socket.off("file:refresh",getFileTree);
    };
  },[])



  useEffect(()=>{
    if(selectedFile && selectedFileContent){
     setCode(selectedFileContent)
    }
 },[selectedFile,selectedFileContent])
  



   useEffect(()=>{
       getFileTree()
   },[])

  return(

     <div className="playground-container">
        <div className="editor-container">
          <div className="files">
            <FileTree 
            onSelect={(path)=>setSelectedFile(path)}
            tree={fileTree}/>
          </div>
          <div className="editor">
            {selectedFile && <p>{selectedFile.replaceAll("/",">")}    {isSaved?"Saved":"Unsaved"}</p>}
            <AceEditor
              value={code}
              onChange={e=>setCode(e)}
            />
          </div>
        </div>
          <div className="terminal-container">
          <Terminal />
          </div>
      </div>
  ) 
  
}


export default CompilerFrame;     