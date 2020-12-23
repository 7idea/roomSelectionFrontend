import { Component } from 'react'
import axios from 'axios';
import "./styles/table.css"
import { getDefaultNormalizer } from '@testing-library/react';
class Table extends Component {
    
    state = {
        
        data: [],
        showData: [],
        current_page: 1,
        records_per_page: 10,
        searchQuery:''
    }

    componentDidMount() {
        // axios.get(`http://209.97.169.9/ruayusers`)
        axios.get(`http://192.168.1.36:8080/alluser`)
            .then(res => {
                const data = res.data.map((v) => {
                    v.last_deposit = new Date(v.last_deposit);
                    v.last_login_dt = new Date(v.last_login_dt);
                    v.register_date = new Date(v.register_date);
                    return v;
                }) ;
                this.setState({ data:data });
                this.setState({ showData: this.state.data })

                // if (this.state.current_page === 1) {
                //     const btn_prev = document.getElementById("btn_prev");
                //     btn_prev.style.visibility = "hidden";
                // } else {
                //     const btn_prev = document.getElementById("btn_prev");
                //     btn_prev.style.visibility = "visible";
                // }

                this.resultQuery();
                // this.state.data = this.resultQuery;
        });
    }

    getResult = () =>{
        const fifteenDay = 15*24*60*60*1000;
        const currentDate = new Date();
        const date = this.state.data.map((v) =>{
            return currentDate - v.last_deposit >= fifteenDay});
        return date;   
    }
    
    sortTable = (n) => {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("tableReport");
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
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
    }

    prevPage = () => {
        if (this.state.current_page > 1) {
            this.state.current_page--;
            this.changePage(this.state.current_page);
        }
    }
    numberPage = (page) => {
        this.state.current_page = page;
        this.changePage(page);
    }
    nextPage = () => {
        if (this.state.current_page < this.numPages()) {
            this.state.current_page++;
            this.changePage(this.state.current_page);
        }
    }

    changePage = (page) => {
        const btn_next = document.getElementById("btn_next");
        const btn_prev = document.getElementById("btn_prev");
        const tr = document.getElementById("report");

        if (page < 1) page = 1;
        if (page > this.numPages()) page = this.numPages();

        tr.innerHTML = "";
        for (var i = (page - 1) * this.state.records_per_page; i < (page * this.state.records_per_page); i++) {
            let red = ''
            console.log(this.state.showData[i].uid);
            if(!this.getResult()[i]){
                 red = 'style="background-color:#ffcccc"'
            }
            tr.innerHTML += `<tr ${red}>
                                <td>${this.state.showData[i].uid}</td>
                                <td>${this.state.showData[i].username}</td>
                                <td>${this.state.showData[i].real_name}</td>
                                <td>
                                    <select className="form-control" value="roomName" >
                                        <option  value=${this.state.showData[i].room}>${this.state.showData[i].room}</option>
                                        <option value='A'>Apple</option>
                                        <option value='B'>Banana</option>
                                        <option value='C'>Cranberry</option>
                                    </select>
                                </td>
                                <td>
                                    <input type='text' className='form-control' placeholder='ID Line'/>
                                </td>
                                <td>${this.state.showData[i].room}</td>
                                <td>${this.state.showData[i].tel_no}</td>
                                <td>${this.state.showData[i].wallet}</td>
                                <td>${this.state.showData[i].last_deposit.toISOString().split('T')[0]}</td>
                                <td>${this.state.showData[i].last_login_dt.toISOString().split('T')[0]}</td>
                                <td>${this.state.showData[i].register_date.toISOString().split('T')[0]}</td>
                                <td>
                                    <input type='checkbox' name='' id='' className='form-check-input scale-check'/>
                                </td>
                            </tr>`
            ;
        }

        if (page === 1) {
            btn_prev.style.visibility = "hidden";
        } else {
            btn_prev.style.visibility = "visible";
        }

        if (page === this.numPages()) {
            btn_next.style.visibility = "hidden";
        } else {
            btn_next.style.visibility = "visible";
        }
    }
    numPages = () => {
        return Math.ceil(this.state.data.length / this.state.records_per_page);

    }

    btnSearch = () => {
        const startDate = new Date( document.getElementById("startDate").value ) ;
        const endDate = new Date( document.getElementById("endDate").value );

        const search = this.state.data.filter((item)=>{
            return item.last_deposit >= startDate && item.last_deposit <= endDate;
        })
        console.log(search);
        this.setState({data: search});
    }

    selectRoom = () => {
        
    }

    resultQuery = (search) =>{
        if(search){
            const value = this.state.data.filter((item)=>{
                return search.toLowerCase().split(' ').every(v => item.username.toLowerCase().includes(v));
            });
            this.setState({
                showData: value
            });
        }else{
            this.setState({showData: this.state.data})
        }
    }

