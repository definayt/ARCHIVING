import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SuccessModal from './SuccessModal';

const FormAddDigitalData = () => {
    const [title, setTitle] = useState("");
    const [digital_format, setDigitalFormat] = useState("");
    const [digitalFormatOptions, setDigitalFormatOptions] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/digital-data");
    };

    const saveDigitalData = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/digital-data", {
                title:title,
                digitalFormatId: digital_format.value,
                file_digital: "file",
            });
            toggleModal();
        } catch (error) {
            if(error.response){
                setShowMessageError(true);
                setMsg(error.response.data.msg);
            }
        }
    };

    useEffect(()=>{
        getDigitalFormat();
    }, []);

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

  return (
    <div>
        <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Data berhasil ditambahkan."}  />
        <h1 className='title has-text-centered mt-3'>Data Digital</h1>
        <h2 className='subtitle has-text-centered'>Tambah Data Digital</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={saveDigitalData}>
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
                                    placeholder='Nama' />
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

export default FormAddDigitalData