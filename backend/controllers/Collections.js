import Categories from "../models/CategoryModel.js";
import Collections from "../models/CollectionModel.js";
import Languages from "../models/LanguageModel.js";
import StoryType from "../models/StoryTypeModel.js";
import Users from "../models/UserModel.js";
import DigitalCollections from "../models/DigitalCollectionModel.js";
import db from "../config/Database.js";
import DigitalData from "../models/DigitalDataModel.js";
import DigitalFormat from "../models/DigitalFormatModel.js";
import xlsx from "xlsx";
import path from "path";
const Op = db.Sequelize.Op;

export const getCollections = async(req, res) => {
    try {
        // reqnya dari middleware
        if(req.role === "guest"){
            const response = await Collections.findAll({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis', 'categoryId'
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
            res.status(200).json(response);
        }else{
            const response = await Collections.findAll({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis', 'categoryId'
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
        if(req.role === "guest"){
            const response = await Collections.findOne({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis', 'categoryId', 'storyTypeId', 'languageId'
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
                        attributes: ['uuid', 'digitalDataId'], 
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
        }else{
            const response = await Collections.findOne({
                attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                        'publish_last_year', 'amount_printed', 'synopsis', 'categoryId', 'storyTypeId', 'languageId'
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
                        attributes: ['uuid', 'digitalDataId'], 
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
        res.status(200).json({msg: "Koleksi berhasil diubah"});
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
        res.status(200).json({msg: "Koleksi berhasil dihapus"});
    } catch(error){
        await trans.rollback();
        res.status(400).json({msg: error.message});
    }
}

export const readExcel = async(req, res) => {
    try {
        const workbook = xlsx.readFile('./Arsip_IP_Buku.xlsx');  // Step 2
        let workbook_sheet = workbook.SheetNames;                // Step 3
        let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
            workbook.Sheets[workbook_sheet[0]]
        );
       
        Collections.bulkCreate(workbook_response)
            .then(() => {
                res.status(200).json({msg: "Import Success"});
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
    const { count: totalItems, rows: collection } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, collection, totalPages, currentPage };
};

export const findAllCollection = (req, res) => {
    const { page, size, input, category, story_type, language } = req.query;
    if(category && story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
                storyTypeId : story_type,
                languageId : language
            }
        } : {
            [Op.and] : {
                categoryId : category,
                storyTypeId : story_type,
                languageId : language
            }
        };
    }else if(!category && story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                storyTypeId : story_type,
                languageId : language
            }
        } : {
            [Op.and] : {
                storyTypeId : story_type,
                languageId : language
            }
        };
    }else if(category && !story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
                languageId : language
            }
        } : {
            [Op.and] : {
                categoryId : category,
                languageId : language
            }
        };
    }else if(category && story_type && !language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
                storyTypeId : story_type,
            }
        } : {
            [Op.and] : {
                categoryId : category,
                storyTypeId : story_type,
            }
        };
    }else if(!category && !story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                languageId : language
            }
        } : {
            [Op.and] : {
                languageId : language
            }
        };
    }else if(!category && story_type && !language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                storyTypeId : story_type,
            }
        } : {
            [Op.and] : {
                storyTypeId : story_type,
            }
        };
    }else if(category && !story_type && !language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
            }
        } : {
            [Op.and] : {
                categoryId : category,
            }
        };
    }else{
        var condition = input ? { 
            [Op.or] : {
                title: { [Op.like]: `%${input}%` }, 
                writer: { [Op.like]: `%${input}%` }, 
                isbn: { [Op.like]: `%${input}%` },
                no_bp: { [Op.like]: `%${input}%` },
                publish_1st_year: { [Op.like]: `%${input}%` },
                publish_last_year: { [Op.like]: `%${input}%` },
            }
        } : null;
    }

    const { limit, offset } = getPagination(page, size);

    Collections.findAndCountAll({ 
        where: condition,
        limit, 
        offset,
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
        ],
    })
    .then(data => {
    const response = getPagingData(data, page, limit);
    res.send(response);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving collection."
    });
    });
};