    render() {
        return (
            <div className="Table" style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
                {/* <div className="container"> */}
                    <div className="row my-4" style={{ marginRight: "0" }}>
                        <div className="col-md-5">
                            <input type="text" placeholder="ค้นหาข้อมูล" className="form-control" onChange={e =>this.resultQuery(e.target.value)}/>
                        </div>
                        <div className="col-md-3"><input type="date" name="" id="startDate" className="form-control" /></div>
                        <div className="col-md-3"><input type="date" name="" id="endDate" className="form-control" /></div>
                        <div className="col-md-1">
                            <button className="btn btn-primary" onClick={()=>this.btnSearch()} style={{ backgroundColor: "#183e4f", borderColor: "#183e4f" }}>
                                Submit
                            </button>
                        </div>
                    </div>
                    <div>
                        <div style={{ backgroundColor: "#fff", borderRadius: "5px", border: "1px solid #ccd9ff" }}>
                            {/* REPORT */} <br />
                            <div className="row mb-5">
                                <div className="col-md-4"><h4 style={{ paddingLeft: "3%" }}>View Report</h4></div>
                                <div className="col-md-4">
                                    <select name="" id="" className="form-control">
                                        <option value="">ONE</option>
                                        <option value="">TWO</option>
                                        <option value="">THREE</option>
                                        <option value="">FOUR</option>
                                        <option value="">FIVE</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-primary btn-block" style={{ backgroundColor: "#183e4f", borderColor: "#183e4f" }}>
                                        <b>SHOW REPORT</b>
                                    </button>
                                </div>
                            </div>
                            {/* TABLE */}
                            <div className="row">
                                <div className="col-md-12">
                                    <table className="table table-borderless text-center" id="tableReport">
                                        <thead style={{ transform: "scaleX(1.01)", fontSize: "12px", backgroundColor: "#dbe3ea", borderColor: "#dbe3ea" }}>
                                            <tr>
                                                <th onClick={() => this.sortTable(0)}>U ID</th>
                                                <th onClick={() => this.sortTable(1)}>USERNAME</th>
                                                <th onClick={() => this.sortTable(2)}>NAME</th>
                                                <th onClick={() => this.sortTable(3)}>ROOM</th>
                                                <th>line</th>
                                                <th onClick={() => this.sortTable(4)}>PHONE</th>
                                                <th onClick={() => this.sortTable(5)}>WALLET</th>
                                                <th onClick={() => this.sortTable(6)}>LAST DEPOSIT</th>
                                                <th onClick={() => this.sortTable(7)}>LAST LOGIN</th>
                                                <th onClick={() => this.sortTable(8)}>REGISTER DATE</th>
                                                <th>CHECK</th>
                                            </tr>
                                        </thead>
                                        <tbody id="report">
                                            {this.state.showData.map((v, index) => (
                                                <tr key={index} style={this.getResult()[index] ? {backgroundColor:"#ffcccc"} :{}}>
                                                {/* <tr key={index}> */}
                                                    <td>{v.uid}</td>
                                                    <td>{v.username}</td>
                                                    <td>{v.real_name}</td>
                                                    <td>
                                                        <select className="form-control" value="roomName" onChange={()=>this.selectRoom()}>
                                                            <option  value={v.room}>{v.room}</option>
                                                            <option value="A">Apple</option>
                                                            <option value="B">Banana</option>
                                                            <option value="C">Cranberry</option>
                                                        </select>
                                                    </td>
                
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="ID Line"/>
                                                    </td>
                                                    <td>{v.tel_no}</td>
                                                    <td>{v.wallet}</td>
                                                    <td style={{ fontSize: "12px" }}>{v.last_deposit.toISOString().split('T')[0]}</td>
                                                    <td style={{ fontSize: "12px", width: "100px" }}>{v.last_login_dt.toISOString().split('T')[0]}</td>
                                                    <td style={{ fontSize: "12px" }}>{v.register_date.toISOString().split('T')[0]}</td>
                                                    <td>
                                                        <input type="checkbox" name="" id="" className="form-check-input scale-check" />
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAGINATION */} 
                    {/* <div className="row my-5" style={{ margin: "0" }}>
                        <div className="col-md-11">
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center">
                                    <li className="page-item" id="prevBtn">
                                        <a className="page-link" href="/#" style={{ color: "#183e4f" }} id="btn_prev" onClick={() => this.prevPage()}>Previous</a>
                                    </li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(1)}>1</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(2)}>2</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(3)}>3</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(4)}>4</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(5)}>5</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(6)}>6</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(7)}>7</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(8)}>8</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(9)}>9</a></li>
                                    <li className="page-item"><a className="page-link" href="/#" style={{ color: "#183e4f" }} onClick={() => this.numberPage(10)}>10</a></li>
                                    <li className="page-item" id="nextBtn">
                                        <a className="page-link" href="/#" style={{ color: "#183e4f" }} id="btn_next" onClick={() => this.nextPage()}>Next</a>
                                    </li>
                                </ul>
                            </nav><span id="page"></span>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-primary" style={{ backgroundColor: "#183e4f", borderColor: "#183e4f" }}>Delete</button>
                        </div>
                    </div> */}


                {/* </div> */}

            </div>

        );

    }

}
export default Table;
