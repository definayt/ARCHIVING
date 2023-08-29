import Language from "../models/LanguageModel.js";

export const getLanguages = async(req, res) => {
    try{
        const response = await Language.findAll({
            attributes: ['id','uuid', 'language']
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getLanguageById = async(req, res) => {
    try{
        const response = await Language.findOne({
            attributes: ['uuid', 'language'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const createLanguage = async(req, res) => {
    const {language} = req.body;
    try{
        await Language.create({
            language: language
        })
        res.status(201).json({msg: "Bahasa Berhasil Ditambahkan"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const updateLanguage = async(req, res) => {
    const lang = await Language.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!lang) return res.status(404).json({msg: "Bahasa tidak ditemukan"});
    const {language} = req.body;
    try{
        await Language.update({
            language: language
        }, {
            where: {
                id: lang.id
            }
        })
        res.status(200).json({msg: "Bahasa berhasil diubah"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const deleteLanguage = async(req, res) => {
    const lang = await Language.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!lang) return res.status(404).json({msg: "Bahasa tidak ditemukan"});    
    try{
        await Language.destroy({
            where: {
                id: lang.id
            }
        })
        res.status(200).json({msg: "Bahasa berhasil dihapus"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}