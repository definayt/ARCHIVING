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
const Op = db.Sequelize.Op;
import { Sequelize } from "sequelize";

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
                ],
                order: [
                    ['title', 'ASC'],
                ],
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
                ],
                order: [
                    ['title', 'ASC'],
                ],
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

async function isISBNUnique (isbn, uuid) {
    let count;
    if(uuid === ""){
        count = await Collections.count({ where: { isbn: isbn } });
    }else{
        count = await Collections.count({ where: { isbn: isbn, uuid: { [Op.not]: uuid } } });
    }
    
    if (count != 0) {
        return false;
    }
    return true;
}

export const createCollection = async(req, res) => {
    const {no_bp, isbn, title, writer, publish_1st_year, publish_last_year, amount_printed,
        synopsis, categoryId, storyTypeId, languageId, digitalDataId
    } = req.body;
    
    const trans = await db.transaction();
    const promises = [];
    let collectionId;
    isISBNUnique(isbn, "").then(async isUnique => {
        if (isUnique || isbn === "" || isbn === "-") {
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
        }else{
            res.status(400).json({msg: "Buku dengan ISBN "+isbn+" sudah ada"});
        }
    });
    
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
    isISBNUnique(isbn, req.params.id).then(async isUnique => {
        if (isUnique || isbn === "" || isbn === "-") {
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
        }else{
            res.status(400).json({msg: "Buku dengan ISBN "+isbn+" sudah ada"});
        }
    })
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
    const { page, size, input, inputSynopsis, category, story_type, language, digital_format } = req.query;
    if(category && story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like]: `%${inputSynopsis}%`} ,
                    categoryId : category,
                    storyTypeId : story_type,
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like]: `%${inputSynopsis}%`} ,
                    categoryId : category,
                    storyTypeId : story_type,
                    languageId : language
                }
            };
        }else{
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
        }
    }else if(!category && story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                    languageId : language
                }
            };
        }
        else{
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
        }
    }else if(category && !story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    languageId : language
                }
            };
        }else{
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
        }
    }else if(category && story_type && !language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    storyTypeId : story_type,
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    storyTypeId : story_type,
                }
            };
        }else{
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
        }
    }else if(!category && !story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    languageId : language
                }
            };
        }else{
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
        }
    }else if(!category && story_type && !language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                }
            };
        }else{
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
        }
    }else if(category && !story_type && !language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                }
            };
        }else{
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
        }
    }else{
        if(inputSynopsis){
            var condition = input ? { 
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    [Op.or] : {
                        title: { [Op.like]: `%${input}%` }, 
                        writer: { [Op.like]: `%${input}%` }, 
                        isbn: { [Op.like]: `%${input}%` },
                        no_bp: { [Op.like]: `%${input}%` },
                        publish_1st_year: { [Op.like]: `%${input}%` },
                        publish_last_year: { [Op.like]: `%${input}%` },
                    }
                }
            } : {
                synopsis : { [Op.like] : `%${inputSynopsis}%` }
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
    }
    
    // var conditionDigitalFormat = digital_format ? { 
    //     digitalFormatId : { [Op.in] : digital_format }
    // } : null;

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
                        // where: conditionDigitalFormat,
                        include: [
                            { model: DigitalFormat, attributes: ['digital_format'] }
                        ],
                        }
                ]
                },
        ],
        order: [
            ['title', 'ASC'],
        ],
        distinct: true,
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
            where: {
            //   publish_1st_year: {
            //     [Op.not]: null,
            //     [Op.notIn]: ['-']
            //   }
            },
            attributes: [
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year < 1900 THEN publish_1st_year END)'), '< 1900'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 1900 AND publish_1st_year <= 1919 THEN publish_1st_year END)'), '1900-1919'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 1920 AND publish_1st_year <= 1939 THEN publish_1st_year END)'), '1920-1939'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 1940 AND publish_1st_year <= 1959 THEN publish_1st_year END)'), '1940-1959'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 1960 AND publish_1st_year <= 1979 THEN publish_1st_year END)'), '1960-1979'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 1980 AND publish_1st_year <= 1999 THEN publish_1st_year END)'), '1980-1999'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 2000 AND publish_1st_year <= 2019 THEN publish_1st_year END)'), '2000-2019'],
              [Sequelize.literal('COUNT (CASE WHEN publish_1st_year >= 2020 THEN publish_1st_year END)'), '≥ 2020'],
              [Sequelize.fn('count', Sequelize.col('uuid')), 'count']
            ]
          });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const exportExcelCollections = async(req, res) => {
    const { page, size, input, inputSynopsis, category, story_type, language, digital_format } = req.query;
    if(category && story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like]: `%${inputSynopsis}%`} ,
                    categoryId : category,
                    storyTypeId : story_type,
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like]: `%${inputSynopsis}%`} ,
                    categoryId : category,
                    storyTypeId : story_type,
                    languageId : language
                }
            };
        }else{
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
        }
    }else if(!category && story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                    languageId : language
                }
            };
        }
        else{
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
        }
    }else if(category && !story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    languageId : language
                }
            };
        }else{
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
        }
    }else if(category && story_type && !language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    storyTypeId : story_type,
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                    storyTypeId : story_type,
                }
            };
        }else{
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
        }
    }else if(!category && !story_type && language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    languageId : language
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    languageId : language
                }
            };
        }else{
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
        }
    }else if(!category && story_type && !language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    storyTypeId : story_type,
                }
            };
        }else{
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
        }
    }else if(category && !story_type && !language){
        if(inputSynopsis){
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
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                }
            } : {
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    categoryId : category,
                }
            };
        }else{
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
        }
    }else{
        if(inputSynopsis){
            var condition = input ? { 
                [Op.and] : {
                    synopsis : { [Op.like] : `%${inputSynopsis}%` },
                    [Op.or] : {
                        title: { [Op.like]: `%${input}%` }, 
                        writer: { [Op.like]: `%${input}%` }, 
                        isbn: { [Op.like]: `%${input}%` },
                        no_bp: { [Op.like]: `%${input}%` },
                        publish_1st_year: { [Op.like]: `%${input}%` },
                        publish_last_year: { [Op.like]: `%${input}%` },
                    }
                }
            } : {
                synopsis : { [Op.like] : `%${inputSynopsis}%` }
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
    }
    // var conditionDigitalFormat = digital_format ? { 
    //     digitalFormatId : { [Op.in] : digital_format }
    // } : null;
    try {
        const response = await Collections.findAll({
            where: condition,
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
                            // where: conditionDigitalFormat,
                            include: [
                                { model: DigitalFormat, attributes: ['digital_format'] }
                            ]
                            }
                    ]
                    },
            ],
            order: [
                ['title', 'ASC'],
            ],
             distinct: true,
        });
        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