export const countAllCollection = async (req, res) => {
    try {
        const response = await Collections.findOne({
            attributes: [
              [db.fn("COUNT", db.col("id")), "countCollection"],
            ],
          });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const countCategory = async (req, res) => {
    try {
        const response = await Collections.findAll({
            attributes: [
              "categoryId",
              [db.fn("COUNT", db.col("categoryId")), "countCategory"],
            ],
            group: "categoryId",
            include:[
                { model: Categories, attributes: ['category'] }
            ],
          });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const countStoryType = async (req, res) => {
    try {
        const response = await Collections.findAll({
            attributes: [
              "storyTypeId",
              [db.fn("COUNT", db.col("storyTypeId")), "countStoryType"],
            ],
            group: "storyTypeId",
            include:[
                { model: StoryType, attributes: ['story_type'] }
            ],
          });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const countLanguage = async (req, res) => {
    try {
        const response = await Collections.findAll({
            attributes: [
              "languageId",
              [db.fn("COUNT", db.col("languageId")), "countLanguage"],
            ],
            group: "languageId",
            include:[
                { model: Languages, attributes: ['language'] }
            ],
          });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const countPublished1stYear = async (req, res) => {
    try {
        const response = await Collections.findAll({
            attributes: [
              "publish_1st_year",
              [db.fn("COUNT", db.col("publish_1st_year")), "countPublishYear"],
            ],
            group: "publish_1st_year",
          });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const exportExcelCollections = async(req, res) => {
    const { page, size, input, category, story_type, language } = req.query;
    if(category && story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
                storyTypeId : story_type,
                languageId : language
            }
        } : {
            [Op.and] : {
                categoryId : category,
                storyTypeId : story_type,
                languageId : language
            }
        };
    }else if(!category && story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                storyTypeId : story_type,
                languageId : language
            }
        } : {
            [Op.and] : {
                storyTypeId : story_type,
                languageId : language
            }
        };
    }else if(category && !story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
                languageId : language
            }
        } : {
            [Op.and] : {
                categoryId : category,
                languageId : language
            }
        };
    }else if(category && story_type && !language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
                storyTypeId : story_type,
            }
        } : {
            [Op.and] : {
                categoryId : category,
                storyTypeId : story_type,
            }
        };
    }else if(!category && !story_type && language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                languageId : language
            }
        } : {
            [Op.and] : {
                languageId : language
            }
        };
    }else if(!category && story_type && !language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                storyTypeId : story_type,
            }
        } : {
            [Op.and] : {
                storyTypeId : story_type,
            }
        };
    }else if(category && !story_type && !language){
        var condition = input ? { 
            [Op.and] : {
                [Op.or] : {
                    title: { [Op.like]: `%${input}%` }, 
                    writer: { [Op.like]: `%${input}%` }, 
                    isbn: { [Op.like]: `%${input}%` },
                    no_bp: { [Op.like]: `%${input}%` },
                    publish_1st_year: { [Op.like]: `%${input}%` },
                    publish_last_year: { [Op.like]: `%${input}%` },
                },
                categoryId : category,
            }
        } : {
            [Op.and] : {
                categoryId : category,
            }
        };
    }else{
        var condition = input ? { 
            [Op.or] : {
                title: { [Op.like]: `%${input}%` }, 
                writer: { [Op.like]: `%${input}%` }, 
                isbn: { [Op.like]: `%${input}%` },
                no_bp: { [Op.like]: `%${input}%` },
                publish_1st_year: { [Op.like]: `%${input}%` },
                publish_last_year: { [Op.like]: `%${input}%` },
            }
        } : null;
    }
    try {
        const response = await Collections.findAll({
            where: condition,
            attributes: ['uuid', 'no_bp', 'isbn', 'title', 'writer', 'publish_1st_year', 
                    'publish_last_year', 'amount_printed', 'synopsis', 'categoryId'
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
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}