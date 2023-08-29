import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SuccessModal from './SuccessModal';

const FormAddCollection = () => {
    const [no_bp, setNoBP] = useState("");
    const [isbn, setISBN] = useState("");
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [publish_1st_year, setPublish1stYear] = useState("");
    const [publish_last_year, setPublishLastYear] = useState("");
    const [amount_printed, setAmountPrinted] = useState("");
    const [category, setCategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState("");
    const [story_type, setStoryType] = useState("");
    const [storyTypeOptions, setStoryTypeOptions] = useState("");
    const [language, setLanguage] = useState("");
    const [languageOptions, setLanguageOptions] = useState("");
    const [digital_data, setDigitalData] = useState([]);
    const [digitalDataOptions, setDigitalDataOptions] = useState("");
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/collections");
    };

    const saveCollection = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/collections", {
                title:title,
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
        getCategories();
        getStoryTypes();
        getLanguages();
        getDigitalData();
    }, []);

    const getCategories = async () => {
        await axios.get('http://localhost:5000/categories')
            .then((response) => {
                let arr = [];
                response.data.forEach(datum => {
                    arr.push({
                        value : datum.id,
                        label : datum.category
                    });
                });
                setCategoryOptions(arr);
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
    const getStoryTypes = async () => {
        await axios.get('http://localhost:5000/story-types')
            .then((response) => {
                let arr = [];
                response.data.forEach(datum => {
                    arr.push({
                        value : datum.id,
                        label : datum.story_type
                    });
                });
                setStoryTypeOptions(arr);
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
    const getLanguages = async () => {
        await axios.get('http://localhost:5000/languages')
            .then((response) => {
                let arr = [];
                response.data.forEach(datum => {
                    arr.push({
                        value : datum.id,
                        label : datum.language
                    });
                });
                setLanguageOptions(arr);
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
    const getDigitalData = async () => {
        await axios.get('http://localhost:5000/digital-data')
            .then((response) => {
                let arr = [];
                response.data.forEach(datum => {
                    arr.push({
                        value : datum.id,
                        label : datum.digital_format.digital_format+" - "+datum.title
                    });
                });
                setDigitalDataOptions(arr);
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
        <h1 className='title has-text-centered mt-3'>Koleksi</h1>
        <h2 className='subtitle has-text-centered'>Tambah Koleksi</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form onSubmit={saveCollection}>
                        <article className="message is-danger" style={{display: showMessageError ? 'block' : 'none' }}>
                            <div className="message-body">
                            {msg}
                            </div>
                        </article>
                        <div className="field">
                            <label className="label">Nomor BP</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={no_bp} 
                                    onChange={(e) => setNoBP(e.target.value)} 
                                    placeholder='Nomor BP' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">ISBN</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={isbn} 
                                    onChange={(e) => setISBN(e.target.value)} 
                                    placeholder='ISBN' />
                            </div>
                        </div>
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
                            <label className="label">Penulis</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={writer} 
                                    onChange={(e) => setWriter(e.target.value)} 
                                    placeholder='Penulis' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tahun Terbit Cetakan Pertama</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={publish_1st_year} 
                                    onChange={(e) => setPublish1stYear(e.target.value)} 
                                    placeholder='Tahun Terbit Cetakan Pertama' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tahun Cetakan Terakhir</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={publish_last_year} 
                                    onChange={(e) => setPublishLastYear(e.target.value)} 
                                    placeholder='Penulis' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Jumlah Cetakan</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={amount_printed} 
                                    onChange={(e) => setAmountPrinted(e.target.value)} 
                                    placeholder='Jumlah Cetakan' />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Kategori</label>
                            <div className="control">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={categoryOptions[0]}
                                    isClearable="true"
                                    isSearchable="true"
                                    value={category} 
                                    onChange={(e) => setCategory(e)}
                                    options={categoryOptions}
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Jenis Cerita</label>
                            <div className="control">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={storyTypeOptions[0]}
                                    isClearable="true"
                                    isSearchable="true"
                                    value={story_type} 
                                    onChange={(e) => setStoryType(e)}
                                    options={storyTypeOptions}
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Bahasa</label>
                            <div className="control">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={languageOptions[0]}
                                    isClearable="true"
                                    isSearchable="true"
                                    value={language} 
                                    onChange={(e) => setLanguage(e)}
                                    options={languageOptions}
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Data Digital</label>
                            <div className="control">
                                <Select
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isMulti
                                    defaultValue={[digitalDataOptions[0], digitalDataOptions[1]]}
                                    isClearable="true"
                                    isSearchable="true"
                                    value={digital_data} 
                                    onChange={(e) => setDigitalData(e)}
                                    options={digitalDataOptions}
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

export default FormAddCollection