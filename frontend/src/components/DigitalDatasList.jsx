import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { useTable, useFlexLayout } from "react-table";
import { IoPencil, IoTrash} from "react-icons/io5";
import Service from "../services/Service";
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmation from './DeleteConfirmation';
import SuccessModal from './SuccessModal';
import axios from 'axios';
import Select from 'react-select';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import { useSelector } from 'react-redux';

const DigitalDataList = (props) => {
  const {user} = useSelector((state => state.auth));
  var buttonAdd = "block";
  var actionButton = "actions";
  if((user && (user.role === "non-pustakawan" || user.role === "guest"))){
    buttonAdd = "none";
  }else{
    actionButton = "";
  }
  const navigate = useNavigate();
  const [digitalData, setDigitalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const digitalDataRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageSizes = [10, 50, 100];

  digitalDataRef.current = digitalData;

  const onChangeSearchInput = (e) => {
    const searchInput = e.target.value;
    setSearchInput(searchInput);
  };

  const [digitalFormat, setDigitalFormat] = useState("");
  const [digitalFormatOptions, setDigitalFormatOptions] = useState([]);
  const getDigitalFormat = async () => {
    await axios.get('http://localhost:5000/digital-format')
        .then((response) => {
            let arr = [];
            response.data.forEach(datum => {
                arr.push({
                    value : datum.id,
                    label : datum.digital_format
                });
            });
            setDigitalFormatOptions(arr);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
  };
  useEffect(()=>{
      getDigitalFormat();
  }, []);

  const getRequestParams = (searchInput, digitalFormat, page, pageSize) => {
    let params = {};
    if(digitalFormat){
      params["digitalFormat"] = digitalFormat.value;
    }

    if (searchInput) {
      params["input"] = searchInput;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const retrieveDigitalData = () => {
    const params = getRequestParams(searchInput, digitalFormat, page, pageSize);
    Service.getAllDigitalData(params)
    .then((response) => {
        const { digitalData, totalPages } = response.data;

        setDigitalData(digitalData);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveDigitalData, [page, pageSize]);

  const refreshList = () => {
    retrieveDigitalData();
  };

  const findByTitle = () => {
    setPage(1);
    retrieveDigitalData();
  };

  const editDigitalData = (rowIndex) => {
    const id = digitalDataRef.current[rowIndex].uuid;

    navigate(`/digital-data/edit/${id}`)
  };
  const [modalDeleteState, setModalDeleteState] = useState(false);
  const [collectionIdState, setcollectionIdState] = useState("");
  const toggleModalDelete = (dataId) => {
      setModalDeleteState(!modalDeleteState);
      setcollectionIdState(dataId);
  };
  const [modalState, setModalState] = useState(false);
    
  const toggleModal = () => {
      setModalState(!modalState);
  };

  const deleteDigitalData = (rowIndex) => {
    const id = digitalDataRef.current[rowIndex].uuid;
    toggleModalDelete(id);

  };
  const deleteDataDigitalDB = async (digitalDataId) => {
    await axios.delete(`http://localhost:5000/digital-data/${digitalDataId}`);
    toggleModalDelete();
    toggleModal();
  }
  
  const navigation = () => {
    window.location.reload(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
         // When using the useFlexLayout:
      {
        Header: "No",
        accessor: "no",
        Cell: (props) => {
          const rowIdx = parseInt(props.row.id)+1;
          return (
            <div>
              {rowIdx}
            </div>
          );
        },
      },
      {
        Header: "Judul",
        accessor: "title",
        maxWidth: 1000,
        minWidth: 140,
        width: 500,
      },
      {
        Header: "Format Digital",
        accessor: "digital_format.digital_format",
      },
      // {
      //   Header: "ID",
      //   accessor: "id",
      // },
      {
        Header: "Aksi",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => editDigitalData(rowIdx)}>
                <button className='button bulma is-small is-rounded is-warning mr-2'> <IoPencil></IoPencil></button>
              </span>

              <span onClick={() => deleteDigitalData(rowIdx)}>
              <button className='button bulma is-small is-rounded is-danger mr-2'> <IoTrash></IoTrash></button>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
        columns,
        data: digitalData,
        initialState: {
          hiddenColumns: actionButton
        }
    },
    useFlexLayout
  );

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  var today = new Date(),
  date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()+'-'+today.getTime();
  const fileName = date+'_Data-Digital';

  const exportToExcel = async () => {
    try {
      const params = getRequestParams(searchInput, digitalFormat, page, pageSize);
        await axios.get('http://localhost:5000/digital-data-export', {params: params})
        .then((response) => {
            const dataCollection = [];
            let i = 1;
            response.data.forEach(element => {              
              dataCollection.push({
                "No" : i,
                "Judul" : element.title,
                "Format Digital" : element.digital_format.digital_format,
              })
              i += 1;
            });
            const ws = XLSX.utils.json_to_sheet(dataCollection);
            const wb = {Sheets: { 'data': ws}, SheetNames: ['data']};
            const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
        })
        .catch((error) => {
            // Error
            alert(error)
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
        
    } catch (error) {
        
    }        
  };
  
  return (
    <div className="list rowcolumns">
      <h1 className='title has-text-centered mt-3'>Data Digital</h1>
      <h2 className='subtitle has-text-centered'>Daftar Data Digital</h2>  
      <br /><br />    
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="field">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="Cari Data"
                value={searchInput}
                onChange={onChangeSearchInput}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={digitalFormatOptions[0]}
                  isClearable="true"
                  isSearchable="true"
                  value={digitalFormat} 
                  onChange={(e) => setDigitalFormat(e)}
                  options={digitalFormatOptions}
                  placeholder="Filter Format Digital.."
              ></Select>
            </div>
          </div>
          <div className="buttons is-right">
            <button className="button is-link is-outlined" type="button" onClick={findByTitle}>Cari</button>
            <button className="button is-success is-outlined" onClick={exportToExcel}>Cetak</button>
          </div>
          </div>
          <div className="column">
            <div className="buttons is-right">
                <Link to={"/digital-data/add"} className='button is-primary mb-2' style={{display: buttonAdd}}>Tambah</Link>
            </div>
          </div>
      </div>

      <div className="is-fullWidth">
        <div className="columns">
          <div className="column is-1">
            {"Data per Halaman : "}
          </div>
          <div className="column is-1">
            <select className="input" onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="column">
            <div className="is-pulled-right">
              <Pagination
                className=""
                count={count}
                page={page}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        <div style={{overflowX: "auto"}}>
        <table
          className="table is-striped is-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th className="has-text-centered" {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <DeleteConfirmation confirmModal={deleteDataDigitalDB} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={collectionIdState}  />
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data Berhasil Dihapus"}  />
        </div>
      </div>
    </div>
  );
};

export default DigitalDataList;