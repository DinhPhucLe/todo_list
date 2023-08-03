import './App.css';
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFileEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, getDoc } from "firebase/firestore";
import {db} from "./firebase";
//import InitialDeploy from "./InitialDeploy.js";

let ord=0;
var tmp="";



function App() {
  const [edboxList, setEdbox] = useState([]);
  const [cfEdDPL, setcfEdDPL] = useState(false);
  const [addDPL, setaddDPL] = useState(true);
  const [taskList, setTaskList] = useState([]);
  const [taskname, setTaskName] = useState('');
  
  const taskDB = collection(db, "TodoList");

  const togglecfEd = (st) => {
    setcfEdDPL((cfEdDPL) => st);
  }

  const toggleAdd = (st) => {
    setaddDPL((addDPL) => st);
  }

  const getTask = (event) => {
    setTaskName(event.target.value);
  }


  const removeTask = (check) => {
    deleteDoc(doc(db, "TodoList", check));
    const tmpList = taskList.filter((item) => item.id !== check);
    setTaskList(tmpList);

    /*ord=0;
    tmpList.map((tmpDoc) => {
      //tmpDoc.idx
      ++ord;
      const tmpID = "id"+ord.toString();
      updateDoc(getDoc(doc(db, "TodoList", tmpDoc.id)),{
        id: tmpID
      });
    })*/
  }
 
  const addTasktoList = (id) => {
    

    getDocs(taskDB)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc.data().id === id)
            setTaskList([...taskList, doc.data()]);
        })
      })
    
    //setTaskList([...taskList, Task]);
    //setEdbox([...edboxList, Task.id]);
  };

  const cfEdit = (id, taskName) => {
    toggleAdd(true);
    togglecfEd(false);

    taskList.find(Task => Task.id === id).name = taskName;

    updateDoc(doc(db, "TodoList", id), {
      name: taskName
    })

    taskList.find(Task => Task.id === id).inEdit = false;
    const tmpTaskList = taskList.map(task => {return task;})
    setTaskList(tmpTaskList);
  }

  const changeSTT = (curTask) => {

    let edbox = curTask.stt;
    //console.log(edbox.textContent);
    if (edbox === "Todo"){
      //edbox.setAttribute('class', 'newStatus inProgress adjCenter');
      edbox = "In Progress";
    }else{
      //edbox.setAttribute('class', 'newStatus Complete adjCenter');
      edbox = "Complete";
    }

    updateDoc(doc(db, "TodoList", curTask.id), {
      stt: edbox
    })

    taskList.find(Task => Task.id === curTask.id).stt = edbox;
    const tmpTaskList = taskList.map(task => {return task;})
    setTaskList(tmpTaskList);
  }

  const editTask = (task) => {
    setTaskName(task.name);
    //focus

    edboxList.map((boxID) => {
      //document.getElementById(boxID).setAttribute('class', 'newEdit');
      taskList.find(Task => Task.id === boxID).inEdit = false;
      const tmpTaskList = taskList.map(task => {return task;})
      setTaskList(tmpTaskList);
    })

    
    
    const edBoxID = "edno"+task.id;

    taskList.find(Task => Task.id === task.id).inEdit = true;
    const tmpTaskList = taskList.map(task => {return task;})
    setTaskList(tmpTaskList);

    toggleAdd(false);
    togglecfEd(true);

    tmp=task.id;
  }


  const keySubmit = e => {
    if (e.keyCode === 13){
      addTasktoList(e.target.addID);
    }
  }

  const getStatus = (curStatus) => {
    if (curStatus === 'Todo') return 'grey';
    else if (curStatus === 'In Progress') return 'yellow';
    else return 'green';
  }

  const InitialDeploy = () => {
    const taskDB = collection(db, "TodoList");


    getDocs(taskDB)
      .then((snapshot) => {
        let tmp=[];
        ord=0;

        snapshot.docs.forEach((doc) => {
          tmp.push(doc.data());
          const cur = (doc.data().id).replace("id", "").charCodeAt(0)-48;
          ord=Math.max(ord, cur);
        })
        setTaskList(tmp);
      })
    
    
  }
  
  useEffect(InitialDeploy, []);
  
  return (
    <>

    <div className="App">
      <h1>TODO LIST</h1>

      <div className="App-Box">

        <div className="AddTaskBox">
          <input type="text" placeholder="Enter your task"
            onChange = {getTask} value = {taskname} id={"inputField"}
            onKeyDown={keySubmit} addID = {"id"+(ord+1).toString()}/>
          {
          
          addDPL &&
          <button type="button" 
            onClick={() => {
              ord++;

              const tmp = "id"+ord.toString();
              setDoc(doc(db, "TodoList", tmp), {
                name: taskname,
                id: tmp,
                stt: "Todo",
                inEdit: false
              });

              addTasktoList(tmp);
            }}
            id = {"btn"}
            style={{width: "100px", height: "36px", borderRadius: "30px",
                    border: "2px solid blue", color: 'blue', backgroundColor: 'lightblue',
                    marginLeft: "-100px"}}>Add Task</button>
          }

          {
          cfEdDPL &&
          <button type="button" id='confirm'
            onClick={() => {cfEdit(tmp, taskname)}}
            style={{width: "100px", height: "36px", borderRadius: "30px",
                  border: "2px solid green", color: 'green', backgroundColor: 'lightgreen',
                  marginLeft: "-100px"}}>Edit</button>
          }
        </div>

        <div className='newTask'>
          <div className='tName'><b>Task name</b></div>
          <div style={{width: '100px', alignItems: 'center', marginLeft: '-10px'}}><b>Status</b></div>
          <div style={{width: '35px', alignItems: 'center', marginLeft: '0px'}}><b>Edit</b></div>
          <div style={{width: '35px', alignItems: 'center', marginRight: '10px'}}><b>Remove</b></div>

        </div>


        <ul id="container">
          {taskList.map((task) => {
          return(
            <div className='newTask' id={"#"+task.id}>
              <div className='tName' id={"tno"+task.id}>{task.name}</div>

              <div style={{width: "100px", marginLeft: "-15px", marginRight: "0px"}}>
                
                <button style={{ color: getStatus(task.stt), borderColor: getStatus(task.stt)}}
                    className='newStatus' onClick={() => changeSTT(task)}
                    id = {"stno"+task.id} type="button">{task.stt}</button>
              </div>

              <div>
                <button className = {(!task.inEdit) ? "newEdit" : "newEdit boxinEdit"}
                 onClick={() => editTask(task)}
                  id = {"edno"+task.id}>
                  <FontAwesomeIcon icon={faEdit}/>
                </button>
                
              </div>

              <div>
                <button className='newTrash'
                  id = {"delno"+task.id}
                  onClick={() => removeTask(task.id)}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </button>
              </div>
            </div>
          );
          })}
        </ul>
      </div>
    </div>
    </>
  );
}

export default App;