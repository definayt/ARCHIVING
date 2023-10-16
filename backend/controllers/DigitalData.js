import DigitalData from "../models/DigitalDataModel.js";
import DigitalFormat from "../models/DigitalFormatModel.js";
import Users from "../models/UserModel.js";
import xlsx from "xlsx";
import db from "../config/Database.js";
const Op = db.Sequelize.Op;

export const getDigitalDatas = async(req, res) => {
    try{
        const response = await DigitalData.findAll({
            attributes: ['id','uuid', 'title', 'file_digital'],
            include:[
                { model: DigitalFormat, attributes: ['digital_format'] }, 
                { model: Users, attributes: ['name'] }, 
            ],
            order: [
                ['title', 'ASC'],
            ],
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getDigitalDataById = async(req, res) => {
    try{
        const response = await DigitalData.findOne({
            attributes: ['uuid', 'title', 'file_digital', 'digitalFormatId'],
            include:[
                { model: DigitalFormat, attributes: ['digital_format'] }, 
                { model: Users, attributes: ['name'] }, 
            ],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const createDigitalData = async(req, res) => {
    const {title, file_digital, digitalFormatId} = req.body;
    try{
        await DigitalData.create({
            title: title,
            file_digital: file_digital,
            digitalFormatId: digitalFormatId,
            userId: req.userId
        })
        res.status(201).json({msg: "Data Digital Berhasil Ditambahkan"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const updateDigitalData = async(req, res) => {
    const datadigital = await DigitalData.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!datadigital) return res.status(404).json({msg: "Data Digital tidak ditemukan"});
    const {title, file_digital, digitalFormatId, userId} = req.body;
    try{
        await DigitalData.update({
            title: title,
            file_digital: file_digital,
            digitalFormatId: digitalFormatId,
            userId: req.userId
        }, {
            where: {
                id: datadigital.id
            }
        })
        res.status(200).json({msg: "Data Digital berhasil diubah"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const deleteDigitalData = async(req, res) => {
    const datadigital = await DigitalData.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!datadigital) return res.status(404).json({msg: "Data Digital tidak ditemukan"});    
    try{
        await DigitalData.destroy({
            where: {
                id: datadigital.id
            }
        })
        res.status(200).json({msg: "Data Digital berhasil dihapus"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const readExcel = (req, res) => {
    try {
        const workbook = xlsx.readFile('./digital_data.xlsx');  // Step 2
        let workbook_sheet = workbook.SheetNames;                // Step 3
        let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
            workbook.Sheets[workbook_sheet[0]]
        );
        DigitalData.bulkCreate(workbook_response)
            .then(() => {
            res.status(200).json({
                msg: "Import Success",
            });
            })
            .catch((error) => {
            res.status(500).json({
                msg: error.message
            });
            }); 
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
    
}

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: digitalData } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, digitalData, totalPages, currentPage };
};

export const findAllDigitalData = (req, res) => {
    const { page, size, input, digitalFormat } = req.query;
    if(digitalFormat){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    
                },
                digitalFormatId : digitalFormat,
            }
        } : {
            [Op.and] : {
            digitalFormatId : digitalFormat,
            }
        };
    }else{
        var condition = input ? { 
            [Op.or] : {
                title: { [Op.like]: `%${input}%` },
            }
        } : null;
    }

    const { limit, offset } = getPagination(page, size);

    DigitalData.findAndCountAll({ 
        where: condition,
        limit, 
        offset,
        attributes: ['id','uuid', 'title', 'file_digital'],
        include:[
            { model: DigitalFormat, attributes: ['digital_format'] }, 
            { model: Users, attributes: ['name'] }, 
        ],
        order: [
            ['title', 'ASC'],
        ],
    })
    .then(data => {
    const response = getPagingData(data, page, limit);
    res.send(response);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving digital data."
    });
    });
};

export const exportExcelDigitalData = async(req, res) => {
    const { page, size, input, digitalFormat } = req.query;
    if(digitalFormat){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    
                },
                digitalFormatId : digitalFormat,
            }
        } : {
            [Op.and] : {
            digitalFormatId : digitalFormat,
            }
        };
    }else{
        var condition = input ? { 
            [Op.or] : {
                title: { [Op.like]: `%${input}%` },
            }
        } : null;
    }
    try {
        const response = await DigitalData.findAll({
            where: condition,
            attributes: ['id','uuid', 'title', 'file_digital'],
            include:[
                { model: DigitalFormat, attributes: ['digital_format'] }, 
                { model: Users, attributes: ['name'] }, 
            ],
            order: [
                ['title', 'ASC'],
            ],
        });
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
