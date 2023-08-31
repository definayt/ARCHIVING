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

const UserList = () => {
    const [users, setUsers] = useState([]);
    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    useEffect(()=>{
        getUsers();
    }, []);
    const navigate = useNavigate();
    const getUsers = async () => {
        await axios.get('http://localhost:5000/users')
            .then((response) => {
                setUsers(response.data);
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
    const [userIdState, setUserIdState] = useState("");
    const toggleModalDelete = (dataId) => {
        setModalDeleteState(!modalDeleteState);
        setUserIdState(dataId);
    };

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        window.location.reload(false);
    };

    const deleteUser = async (userId) => {
        await axios.delete(`http://localhost:5000/users/${userId}`);
        
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
                    title: date+'_'+'Data User Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'pdfHtml5',
                    // eslint-disable-next-line no-useless-concat
                    title: date+'_'+'Data User Sistem Archiving Balai Pustaka',
                    className: 'button is-small',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'print',
                    // eslint-disable-next-line no-useless-concat
                    title: 'Data User Sistem Archiving Balai Pustaka',
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
        <h1 className='title has-text-centered mt-3'>Pengguna</h1>
        <h2 className='subtitle has-text-centered'>Daftar Pengguna</h2>
        
        <div className="buttons is-right">
            <Link to={"/users/add"} className='button is-primary mb-2'>Tambah</Link>
        </div>
        <table id='datatable' className='table is-striped' style={{minWidth: "100%"}}>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style={{minWidth: "130px"}}>Aksi</th>
                </tr>
            </thead>
            <tbody>
               {users.map((user, index) => (
                <tr key={user.uuid}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                        <Link to={`/users/edit/${user.uuid}`} className='button bulma is-small is-rounded is-warning mr-2'> Edit</Link>
                        <button onClick={() => toggleModalDelete(user.uuid) } className='button bulma is-small is-rounded is-danger'> Delete</button>
                        <DeleteConfirmation confirmModal={deleteUser} hideModal={toggleModalDelete} modalState={modalDeleteState} dataId={userIdState}  />
                    </td>
                </tr>
               ))}
            </tbody>
        </table>
    </div>
  )
}

export default UserList