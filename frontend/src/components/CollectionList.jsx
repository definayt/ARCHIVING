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
        try {
            showSpinner();
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
            
        } catch (error) {
            
        }finally {
            
        }
        
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
            } ],
            // serverSide: true,
            // ordering: false,
            // scrollY: 500,
            // scroller: {
            //     loadingIndicator: true
            // },
            // ajax: function (data, callback, settings) {
            //     let out = [];
         
            //     for (var i = data.start, ien = data.start + data.length; i < ien; i++) {
            //         let no_bp, isbn, title, writer, publish_1st_year, publish_last_year, amount_printed,
            //             category, story_type, language, uuid;
            //         if(collections && collections.length){
            //             uuid = collections[i].uuid ? collections[i].uuid : "-";
            //             no_bp = collections[i].no_bp ? collections[i].no_bp : "-";
            //             isbn = collections[i].isbn ? collections[i].isbn : "-";
            //             title = collections[i].title ? collections[i].title : "-";
            //             writer = collections[i].writer ? collections[i].writer : "-";
            //             publish_1st_year = collections[i].publish_1st_year ? collections[i].publish_1st_year : "-";
            //             publish_last_year = collections[i].publish_last_year ? collections[i].publish_last_year : "-";
            //             amount_printed = collections[i].amount_printed ? collections[i].amount_printed : "-";
            //             category = collections[i].category.category ? collections[i].category.category : "-";
            //             story_type = collections[i].story_type.story_type ? collections[i].story_type.story_type : "-";
            //             language = collections[i].language.language ? collections[i].language.language : "-";
            //             publish_1st_year = collections[i].publish_1st_year ? collections[i].publish_1st_year : "-";
            //         }else{
            //             uuid = no_bp = isbn = title = writer = publish_1st_year = publish_last_year = amount_printed = category = story_type = language = "-";
            //         }
                    
            //         out.push([
            //             i+1, 
            //             no_bp, 
            //             isbn, 
            //             title, 
            //             writer,
            //             publish_1st_year,
            //             publish_last_year,
            //             amount_printed,
            //             category,
            //             story_type,
            //             language,
            //             language,
            //             uuid
            //             // buttonAction(uuid)
            //         ]);
            //     }
         
            //     setTimeout(() => {
            //         callback({
            //             draw: data.draw,
            //             data: out,
            //             recordsTotal: collections.length,
            //             recordsFiltered: collections.length
            //         });
            //     }, 50);
            // },
        });
    } 
    $(document).ready(function () {
        setTimeout(function(){
            drawDataTable();
        } ,1000);
        setTimeout(function(){
            hideSpinner();
        } ,10000);
    });

    // function buttonAction(uuid){
    //     return(
    //         <div>
    //             <Link to={`/collections/view/${uuid}`} className='button bulma is-small is-rounded is-info mr-2'> Lihat</Link>
    //             <Link to={`/collections/edit/${uuid}`} className='button bulma is-small is-rounded is-warning mr-2'> Edit</Link>
    //             <button onClick={() => toggleModalDelete(uuid) } className='button bulma is-small is-rounded is-danger'> Delete</button>
    //             <DeleteConfirmation confirmModal={deleteCollection} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={collectionIdState}  />
    //         </div>
    //     )
    // }
    const [display_value, setDisplayValue] = useState("none");
    const [display_table, setDisplayTable] = useState("none");
    function showSpinner() {
        setDisplayValue("block");
        setDisplayTable("none");
    }
      
    function hideSpinner() {
        setDisplayValue("none");
        setDisplayTable("block");
    }
  return (
    <div>
        <div style={{display: display_value}} className='column is-fullWidth'>
            <div className='equal-height'>
                <div className='is-flex is-horizontal-center'>
                    <figure className='image is-64x64'>
                    <img alt='loading'  src="http://chimplyimage.appspot.com/images/samples/classic-spinner/animatedCircle.gif" />
                        </figure>
                </div>
            </div>
        </div>
        <div style={{display: display_table}}>
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data Berhasil Dihapus"}  />
        <h1 className='title has-text-centered mt-3'>Koleksi</h1>
        <h2 className='subtitle has-text-centered'>Daftar Koleksi</h2>
        
        <div className="buttons is-left">
            <Link to={"/collection"} className='button is-danger mb-2'>Kembali</Link>
        </div>
        <table id='datatable' className='table is-striped' style={{fontSize: "12px", minWidth: "100%"}}>
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
                    {/* <th >Aksi</th> */}
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
                    
                    {/* <td>
                        <Link to={`/collections/view/${collection.uuid}`} className='button bulma is-small is-rounded is-info mr-2'> Lihat</Link>
                        <Link to={`/collections/edit/${collection.uuid}`} className='button bulma is-small is-rounded is-warning mr-2'> Edit</Link>
                        <button onClick={() => toggleModalDelete(collection.uuid) } className='button bulma is-small is-rounded is-danger'> Delete</button>
                        <DeleteConfirmation confirmModal={deleteCollection} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={collectionIdState}  />
                    </td> */}
                </tr>
               ))}
            </tbody>
        </table>
        </div>
    </div>
    
  )
}

export default CollectionList