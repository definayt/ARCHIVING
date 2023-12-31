import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const FormEditDigitalFormat = () => {
    const [digital_format, setDigitalFormat] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/digital-format");
    };

    useEffect(() => {
        const getDigitalFormatById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/digital-format/${id}`);
                setDigitalFormat(response.data.digital_format);
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDigitalFormatById();
    }, [id]);
    
    const updateDigitalFormat = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/digital-format/${id}`, {
                digital_format : digital_format,
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
        <h1 className='title has-text-centered mt-3'>Format Digital</h1>
        <h2 className='subtitle has-text-centered'>Edit Format Digital</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={updateDigitalFormat}>
                        <article className="message is-danger" style={{display: showMessageError ? 'block' : 'none' }}>
                            <div className="message-body">
                            {msg}
                            </div>
                        </article>
                        <div className="field">
                            <label className="label">Format Digital</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={digital_format} 
                                    onChange={(e) => setDigitalFormat(e.target.value)} 
                                    placeholder='Format Digital' />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <div className='buttons is-centered'>
                                    <Link to={"/digital-format"} className="button is-danger mr-2">Batal</Link>
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

export default FormEditDigitalFormat