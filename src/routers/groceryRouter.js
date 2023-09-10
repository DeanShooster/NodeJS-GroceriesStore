const express = require('express');
const StoreList = require('../database/model/StoreList');
const ShoppingList = require('../database/model/ShoppingList');
const { adminAuth } = require('../middlewares/authentication');
const { GroceryError } = require('../middlewares/errorHandler');
const { serverError, exists, notFound } = require('../constants/general');

const router = express.Router();

//--------------------------------------------------------------- GET REQUESTS --------------------------------------------------------------- //

// Returns the GroceryList Object: { groceryStoreList , shoppingList }.
router.get('/groceries',async(req,res,next)=>{
    try{
        const storeList = await StoreList.find(), shoppingList = await ShoppingList.find();
        if(!storeList || !shoppingList) return next(new GroceryError(serverError,502));
        res.send({storeList,shoppingList});
    }
    catch(e){next(e)}
});

//--------------------------------------------------------------- POST REQUESTS --------------------------------------------------------------- //


// Adds array of items to GroceryList -> shoppingList.
router.post('/cart',async(req,res,next)=>{
    try{
        const {groceryItemName} = req.body;

        const groceryItem = await StoreList.findOne({"items.name": groceryItemName},{"items.$" : 1, "categoryName": 1});
        if(!groceryItem) return next(new GroceryError(notFound,404));

        const shoppingListCategory = await ShoppingList.findOne({categoryName: groceryItem.categoryName});
        if(shoppingListCategory){
            if(shoppingListCategory.items.find((item)=> item.name === groceryItemName)) return next(new GroceryError(exists,400));
            shoppingListCategory.items.push(groceryItem.items[0]);
            await shoppingListCategory.save();
        }else{
            const newShoppingListCategory = new ShoppingList({categoryName: groceryItem.categoryName, items: [groceryItem.items[0]]});
            if(!newShoppingListCategory) return next(new GroceryError(serverError,500));
            await newShoppingListCategory.save();
        }
        res.send({groceryItemName});
    }
    catch(e){next(e)}
})

//--------------------------------------------------------------- DELETE REQUESTS --------------------------------------------------------------- //

// Removes an item from GroceryList -> shoppingList.
router.delete('/cart', async(req,res,next)=>{
    try{
        const {groceryItemName} = req.body;

        const shoppingItem = await ShoppingList.findOne({"items.name": groceryItemName});
        if(!shoppingItem) return next(new GroceryError(notFound,404));

        const index = shoppingItem.items.findIndex(item => item.name === groceryItemName);
        if(index !== -1) shoppingItem.items.splice(index,1);
        if(shoppingItem.items.length > 0) await shoppingItem.save();
        else await ShoppingList.findOneAndDelete({categoryName: shoppingItem.categoryName});

        res.send({groceryItemName});
    }
    catch(e){
        console.log(e);
        next(e)
    }
})

//--------------------------------------------------------------- ADMIN REQUESTS --------------------------------------------------------------- //

router.post('/admin-add-store-item',adminAuth ,async(req,res,next)=>{
    try{
        const {item} = req.body;

        const storeCategory = await StoreList.findOne({categoryName: item.category});
        
        const newItem = {name : item.name , image: item.image };
        if(storeCategory){
            if(storeCategory.items.find((item)=> item.name === newItem.name)) return next(new GroceryError(exists,400));
            storeCategory.items.push(newItem);
            await storeCategory.save();
        }else{
            const newStoreCategory = new StoreList({categoryName: item.category , items: [newItem]});
            await newStoreCategory.save();
        }
        res.send({});
    }
    catch(e){next(e)}
})

module.exports = router;