import React from 'react'
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

const UserList = () => {
    $(document).ready(function () {
        setTimeout(function(){
        $('#datatable').DataTable();
         } ,1000);
    });
  return (
    <div>
        <h1 className='title'>Users</h1>
        <h2 className='subtitle'>List of Users</h2>
        <table id='datatable' className='table is-striped is-fullwidth'>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
               
            </tbody>
        </table>
    </div>
  )
}

export default UserList