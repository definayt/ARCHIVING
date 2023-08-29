import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const FormEditCategory = () => {
    const [category, setCategory] = useState("");
    const [code, setCode] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/categories");
    };

    useEffect(() => {
        const getCategoryById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/categories/${id}`);
                setCode(response.data.code);
                setCategory(response.data.category);
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getCategoryById();
    }, [id]);
    
    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/categories/${id}`, {
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
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data berhasil disimpan."}  />
        <h1 className='title has-text-centered mt-3'>Kategori</h1>
        <h2 className='subtitle has-text-centered'>Edit Kategori</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={updateCategory}>
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

export default FormEditCategory