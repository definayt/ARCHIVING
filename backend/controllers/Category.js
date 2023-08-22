import Category from "../models/CategoryModel.js";

export const getCategories = async(req, res) => {
    try{
        const response = await Category.findAll({
            attributes: ['uuid', 'code', 'category']
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getCategoryById = async(req, res) => {
    try{
        const response = await Category.findOne({
            attributes: ['uuid', 'code', 'category'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const createCategory = async(req, res) => {
    const {code, category} = req.body;
    try{
        await Category.create({
            code: code,
            category: category
        })
        res.status(201).json({msg: "Kategori Berhasil Ditambahkan"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const updateCategory = async(req, res) => {
    const cat = await Category.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!cat) return res.status(404).json({msg: "Kategori tidak ditemukan"});
    const {code, category} = req.body;
    try{
        await Category.update({
            code: code,
            category: category
        }, {
            where: {
                id: cat.id
            }
        })
        res.status(200).json({msg: "Kategori berhasil diubah"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const deleteCategory = async(req, res) => {
    const cat = await Category.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!cat) return res.status(404).json({msg: "Kategori tidak ditemukan"});    
    try{
        await Category.destroy({
            where: {
                id: cat.id
            }
        })
        res.status(200).json({msg: "Kategori berhasil dihapus"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}