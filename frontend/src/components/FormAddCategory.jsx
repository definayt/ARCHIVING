import React, {useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const FormAddCategory = () => {
    const [category, setCategory] = useState("");
    const [code, setCode] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/categories");
    };

    const saveCategory= async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/categories", {
                code : code,
                category : category,
            });
            toggleModal();
        } catch (error) {
            if(error.response){
                setShowMessageError(true);
                setMsg(error.response.data.msg);
            }
        }
    };

  return (
    <div>
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data berhasil ditambahkan."}  />
        <h1 className='title has-text-centered mt-3'>Kategori</h1>
        <h2 className='subtitle has-text-centered'>Tambah Kategori</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={saveCategory}>
                        <article className="message is-danger" style={{display: showMessageError ? 'block' : 'none' }}>
                            <div className="message-body">
                            {msg}
                            </div>
                        </article>
                        <div className="field">
                            <label className="label">Kode</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={code} 
                                    onChange={(e) => setCode(e.target.value)} 
                                    placeholder='Kode' />
                            </div>
                        </div>
                        <div className='field'>
                            <label className='label'>Kategori</label>
                            <div className='control'>
                                <input 
                                    type="text"
                                    className='input'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder='Kategori' />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <div className='buttons is-centered'>
                                    <Link to={"/categories"} className="button is-danger mr-2">Batal</Link>
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

export default FormAddCategory