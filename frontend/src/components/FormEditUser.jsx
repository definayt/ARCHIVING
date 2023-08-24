import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const FormEditUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const roleOptions = [
        { value: 'guest', label: 'Guest'},
        { value: 'non-pustakawan', label: 'Non Pustakawan'},
        { value: 'pustakawan', label: 'Pustakawan'},
        { value: 'super-admin', label: 'Super Admin' },
      ];

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${id}`);
                setName(response.data.name);
                setEmail(response.data.email);
                roleOptions.forEach(element => {
                    if(element.value === response.data.role){
                        setRole(element);
                    }
                });
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getUserById();
    }, [id]);

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/users/${id}`, {
                name:name,
                email: email,
                password: password,
                confPassword: confPassword,
                role: role.value,
            });
            navigate("/users");
        } catch (error) {
            if(error.response){
                setShowMessageError(true);
                setMsg(error.response.data.msg);
            }
        }
    };

  return (
    <div>
        <h1 className='title has-text-centered mt-3'>Users</h1>
        <h2 className='subtitle has-text-centered'>Edit User</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={updateUser}>
                        <article class="message is-danger" style={{display: showMessageError ? 'block' : 'none' }}>
                            <div class="message-body">
                            {msg}
                            </div>
                        </article>
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
                                     />
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
                                     />
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
                                <div className='buttons is-centered'>
                                    <Link to={"/users"} className="button is-danger mr-2">Batal</Link>
                                    <button type='submit' className="button is-success">Simpan</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FormEditUser