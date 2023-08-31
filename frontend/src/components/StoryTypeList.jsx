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

const StoryTypeList = () => {
    const [storyTypes, setStoryType] = useState([]);
    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    useEffect(()=>{
        getStoryTypes();
    }, []);
    const navigate = useNavigate();
    const getStoryTypes = async () => {
        await axios.get('http://localhost:5000/story-types')
            .then((response) => {
                setStoryType(response.data);
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
    const [storyTypeIdState, setStoryTypeIdState] = useState("");
    const toggleModalDelete = (dataId) => {
        setModalDeleteState(!modalDeleteState);
        setStoryTypeIdState(dataId);
    };

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        window.location.reload(false);
    };

    const deleteStoryType = async (storyTypeId) => {
        await axios.delete(`http://localhost:5000/story-types/${storyTypeId}`);
        
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
                    title: date+'_'+'Data Jenis Cerita Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'pdfHtml5',
                    // eslint-disable-next-line no-useless-concat
                    title: date+'_'+'Data Jenis Cerita Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'print',
                    // eslint-disable-next-line no-useless-concat
                    title: 'Data Jenis Cerita Sistem Archiving Balai Pustaka',
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
        <h1 className='title has-text-centered mt-3'>Jenis Cerita</h1>
        <h2 className='subtitle has-text-centered'>Daftar Jenis Cerita</h2>
        
        <div className="buttons is-right">
            <Link to={"/story-types/add"} className='button is-primary mb-2'>Tambah</Link>
        </div>
        <table id='datatable' className='table is-striped' style={{minWidth: "100%"}}>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Jenis Cerita</th>
                    <th style={{minWidth: "130px"}}>Aksi</th>
                </tr>
            </thead>
            <tbody>
               {storyTypes.map((storyType, index) => (
                <tr key={storyType.uuid}>
                    <td>{index + 1}</td>
                    <td>{storyType.code}</td>
                    <td>{storyType.story_type}</td>
                    <td>
                        <Link to={`/story-types/edit/${storyType.uuid}`} className='button bulma is-small is-rounded is-warning mr-2'> Edit</Link>
                        <button onClick={() => toggleModalDelete(storyType.uuid) } className='button bulma is-small is-rounded is-danger'> Delete</button>
                        <DeleteConfirmation confirmModal={deleteStoryType} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={storyTypeIdState}  />
                    </td>
                </tr>
               ))}
            </tbody>
        </table>
    </div>
  )
}

export default StoryTypeList