import React from 'react';
import Select from 'react-select';

const FormAddUser = () => {
    const roleOptions = [
        { value: 'guest', label: 'Guest'},
        { value: 'non-pustakawan', label: 'Non Pustakawan'},
        { value: 'pustakawan', label: 'Pustakawan'},
        { value: 'super-admin', label: 'Super Admin' },
        
      ];
  return (
    <div>
        <h1 className='title'>Users</h1>
        <h2 className='subtitle'>Add User</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form>
                        <div className="field">
                            <label className="label">Nama</label>
                            <div className="control">
                                <input type="text" className="input" placeholder='Nama' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input type="text" className="input" placeholder='Email' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input type="password" className="input" placeholder='Password' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Konfirmasi Password</label>
                            <div className="control">
                                <input type="password" className="input" placeholder='Konfirmasi Password' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Role</label>
                            <div className="control">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={roleOptions[0]}
                                    isClearable="true"
                                    isSearchable="true"
                                    name="role"
                                    options={roleOptions}
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-success is-fullwidth">Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FormAddUser