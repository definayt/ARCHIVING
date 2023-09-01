import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import CollectionService from "../services/CollectionService";
import { useTable } from "react-table";
import { Link, useNavigate } from 'react-router-dom';

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

    navigate(`/collections/edit/${id}`)
  };

  const deleteCollection = (rowIndex) => {
    const id = collectionRef.current[rowIndex].id;

    CollectionService.remove(id)
      .then((response) => {
        props.history.push("/collection");

        let newCollection = [...collectionRef.current];
        newCollection.splice(rowIndex, 1);

        setCollection(newCollection);
      })
      .catch((e) => {
        console.log(e);
      });
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
        Header: "Kategori",
        accessor: "category.category",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openCollection(rowIdx)}>
                <button className='button bulma is-small is-rounded is-warning mr-2'> Edit</button>
              </span>

              <span onClick={() => deleteCollection(rowIdx)}>
              <button className='button bulma is-small is-rounded is-danger mr-2'> Hapus</button>
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
      
      <div className="buttons is-right">
          <Link to={"/collections/add"} className='button is-primary mb-2'>Tambah</Link>
      </div>
      <div className="columns is-right">
        <div className="column is-one-quarter">
          <input
            type="text"
            className="input"
            placeholder="Cari Berdasarkan Judul"
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
        </div>
      </div>
    </div>
  );
};

export default CollectionList;