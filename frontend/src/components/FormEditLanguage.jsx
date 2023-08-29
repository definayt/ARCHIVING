import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const FormEditLanguage = () => {
    const [language, setLanguage] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/languages");
    };

    useEffect(() => {
        const getLanguageById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/languages/${id}`);
                setLanguage(response.data.language);
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getLanguageById();
    }, [id]);
    
    const updateLanguage = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/languages/${id}`, {
                language : language,
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
        <h1 className='title has-text-centered mt-3'>Bahasa</h1>
        <h2 className='subtitle has-text-centered'>Edit Bahasa</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={updateLanguage}>
                        <article className="message is-danger" style={{display: showMessageError ? 'block' : 'none' }}>
                            <div className="message-body">
                            {msg}
                            </div>
                        </article>
                        <div className="field">
                            <label className="label">Bahasa</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={language} 
                                    onChange={(e) => setLanguage(e.target.value)} 
                                    placeholder='Nama' />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <div className='buttons is-centered'>
                                    <Link to={"/languages"} className="button is-danger mr-2">Batal</Link>
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

export default FormEditLanguage