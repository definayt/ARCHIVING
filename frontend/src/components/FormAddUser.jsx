import React, {useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';

const FormAddUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/users", {
                name:name,
                email: email,
                password: password,
                confPassword: confPassword,
                role: role.value,
            });
            navigate("/users");
        } catch (error) {
            if(error.response){
                setMsg(error.response.data.msg);
            }
        }
    };

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
                    <form onSubmit={saveUser}>
                        <p className='hastest-center'>{msg}</p>
                        <div className="field">
                            <label className="label">Nama</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder='Nama' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input 
                                    type="email" 
                                    className="input" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder='Email' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input 
                                    type="password" 
                                    className="input" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder='Password'
                                    required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Konfirmasi Password</label>
                            <div className="control">
                                <input 
                                    type="password" 
                                    className="input" 
                                    value={confPassword} 
                                    onChange={(e) => setConfPassword(e.target.value)} 
                                    placeholder='Konfirmasi Password'
                                    required />
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
                                    value={role} 
                                    onChange={(e) => setRole(e)}
                                    options={roleOptions}
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <Link to={"/users"} className="button is-danger mr-2">Batal</Link>
                                <button type='submit' className="button is-success">Simpan</button>
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