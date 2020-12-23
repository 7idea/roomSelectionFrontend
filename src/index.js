import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();

// import {createStore} from "redux";

// // ค่าเริ่มต้นของ state
// const initialState={
//   result:15000,
//   value:[]
// }

// const reducer=(state=initialState,action)=>{
//   switch(action.type){
//     case "PLUS":
//       state={
//         ...state,
//         result:state.result+=action.payload,
//         value:[...state.value,action.payload]
//       }
//       // state={
//       //   result:state.result+=action.payload,
//       //   value:state.value
//       // }

//       // state+=action.payload;
//     break;
//     case "MINUS":
//       state={
//         ...state,
//         result:state.result-=action.payload,
//         value:[...state.value,action.payload]
//       }
//       // state-=action.payload;
//     break;
//     default:
//   }
//   return state;
// }

// const store=createStore(reducer);

// store.subscribe(()=>{
//   console.log("Update Store: ",store.getState());
// });

// store.dispatch({
//   type:"PLUS",
//   payload:15000
// });

// store.dispatch({
//   type:"PLUS",
//   payload:15000
// });

// store.dispatch({
//   type:"PLUS",
//   payload:30000
// });

// store.dispatch({
//   type:"MINUS",
//   payload:30000
// });

// store.dispatch({
//   type:"MINUS",
//   payload:30000
// });

// store.dispatch({
//   type:"MINUS",
//   payload:10000
// });