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
    try{
        let { first, rows, globalFilter } = req.query
        const fieldArray = Object.keys(Hookups.schema.obj)
        const filter = { $or: fieldArray.filter((field1) => field1 !== '_id').map(field => ({ [field]: { $regex: globalFilter, $options: 'i' } })) }
        globalFilter = globalFilter !== '' ? filter : {}
        const resdata = await Hookups.find(globalFilter).skip(first).limit(rows)
        const totallength = await Hookups.countDocuments(globalFilter)
        res.send({ resdata, totallength })
    }
    catch(err){
        console.log(err);
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