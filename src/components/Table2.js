import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Table2() {
  const [dataState, setDataState] = useState({counter: 0});
  const [width, setWidth] = useState(window.innerWidth);
  const [products, setProducts] = useState([{name: 'Book', price: 350}]);
  const [data, setData] = useState(' ');

  useEffect(async () => {
    const items = await axios.get(`http://209.97.169.9/ruayusers`);
    setData({data:items.data});
  },[]);

  const plusHandler = () =>{
    setDataState({
      counter: dataState.counter + 1
    });
  }
  const minusHandler = () =>{
    setDataState({
      counter: dataState.counter - 1
    });
  }

  console.log(data);
  return (
    <div className="text-center">
      
    </div>
  );
}

export default Table2;
