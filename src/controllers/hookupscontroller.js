import { Hookups } from "../models/hookupsmodel.js";

export const saveHookups = async (req, res) => {
    try { 
        console.log(req.body);
        const resdata = await new Hookups(req.body).save();
        res.send({ message: resdata ? "Successfully saved" : "Error saving hookups" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred while saving hookups", error: err.message });
    }
};

export const getallHookups = async (req, res) => {
    try {
        const { first = 0, rows = 10, globalFilter = '', colfilter, Sort } = req.query;
        const parsedColFilter = typeof colfilter === 'string' ? JSON.parse(colfilter) : (colfilter || {});
        const parsedSort = typeof Sort === 'string' ? JSON.parse(Sort) : (Sort || {});
        
        let query = { ...parsedColFilter };
        
        if (globalFilter) {
            const fields = Object.keys(Hookups.schema.obj).filter(f => f !== '_id' && f !== '__v');
            const searchQuery = { $or: fields.map(f => ({ [f]: { $regex: globalFilter, $options: 'i' } })) };
            query = Object.keys(parsedColFilter).length > 0 ? { $and: [parsedColFilter, searchQuery] } : searchQuery;
        }
        
        const resdata = await Hookups.find(query).sort(Object.keys(parsedSort).length > 0 ? parsedSort : { createdAt: -1 }).skip(parseInt(first)).limit(parseInt(rows));
        const totallength = await Hookups.countDocuments(query);
        res.send({ resdata, totallength });
        
    } catch (err) {
        console.error('Error in getallHookups:', err);
        res.status(500).send({ message: 'Error fetching hookups data', error: err.message });
    }
}

export const deleteHookups = async (req, res) => {
    try{
        const { id } = req.params;
        const resdata=await Hookups.deleteOne({_id:id});
        res.send({ message: resdata.deletedCount !== 0?'Successfully deleted':"Error deleting hookups" });
    }
    catch(err){
        console.log(err);
    }
}

export const updateHookups = async (req, res) => {
    try{
        const { id } = req.params;
        const resdata=await Hookups.findOneAndUpdate({_id:id}, req.body, { new: true });
        res.send({ message:resdata.modifiedCount !== 0? 'Successfully updated':"Error updating hookups"});
    }
    catch(err){
        console.log(err);
    }
}

export const getallHookupsForProduct = async (req, res, next) => {
    try {
        const resdata = await Hookups.find({})
        res.send(resdata);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};