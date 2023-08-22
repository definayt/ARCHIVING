import Categories from "../models/CategoryModel.js";
import Collections from "../models/CollectionModel.js";
import Languages from "../models/LanguageModel.js";
import StoryType from "../models/StoryTypeModel.js";
import Users from "../models/UserModel.js";
import DigitalCollections from "../models/DigitalCollectionModel.js";
import db from "../config/Database.js";
import DigitalData from "../models/DigitalDataModel.js";
import DigitalFormat from "../models/DigitalFormatModel.js";

export const getCollections = async(req, res) => {
    try {
        // reqnya dari middleware
        let response;
        if(req.role === "guest"){
            response = await Collections.findAll({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis'
                    ],
                include:[
                    { model: Categories, attributes: ['category'] }, 
                    { model: StoryType, attributes: ['story_type'] }, 
                    { model: Languages, attributes: ['language'] },  
                    { 
                        model: DigitalCollections, 
                        attributes: ['uuid'], 
                        include: [
                            { 
                                model: DigitalData, 
                                attributes: ['file_digital'],
                                include: [
                                    { model: DigitalFormat, attributes: ['digital_format'] }
                                ]
                             }
                        ]
                     },
                ]
            });
        }else{
            response = await Collections.findAll({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis'
                    ],
                include:[
                    { model: Categories, attributes: ['category'] }, 
                    { model: StoryType, attributes: ['story_type'] }, 
                    { model: Languages, attributes: ['language'] }, 
                    { model: Users, attributes: ['name'] }, 
                    { 
                        model: DigitalCollections, 
                        attributes: ['uuid'], 
                        include: [
                            { 
                                model: DigitalData, 
                                attributes: ['file_digital'],
                                include: [
                                    { model: DigitalFormat, attributes: ['digital_format'] }
                                ]
                             }
                        ]
                     },
                ]
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const getCollectionById = async(req, res) => {
    try {
        // req.role nya dari middleware
        let response;
        if(req.role === "guest"){
            response = await Collections.findOne({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis'
                    ],
                where: {
                    uuid: req.params.id
                },
                include:[
                    { model: Categories, attributes: ['category'] }, 
                    { model: StoryType, attributes: ['story_type'] }, 
                    { model: Languages, attributes: ['language'] },  
                    { 
                        model: DigitalCollections, 
                        attributes: ['uuid'], 
                        include: [
                            { 
                                model: DigitalData, 
                                attributes: ['file_digital'],
                                include: [
                                    { model: DigitalFormat, attributes: ['digital_format'] }
                                ]
                             }
                        ]
                     }, 
                ]
            });
        }else{
            response = await Collections.findAll({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis'
                    ],
                where: {
                    uuid: req.params.id
                },
                include:[
                    { model: Categories, attributes: ['category'] }, 
                    { model: StoryType, attributes: ['story_type'] }, 
                    { model: Languages, attributes: ['language'] }, 
                    { model: Users, attributes: ['name'] }, 
                    { 
                        model: DigitalCollections, 
                        attributes: ['uuid'], 
                        include: [
                            { 
                                model: DigitalData, 
                                attributes: ['file_digital'],
                                include: [
                                    { model: DigitalFormat, attributes: ['digital_format'] }
                                ]
                             }
                        ]
                     }, 
                ]
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createCollection = async(req, res) => {
    const {no_bp, isbn, title, writer, publish_1st_year, publish_last_year, amount_printed,
        synopsis, categoryId, storyTypeId, languageId, digitalDataId
    } = req.body;
    const trans = await db.transaction();
    const promises = [];
    let collectionId;
    try{
        await Collections.create({
            no_bp: no_bp,
            isbn: isbn,
            title: title,
            writer: writer,
            publish_1st_year: publish_1st_year,
            publish_last_year: publish_last_year,
            amount_printed: amount_printed,
            synopsis: synopsis,
            categoryId: categoryId, 
            storyTypeId: storyTypeId,
            languageId: languageId,
            userId: req.userId
        }, {transaction : trans}).then(async function (result) {
            collectionId = result.id;
            if(digitalDataId.length){
                digitalDataId.forEach( async element => {
                    promises.push(DigitalCollections.create({
                        collectionId: collectionId,
                        digitalDataId: element
                    }, { transaction: trans }));
                });
            }
        });
        await Promise.allSettled(promises); 
        await trans.commit();
        res.status(201).json({msg: "Koleksi Berhasil Ditambahkan"});
    } catch(error){
        await trans.rollback();
        res.status(400).json({msg: error.message});
    }
}

export const updateCollection = async(req, res) => {
    const collection = await Collections.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!collection) return res.status(404).json({msg: "Koleksi tidak ditemukan"});
    const {no_bp, isbn, title, writer, publish_1st_year, publish_last_year, amount_printed,
        synopsis, categoryId, storyTypeId, languageId, digitalDataId
    } = req.body;
    const trans = await db.transaction();
    const promises = [];
    let collectionId;
    try{
        await Collections.update({
            no_bp: no_bp,
            isbn: isbn,
            title: title,
            writer: writer,
            publish_1st_year: publish_1st_year,
            publish_last_year: publish_last_year,
            amount_printed: amount_printed,
            synopsis: synopsis,
            categoryId: categoryId, 
            storyTypeId: storyTypeId,
            languageId: languageId,
            userId: req.userId
        }, {
            where: {
                id: collection.id
            },
            transaction : trans
        });
        collectionId = collection.id;
        await DigitalCollections.destroy({
            where: {
                collectionId: collection.id
            }
        }, { transaction: trans });
        if(digitalDataId.length){
            digitalDataId.forEach( async element => {
                promises.push(DigitalCollections.create({
                    collectionId: collectionId,
                    digitalDataId: element
                }, { transaction: trans }));
            });
        }
        await Promise.allSettled(promises); 
        await trans.commit();
        res.status(200).json({msg: "Kategori berhasil diubah"});
    } catch(error){
        await trans.rollback();
        res.status(400).json({msg: error.message});
    }
}

export const deleteCollection = async(req, res) => {
    const collection = await Collections.findOne({
        where: {
            uuid: req.params.id
        }
    });
    const trans = await db.transaction();
    if(!collection) return res.status(404).json({msg: "Koleksi tidak ditemukan"});    
    try{
        await Collections.destroy({
            where: {
                id: collection.id
            }
        }, { transaction: trans });
        await DigitalCollections.destroy({
            where: {
                collectionId: collection.id
            }
        }, { transaction: trans });
        await trans.commit();
        res.status(200).json({msg: "Kategori berhasil dihapus"});
    } catch(error){
        await trans.rollback();
        res.status(400).json({msg: error.message});
    }
}