import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/table3.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table3 = () => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [room, setRoom] = useState([]);
  const [showRoom, setShowRoom] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const backendIPAddress = 'http://174.138.30.245:8080/'

  useEffect(() => {
    //รับค่า API
    
      axios.get( backendIPAddress + `alluser`).then((res) => {
      const items = res.data.map((v) => {
        v.last_deposit = new Date(v.last_deposit);
        v.last_login_dt = new Date(v.last_login_dt);
        v.register_date = new Date(v.register_date);
        return v;
      });
      setData((data) => items);

      // รายการห้องทั้งหมด
      setShowRoom((showRoom) => {
        return items.map((v) => v.room);
      });

      let unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      let allRoom = items.map((v) => v.room);
      let rooms = allRoom.filter(unique);
      setRoom((room) => rooms);

      // เลือกวัน เดือน ปี
      let date = new Date();
      let nowYear = date.getFullYear().toString();
      let nowMonth = date.getMonth() + 1;
      let nowDay = date.getDate().toString();
      // ปี ที่ได้จาก API
      let today = items.filter((v) => {
        return (
          v.register_date.toISOString().split("-")[0] === nowYear &&
          v.register_date.toISOString().split("-")[1] === nowMonth.toString() &&
          v.register_date.toISOString().split("T")[0].split("-")[2] === nowDay
        );
      });
      //แสดงข้อมูลเฉพาะวันนี้
      setShowData((showData) => today);
    });
  }, []);

  const reLoad = () => {
    setShowData((showData) => data);
  };

  const roomList = () => {
    if (showRoom.length >= 1) {
      let unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      let room1 = showRoom.map((v) => v);
      let room2 = room1.filter(unique);
      return room2;
    }
    return [];
  };

  const sortTable = (n) => {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("tableReport");
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir === "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir === "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  };

  const redRow = () => {
    const fifteenDay = 15 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const date = data.map((v) => {
      return currentDate - v.last_deposit >= fifteenDay;
    });

    return date;
  };

  const search = () => {
    let searchWord = document.getElementById("searchWord").value;
    let roomName = document.getElementById("roomName").value;
    // let startDay = document.getElementById("startDay") ? new Date(document.getElementById("startDay").value) : "";
    // let endDay = document.getElementById("endDay") ? new Date(document.getElementById("endDay").value) : "";
    let startDay = startDate;
    let endDay = endDate;
    // if(searchWord && roomName && startDay.toString() !== "Invalid Date" && endDay.toString() !== "Invalid Date"){
    // if(searchWord && roomName){
    if (searchWord && roomName && startDay !== " " && endDay !== " ") {
      console.log("ว่างทั้งหมด");
      let chooseDate = data.filter((v) => {
        return v.register_date >= startDay && v.register_date <= endDay;
      });
      let chooseWord = chooseDate.filter((item) => {
        return searchWord
          .toLowerCase()
          .split(" ")
          .every((v) => {
            return item.real_name
              ? item.real_name.includes(v) ||
                  item.username.toLowerCase().includes(v) ||
                  item.tel_no.toString().toLowerCase().includes(v)
              : "";
          });
      });
      let result = chooseWord.filter((v) => {
        return v.room === roomName;
      });
      result.length > 0
        ? setShowData((showData) => result)
        : alert("ไม่มีข้อมูลที่คุณค้นหา");
    } else if (roomName && startDay !== "" && endDay !== "") {
      console.log("room มีค่า | startDay มีค่า | endDay มีค่า");
      let chooseDate = data.filter((v) => {
        return v.register_date >= startDay && v.register_date <= endDay;
      });
      let chooseRoom = chooseDate.filter((v) => {
        return v.room === roomName;
      });
      chooseRoom.length > 0
        ? setShowData((showData) => chooseRoom)
        : alert("ไม่มีข้อมูลที่คุณค้นหา");
    } else if (searchWord) {
      let chooseWord = data.filter((item) => {
        return searchWord
          .toLowerCase()
          .split(" ")
          .every((v) => {
            return item.real_name
              ? item.real_name.includes(v) ||
                  item.username.toLowerCase().includes(v) ||
                  item.tel_no.toString().toLowerCase().includes(v)
              : "";
          });
      });
      chooseWord.length > 0
        ? setShowData((showData) => chooseWord)
        : alert("ไม่มีข้อมูลที่คุณค้นหา");
    } else if (roomName) {
      let chooseRoom = data.filter((v) => {
        return v.room === roomName;
      });
      setShowData((showData) => chooseRoom);
    } else if (startDay !== "" && endDay !== "") {
      let chooseDate = data.filter((v) => {
        return v.register_date >= startDay && v.register_date <= endDay;
      });
      setShowData((showData) => chooseDate);
    } else {
      alert("กรุณาเลือกเงื่อนไขให้ถูกต้อง");
    }
  };

  const selectRoomToSave = (selectedRoom, id) => {
    axios({
      method: "PUT",
      url: backendIPAddress + "editroom/" + id + "/" + selectedRoom,
    })
      .then(console.log("เปลี่ยนแปลงข้อมูลห้องเรียบร้อย"))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <br />
      <div className="row">
        <div className="col-md-1 text-center">
          <h3>
            <b>
              <a href="/#" onClick={() => reLoad()}>
                REPORT
              </a>
            </b>
          </h3>
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            id="searchWord"
            placeholder="ค้นหา username, name, phone"
          />
        </div>
        <div className="col-md-2">
          <select name="" className="form-control" id="roomName">
            <option value="">เลือกห้อง</option>
            {roomList().map((r, index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1 " id="startDay">
          {/* <input type="date" className="form-control" defaultValue="" name="" id="startDay"/> */}
          <DatePicker
            className="form-control"
            placeholderText="วันเริ่ม"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="col-md-1">
          {/* <input type="date" className="form-control" defaultValue="" name="" id="endDay"/> */}
          <DatePicker
            className="form-control"
            placeholderText="วันสิ้นสุด"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary btn-block"
            onClick={() => search()}
          >
            <b>GO</b>
          </button>
        </div>
      </div>
      <br />
      <table className="table table-bordered text-center" id="tableReport">
        <thead className="bg-primary" style={{ color: "white" }}>
          <tr>
            <th onClick={() => sortTable(0)}>U ID</th>
            <th onClick={() => sortTable(1)}>USER NAME</th>
            <th onClick={() => sortTable(2)}>NAME</th>
            <th onClick={() => sortTable(3)}>PHONE</th>
            <th>ROOM</th>
            <th>LINE</th>
            <th onClick={() => sortTable(4)}>WALLET</th>
            <th onClick={() => sortTable(5)}>LAST DEPOSIT</th>
            <th onClick={() => sortTable(6)}>LAST LOGIN</th>
            <th onClick={() => sortTable(7)}>REGISTER DATE</th>
            {/* <th>CHECK</th> */}
          </tr>
        </thead>
        <tbody>
          {showData.map((v, index) => {
            return (
              <tr
                key={v.username}
                style={redRow()[index] ? { backgroundColor: "#ffcccc" } : {}}
              >
                <td>{v.uid}</td>
                <td>{v.username}</td>
                <td>{v.real_name}</td>
                <td>{v.tel_no}</td>
                <td>
                  {/* <input type="text" className="form-control"/> */}
                  <select
                    className="form-control"
                    id="selectedRoom"
                    onChange={(e) => {
                      const selectedRoom = e.target.value;
                      selectRoomToSave(selectedRoom, v.id);
                    }}
                  >
                    <option value={v.room}>{v.room}</option>
                    {/* <option value="noroom">noroom</option> */}
                    <option value="room1">room1</option>
                    <option value="room2">room2</option>
                    {
                      // room.map((r, i) => { return (<option key={i} value={r}>{r}</option>) })
                    }
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" />
                </td>
                <td>{v.wallet}</td>
                <td>{v.last_deposit.toISOString().split("T")[0]}</td>
                <td>{v.last_login_dt.toISOString().split("T")[0]}</td>
                <td>{v.register_date.toISOString().split("T")[0]}</td>
                {/* <td><input type="checkbox" name="" id="" className="form-check-input scale-check"/></td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      {/* <div className="row">
                <div className="col-md-12 text-right">
                    <button className="btn btn-primary"><b>DELETE</b></button>
                </div>
            </div> */}
    </div>
  );
};

export default Table3;
