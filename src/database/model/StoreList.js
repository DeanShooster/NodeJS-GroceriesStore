const mongoose = require('mongoose');

const StoreListSchema = new mongoose.Schema({
    categoryName: { type: String, required: true , unique: true },
    items: [{
        name: {type: String , required: true , unique: true},
        image: {type: String, required: true } 
    }]
});

const StoreList = mongoose.model('StoreList',StoreListSchema);
module.exports = StoreList;