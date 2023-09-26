import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import Service from "../services/Service";
import { useTable, useFlexLayout } from "react-table";
import {IoEye, IoPencil, IoTrash} from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmation from './DeleteConfirmation';
import SuccessModal from './SuccessModal';
import axios from 'axios';
import Select from 'react-select';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import ExportCollectionModal from "./ExportCollectionModal";
import RRMultiSelect from 'rr-multi-select';
import { useSelector } from 'react-redux';

const CollectionsCategoryList = (props) => {
  
  const {user} = useSelector((state => state.auth));
  var buttonAdd = "block";
  var actionButton = "actions";
  if((user && (user.role === "non-pustakawan" || user.role === "guest"))){
    buttonAdd = "none";
  }else{
    actionButton = "";
  }
  const navigate = useNavigate();
  const [collection, setCollection] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const collectionRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageSizes = [10, 50, 100];

  collectionRef.current = collection;

  const onChangeSearchInput = (e) => {
    const searchInput = e.target.value;
    setSearchInput(searchInput);
  };

  const [category, setCategory] = useState("");
  const [story_type, setStoryType] = useState("");
  const [language, setLanguage] = useState("");
  const [digital_format, setDigitalFormat] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [storyTypeOptions, setStoryTypeOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [digitalFormatOptions, setDigitalFormatOptions] = useState([]);
  const getCategories = async () => {
    await axios.get('http://localhost:5000/categories')
        .then((response) => {
            let arr = [];
            response.data.forEach(datum => {
                arr.push({
                    value : datum.id,
                    label : datum.category
                });
            });
            setCategoryOptions(arr);
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
  const getStoryTypes = async () => {
      await axios.get('http://localhost:5000/story-types')
          .then((response) => {
              let arr = [];
              response.data.forEach(datum => {
                  arr.push({
                      value : datum.id,
                      label : datum.story_type
                  });
              });
              setStoryTypeOptions(arr);
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
  const getLanguages = async () => {
      await axios.get('http://localhost:5000/languages')
          .then((response) => {
              let arr = [];
              response.data.forEach(datum => {
                  arr.push({
                      value : datum.id,
                      label : datum.language
                  });
              });
              setLanguageOptions(arr);
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
      getCategories();
      getStoryTypes();
      getLanguages();
      getDigitalFormat();
  }, []);

  const getRequestParams = (searchInput, category, story_type, language, digital_format, page, pageSize) => {
    let params = {};
    if(category){
      params["category"] = category.value;
    }

    if(story_type){
      params["story_type"] = story_type.value;
    }

    if(language){
      params["language"] = language.value;
    }

    if(digital_format){
      let digitalFormatId = [];
      digital_format.forEach(element => {
        digitalFormatId.push(element.value);
      });
      params["digital_format"] = digitalFormatId;
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

  const retrieveCollection = () => {
    const params = getRequestParams(searchInput, category, story_type, language, digital_format, page, pageSize);

    Service.getAllCollection(params)
      .then((response) => {
        const { collection, totalPages } = response.data;
        collection.forEach(element => {
          let digital_data = "";
          if(element.digital_collections.length !== 0 ){
            let j = 1;
            element.digital_collections.forEach(data => {
              if(j>1 && j !== element.digital_collections.length-1){
                digital_data+=", "
              }
              digital_data += data.digital_datum.digital_format.digital_format
              j += 1;
            });
          }else{
            digital_data = "Tidak ada";
          }
          element["digital_data"] = digital_data;
          console.log(digital_data);
        });
        setCollection(collection);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveCollection, [page, pageSize]);

  const refreshList = () => {
    retrieveCollection();
  };

  const findByTitle = () => {
    setPage(1);
    retrieveCollection();
  };

  const openCollection = (rowIndex) => {
    const id = collectionRef.current[rowIndex].uuid;

    navigate(`/collections/view/${id}`)
  };

  const editCollection = (rowIndex) => {
    const id = collectionRef.current[rowIndex].uuid;

    navigate(`/collections/edit/${id}`)
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

  const deleteCollection = (rowIndex) => {
    const id = collectionRef.current[rowIndex].uuid;
    toggleModalDelete(id);

  };
  const deleteDataCollection = async (collectionId) => {
    await axios.delete(`http://localhost:5000/collections/${collectionId}`);
    toggleModalDelete();
    toggleModal();
  }
  const [modalExportState, setModalExportState] = useState(false);
  const toggleModalExport = () => {
      setModalExportState(!modalExportState);
  };
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
        Header: "Nomor BP",
        accessor: "no_bp",
      },
      {
        Header: "ISBN",
        accessor: "isbn",
      },
      {
        Header: "Judul",
        accessor: "title",
      },
      {
        Header: "Penulis",
        accessor: "writer",
      },
      {
        Header: "Kategori",
        accessor: "category.category",
      },
      {
        Header: "Aksi",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openCollection(rowIdx)}>
                <button className='button bulma is-small is-rounded is-info mr-2'> <IoEye></IoEye></button>
              </span>

              <span onClick={() => editCollection(rowIdx)}>
                <button className='button bulma is-small is-rounded is-warning mr-2'> <IoPencil></IoPencil></button>
              </span>

              <span onClick={() => deleteCollection(rowIdx)}>
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
      data: collection,
      initialState: {
        hiddenColumns: actionButton
      }
    },
    // useFlexLayout
  );

  const [checkboxExportNoBP, setCheckboxExportNoBP] = useState(true);
  const [checkboxExportISBN, setCheckboxExportISBN] = useState(true);
  const [checkboxExportTitle, setCheckboxExportTitle] = useState(true);
  const [checkboxExportWriter, setCheckboxExportWriter] = useState(true);
  const [checkboxExport1stYear, setCheckboxExport1stYear] = useState(true);
  const [checkboxExportLastYear, setCheckboxExportlastYear] = useState(true);
  const [checkboxExportAmount, setCheckboxExportAmount] = useState(true);
  const [checkboxExportCategory, setCheckboxExportCategory] = useState(true);
  const [checkboxExportStoryType, setCheckboxExportStoryType] = useState(true);
  const [checkboxExportLanguage, setCheckboxExportLanguage] = useState(true);
  const [checkboxExportDataDigital, setCheckboxExportDataDigital] = useState(true);

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  var today = new Date(),
  date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()+'-'+today.getTime();
  const fileName = date+'_Koleksi';

  const exportToExcel = async () => {
    try {
      const params = getRequestParams(searchInput, category, story_type, language, digital_format, page, pageSize);
        await axios.get('http://localhost:5000/collections-export', {params: params})
        .then((response) => {
            const dataCollection = [];
            let i = 1;
            response.data.forEach(element => {
              let digital_data = "";
              if(element.digital_collections){
                let j = 1;
                element.digital_collections.forEach(data => {
                  if(j>1 && j !== element.digital_collections.length-1){
                    digital_data+=", "
                  }
                  digital_data += data.digital_datum.digital_format.digital_format
                  j += 1;
                });
              }
              let datum = {};
              datum["No"] = i;
              if(checkboxExportNoBP === true){
                datum["No BP"] = element.no_bp;
              }
              if(checkboxExportISBN === true){
                datum["ISBN"] = element.isbn;
              }
              if(checkboxExportTitle === true){
                datum["Judul"] = element.title;
              }
              if(checkboxExportWriter === true){
                datum["Penulis"] = element.writer;
              }
              if(checkboxExport1stYear === true){
                datum["Tahun Terbit Cetakan Pertama"] = element.publish_1st_year;
              }
              if(checkboxExportLastYear === true){
                datum["Tahun Terbit Cetakan Terakhir"] = element.publish_last_year;
              }
              if(checkboxExportAmount === true){
                datum["Jumlah Cetakan"] = element.amount_printed;
              }
              if(checkboxExportCategory === true){
                datum["Kategori"] = element.category.category;
              }
              if(checkboxExportStoryType === true){
                datum["Jenis Cerita"] = element.story_type.story_type;
              }
              if(checkboxExportLanguage === true){
                datum["Bahasa"] = element.language.language;
              }
              if(checkboxExportDataDigital === true){
                datum["Data Digital"] = digital_data;
              }
              dataCollection.push(datum);
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
      <h1 className='title has-text-centered mt-3'>Koleksi</h1>
      <h2 className='subtitle has-text-centered'>Daftar Koleksi Berdasarkan Kategori</h2>  
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
        </div>
        <div className="column is-one-quarter">
          <div className="field">
            <div className="control">
              <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={categoryOptions[0]}
                  isClearable="true"
                  isSearchable="true"
                  value={category} 
                  onChange={(e) => setCategory(e)}
                  options={categoryOptions}
                  placeholder="Filter Kategori.."
              ></Select>
            </div>
          </div>
          <div className="buttons is-right">
            <button className="button is-link is-outlined" type="button" onClick={findByTitle}>Cari</button>
            <button className="button is-success is-outlined" onClick={toggleModalExport}>Cetak</button>
          </div>
          </div>
          <div className="column">
            <div className="buttons is-right">
                <Link to={"/collections/add"} className='button is-primary mb-2' style={{display: buttonAdd}}>Tambah</Link>
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
          className="table is-striped is-bordered is-fullWidth" style={{fontSize: "15px"}}
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
        <DeleteConfirmation confirmModal={deleteDataCollection} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={collectionIdState}  />
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data Berhasil Dihapus"}  />
        <ExportCollectionModal 
          confirmModal={exportToExcel} 
          hideModal={toggleModalExport} 
          modalState={modalExportState} 
          dataIdNoBP={checkboxExportNoBP}  dataChangeNoBP={setCheckboxExportNoBP} 
          dataIdISBN = {checkboxExportISBN} dataChangeISBN = {setCheckboxExportISBN}
          dataIdTitle ={checkboxExportTitle} dataChangeTitle = {setCheckboxExportTitle}
          dataIdWriter = {checkboxExportWriter} dataChangeWriter = {setCheckboxExportWriter}
          dataId1stYear = {checkboxExport1stYear} dataChange1stYear = {setCheckboxExport1stYear}
          dataIdLastYear = {checkboxExportLastYear} dataChangeLastYear = {setCheckboxExportlastYear}
          dataIdAmount = {checkboxExportAmount} dataChangeAmount = {setCheckboxExportAmount}
          dataIdCategory = {checkboxExportCategory} dataChangeCategory = {setCheckboxExportCategory}
          dataIdStoryType = {checkboxExportStoryType} dataChengeStoryType = {setCheckboxExportStoryType}
          dataIdLanguage = {checkboxExportLanguage} dataChangeLanguage = {setCheckboxExportLanguage}
          dataIdDataDigital = {checkboxExportDataDigital} dataChangeDataDigital = {setCheckboxExportDataDigital}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionsCategoryList;