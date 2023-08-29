import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const FormEditDigitalData = () => {
    const [title, setTitle] = useState("");
    const [digital_format, setDigitalFormat] = useState("");
    const [digitalFormatOptions, setDigitalFormatOptions] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/digital-data");
    };

    const getDigitalFormat = async () => {
        await axios.get('http://localhost:5000/digital-format')
            .then((response) => {
                let arr = [];
                response.data.forEach(datum => {
                    arr.push({
                        value : datum.id,
                        label : datum.digital_format
                    });
                });
                setDigitalFormatOptions(arr);
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

    useEffect(() => {
        getDigitalFormat();
    }, []);

    useEffect(() => {        
        const getDigitalDataById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/digital-data/${id}`);
                setTitle(response.data.title);
                digitalFormatOptions.forEach(element => {
                    if(element.value === response.data.digitalFormatId){
                        setDigitalFormat(element);
                    }
                });
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getDigitalDataById();
        
    }, [id]);
    
    const updateDigitalData = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/digital-data/${id}`, {
                title:title,
                digitalFormatId: digital_format.value,
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
        <h1 className='title has-text-centered mt-3'>Data Digital</h1>
        <h2 className='subtitle has-text-centered'>Edit Data Digital</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={updateDigitalData}>
                        <article className="message is-danger" style={{display: showMessageError ? 'block' : 'none' }}>
                            <div className="message-body">
                            {msg}
                            </div>
                        </article>
                        <div className="field">
                            <label className="label">Judul</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder='Judul' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Format Digital</label>
                            <div className="control">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={digitalFormatOptions[0]}
                                    isClearable="true"
                                    isSearchable="true"
                                    value={digital_format} 
                                    onChange={(e) => setDigitalFormat(e)}
                                    options={digitalFormatOptions}
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <div className='buttons is-centered'>
                                    <Link to={"/digital-data"} className="button is-danger mr-2">Batal</Link>
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

export default FormEditDigitalData