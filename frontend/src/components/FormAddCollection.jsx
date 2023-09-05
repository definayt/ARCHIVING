import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SuccessModal from './SuccessModal';
import RRMultiSelect from 'rr-multi-select';
import InputMask from "react-input-mask";

const FormAddCollection = () => {
    const [no_bp, setNoBP] = useState("");
    const [isbn, setISBN] = useState("");
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [publish_1st_year, setPublish1stYear] = useState("");
    const [publish_last_year, setPublishLastYear] = useState("");
    const [amount_printed, setAmountPrinted] = useState("");
    const [category, setCategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [story_type, setStoryType] = useState("");
    const [storyTypeOptions, setStoryTypeOptions] = useState([]);
    const [language, setLanguage] = useState("");
    const [languageOptions, setLanguageOptions] = useState([]);
    const [digital_data, setDigitalData] = useState([]);
    const [digitalDataOptions, setDigitalDataOptions] = useState([]);
    const [msg, setMsg] = useState("");
    const [showMessageError, setShowMessageError] = useState(false);
    const navigate = useNavigate();

    const [modalState, setModalState] = useState(false);
    
    const toggleModal = () => {
        setModalState(!modalState);
    };
    const navigation = () => {
        navigate("/collection");
    };

    function replaceCharacter(string, index, replacement) {
        return (
          string.slice(0, index) +
          replacement +
          string.slice(index + replacement.length)
        );
      }

    const saveCollection = async (e) => {
        e.preventDefault();
        try {
            let digitalDataId = [];
            digital_data.forEach(element => {
                digitalDataId.push(element.value);
            });
            let no_bp_remove = no_bp.replace(/_/g," ");
            let publish_1st_year_remove = publish_1st_year.replace(/[^\d]/g,"0");
            let publish_last_year_remove = publish_last_year.replace(/[^\d]/g,"0");
            let isbn_remove = isbn;
            if(isbn.charAt(13) === "_"){
                isbn_remove = replaceCharacter(isbn_remove, 16, " ");
                isbn_remove = replaceCharacter(isbn_remove, 15, " ");
                isbn_remove = replaceCharacter(isbn_remove, 14, " ");
                isbn_remove = replaceCharacter(isbn_remove, 13, " ");
            }
            await axios.post("http://localhost:5000/collections", {
                no_bp: no_bp_remove,
                isbn: isbn_remove,
                title: title,
                writer: writer,
                publish_1st_year: publish_1st_year_remove,
                publish_last_year: publish_last_year_remove,
                amount_printed: amount_printed,
                categoryId: category.value,
                storyTypeId: story_type.value,
                languageId: language.value,
                digitalDataId: digitalDataId
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
                                <InputMask 
                                    className="input"
                                    mask="*****" 
                                    maskplaceholder="xxxxx"
                                    value={no_bp} 
                                    onChange={(e) => setNoBP(e.target.value)} 
                                    placeholder='Nomor BP'
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">ISBN</label>
                            <div className="control">
                                <InputMask 
                                    className="input"
                                    mask="999-999-999-*99-*" 
                                    maskplaceholder="xxx-xxx-xxx-xxx-x"
                                    value={isbn} 
                                    onChange={(e) => setISBN(e.target.value)} 
                                    placeholder='ISBN'
                                />
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
                                <InputMask 
                                    className="input"
                                    mask="9999" 
                                    maskplaceholder="xxxx"
                                    value={publish_1st_year} 
                                    onChange={(e) => setPublish1stYear(e.target.value)} 
                                    placeholder='Tahun Terbit Cetakan Pertama'
                                    minLength={4}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tahun Cetakan Terakhir</label>
                            <div className="control">
                                <InputMask 
                                    className="input"
                                    mask="9999" 
                                    maskplaceholder="xxxx"
                                    value={publish_last_year} 
                                    onChange={(e) => setPublishLastYear(e.target.value)} 
                                    placeholder='Tahun Cetakan Terakhir'
                                    minLength={4}
                                />
                                
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Jumlah Cetakan</label>
                            <div className="control">
                                <input 
                                    type="number" 
                                    min={0}
                                    step={1}
                                    onKeyPress={(event) => {
                                        if (event.charCode < 48) {
                                          event.preventDefault();
                                        }
                                      }}
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
                                <RRMultiSelect
                                    classNamePrefix="select"
                                    options={digitalDataOptions}
                                    isObject={["value","label"]}
                                    value={digital_data}
                                    onChange={setDigitalData}
                                    inputPlaceholder="Ketik untuk mencari data.."
                                />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <div className='buttons is-centered'>
                                    <Link to={"/collection"} className="button is-danger mr-2">Batal</Link>
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