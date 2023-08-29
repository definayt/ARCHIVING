import DigitalFormat from "../models/DigitalFormatModel.js";

export const getDigitalFormats = async(req, res) => {
    try{
        const response = await DigitalFormat.findAll({
            // attributes: ['uuid', 'digital_format']
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getDigitalFormatById = async(req, res) => {
    try{
        const response = await DigitalFormat.findOne({
            attributes: ['uuid', 'digital_format'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const createDigitalFormat = async(req, res) => {
    const {digital_format} = req.body;
    try{
        await DigitalFormat.create({
            digital_format: digital_format
        })
        res.status(201).json({msg: "Digital Format Berhasil Ditambahkan"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const updateDigitalFormat = async(req, res) => {
    const digform = await DigitalFormat.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!digform) return res.status(404).json({msg: "Digital Format tidak ditemukan"});
    const {digital_format} = req.body;
    try{
        await DigitalFormat.update({
            digital_format: digital_format
        }, {
            where: {
                id: digform.id
            }
        })
        res.status(200).json({msg: "Digital Format berhasil diubah"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const deleteDigitalFormat = async(req, res) => {
    const digform = await DigitalFormat.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!digform) return res.status(404).json({msg: "Digital Format tidak ditemukan"});    
    try{
        await DigitalFormat.destroy({
            where: {
                id: digform.id
            }
        })
        res.status(200).json({msg: "Digital Format berhasil dihapus"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}