import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import CollectionService from "../services/CollectionService";
import { useTable } from "react-table";
import {IoEye, IoPencil, IoTrash} from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmation from './DeleteConfirmation';
import SuccessModal from './SuccessModal';
import axios from 'axios';

const CollectionList = (props) => {
  const navigate = useNavigate();
  const [collection, setCollection] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const collectionRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageSizes = [10, 50, 100];

  collectionRef.current = collection;

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["title"] = searchTitle;
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
    const params = getRequestParams(searchTitle, page, pageSize);

    CollectionService.getAll(params)
      .then((response) => {
        const { collection, totalPages } = response.data;

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
        Header: "Writer",
        accessor: "writer",
      },
      {
        Header: "Tahun Terbit Cetakan ke-1",
        accessor: "publish_1st_year",
      },
      {
        Header: "Tahun Terbit Cetakan Terakhir",
        accessor: "publish_last_year",
      },
      {
        Header: "Kategori",
        accessor: "category.category",
      },
      {
        Header: "Jenis Cerita",
        accessor: "story_type.story_type",
      },
      {
        Header: "Bahasa",
        accessor: "language.language",
      },
      {
        Header: "Actions",
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
  } = useTable({
    columns,
    data: collection,
  });

  return (
    <div className="list rowcolumns">
      <h1 className='title has-text-centered mt-3'>Koleksi</h1>
      <h2 className='subtitle has-text-centered'>Daftar Koleksi</h2>
      
      
      <div className="columns">
        <div className="column is-one-quarter">
          <input
            type="text"
            className="input"
            placeholder="Cari Data"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          </div>
          <div className="column">
            <button
              className="button is-link"
              type="button"
              onClick={findByTitle}
            >
              Cari
            </button>
          </div>
          <div className="column">
            <div className="buttons is-right">
                <Link to={"/collections/add"} className='button is-primary mb-2'>Tambah</Link>
                <Link to={"/collections"} className='button is-info mb-2'>Cetak</Link>
            </div>
          </div>
      </div>

      <div className="is-fullWidth">
        <div className="my-3">
          {"Data per Halaman: "}
          <select className="select is-primary" onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>

        <div style={{overflowX: "auto"}}>
        <table
          className="table is-striped is-bordered is-fullWidth"
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

        </div>
      </div>
    </div>
  );
};

export default CollectionList;