import StoryType from "../models/StoryTypeModel.js";

export const getStoryTypes = async(req, res) => {
    try{
        const response = await StoryType.findAll({
            attributes: ['id','uuid', 'code', 'story_type']
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getStoryTypeById = async(req, res) => {
    try{
        const response = await StoryType.findOne({
            attributes: ['uuid', 'code', 'story_type'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const createStoryType = async(req, res) => {
    const {code, story_type} = req.body;
    try{
        await StoryType.create({
            code: code,
            story_type: story_type
        })
        res.status(201).json({msg: "Jenis Cerita Berhasil Ditambahkan"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const updateStoryType = async(req, res) => {
    const storytype = await StoryType.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!storytype) return res.status(404).json({msg: "Jenis Cerita tidak ditemukan"});
    const {code, story_type} = req.body;
    try{
        await StoryType.update({
            code: code,
            story_type: story_type
        }, {
            where: {
                id: storytype.id
            }
        })
        res.status(200).json({msg: "Jenis Cerita berhasil diubah"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

export const deleteStoryType = async(req, res) => {
    const storytype = await StoryType.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!storytype) return res.status(404).json({msg: "Jenis Cerita tidak ditemukan"});    
    try{
        await StoryType.destroy({
            where: {
                id: storytype.id
            }
        })
        res.status(200).json({msg: "Jenis Cerita berhasil dihapus"});
    } catch(error){
        res.status(400).json({msg: error.message});
    }
}