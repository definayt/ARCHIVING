import DigitalCollections from "../models/DigitalCollectionModel.js";
import xlsx from "xlsx";

export const getDigitalCollectionsUnique = async(req, res) => {
    try {
        const response = await DigitalCollections.findAll({
            attributes: ['uuid', 'collectionId'],
            group: ["collectionId"]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const readExcel = async(req, res) => {
    try {
        const workbook = xlsx.readFile('./DigitalCollections.xlsx');  // Step 2
        let workbook_sheet = workbook.SheetNames;                // Step 3
        let workbook_response = xlsx.utils.sheet_to_json(        // Step 4
            workbook.Sheets[workbook_sheet[0]]
        );
       
        DigitalCollections.bulkCreate(workbook_response)
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

