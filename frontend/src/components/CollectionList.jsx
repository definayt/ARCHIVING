import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables";
import $ from 'jquery';
import 'datatables.net-buttons/css/buttons.dataTables.min.css';
import 'datatables.net-buttons/js/dataTables.buttons.min';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import pdfMake from 'pdfmake/build/pdfmake.min.js';
import  pdfFonts from 'pdfmake/build/vfs_fonts.js';
import "datatables.net-dt/css/jquery.dataTables.min.css";
import DeleteConfirmation from './DeleteConfirmation';
import SuccessModal from './SuccessModal';
const jzip = require( 'jszip/dist/jszip.min.js');
window.JSZip = jzip;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CollectionList = () => {
    const [collections, setCollections] = useState([]);
    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    useEffect(()=>{
        getCollections();
    }, []);
    const navigate = useNavigate();
    const getCollections = async () => {
        await axios.get('http://localhost:5000/collections')
            .then((response) => {
                setCollections(response.data);
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
    const navigation = () => {
        window.location.reload(false);
    };

    const deleteCollection = async (collectionId) => {
        await axios.delete(`http://localhost:5000/collections/${collectionId}`);
        
        toggleModalDelete();
        toggleModal();
    }

    const drawDataTable = () =>{
        $('#datatable').DataTable({
            "bDestroy": true,
            scrollX: true,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    // eslint-disable-next-line no-useless-concat
                    title: date+'_'+'Data Koleksi Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'pdfHtml5',
                    // eslint-disable-next-line no-useless-concat
                    title: date+'_'+'Data Koleksi Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'print',
                    // eslint-disable-next-line no-useless-concat
                    title: 'Data Koleksi Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'colvis',
                    text: 'Pilihan Kolom',
                    className: 'button is-small',
                }
            ],
            columnDefs: [ {
                // targets: -1,
                // visible: false
            } ]
        });
    } 
    $(document).ready(function () {
        setTimeout(function(){
            drawDataTable();
        } ,1000);
    });
  return (
    <div>
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data Berhasil Dihapus"}  />
        <h1 className='title has-text-centered mt-3'>Koleksi</h1>
        <h2 className='subtitle has-text-centered'>Daftar Koleksi</h2>
        
        <div className="buttons is-right">
            <Link to={"/collections/add"} className='button is-primary mb-2'>Tambah</Link>
        </div>
        <table id='datatable' className='table is-striped' style={{minWidth: "100%"}}>
            <thead>
                <tr>
                    <th>No</th>
                    <th>No BP</th>
                    <th>ISBN</th>
                    <th>Judul</th>
                    <th>Penulis</th>
                    <th>Tahun Cetakan Pertama</th>
                    <th>Tahun Cetakan Terakhir</th>
                    <th>Jumlah Cetakan</th>
                    <th>Kategori</th>
                    <th>Jenis Cerita</th>
                    <th>Bahasa</th>
                    <th>Data Digital</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
               {collections.map((collection, index) => (
                <tr key={collection.uuid}>
                    <td>{index + 1}</td>
                    <td>{collection.no_bp}</td>
                    <td>{collection.isbn}</td>
                    <td>{collection.title}</td>
                    <td>{collection.writer}</td>
                    <td>{collection.publish_1st_year}</td>
                    <td>{collection.publish_last_year}</td>
                    <td>{collection.amount_printed}</td>
                    <td>{collection.category.category}</td>
                    <td>{collection.story_type.story_type}</td>
                    <td>{collection.language.language}</td>
                    <td>{collection.digital_collections.map((data, index) => (
                        <p> - {data.digital_datum.digital_format.digital_format} <br /></p>
                    )
                    )}
                    </td>
                    
                    <td>
                        <Link to={`/collections/edit/${collection.uuid}`} className='button bulma is-small is-rounded is-warning mr-2'> Edit</Link>
                        <button onClick={() => toggleModalDelete(collection.uuid) } className='button bulma is-small is-rounded is-danger'> Delete</button>
                        <DeleteConfirmation confirmModal={deleteCollection} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={collectionIdState}  />
                    </td>
                </tr>
               ))}
            </tbody>
        </table>
    </div>
  )
}

export default CollectionList