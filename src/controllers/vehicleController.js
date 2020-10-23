const admin = require('firebase-admin');
const moment = require('moment');
const rentController = require('./rentController');
const { parseDate } = require('../utils/utils')


let vehicle = {
    id: 0,
    category: '',
    model: '',
    brand: '',
    doors: 0,
    capacity: 0,
    trunkCapacity: 0,
    autonomy: 0,
    gearBox: '',
    url: '',
    price: 0,
    extras: [],
    rented: false,
    nextAvailability: null,
    airport: 0
}

const createVehicle = async (body) => {
    try {
        let vehicle = validateModel(body)
        let createdVehicle = await storeVehicle(vehicle)

        let msg = `Succesfully created vehicle`
        console.log(msg)
        return ({ msg, id: createdVehicle.id, code: 200 })
    } catch (error) {
        let msg = `Error while creating vehicle: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const createBrand = async (body) => {
    try {
        let brand = validateModel(body)
        let createdBrand = await storeBrand(brand)

        let msg = `Succesfully created brand`
        console.log(msg)
        return ({ msg, id: createdBrand.id, code: 200 })
    } catch (error) {
        let msg = `Error while creating brand: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const createModel = async (body) => {
    try {
        let model = validateModel(body)
        let createdModel = await storeModel(model)

        let msg = `Succesfully created model`
        console.log(msg)
        return ({ msg, id: createdModel.id, code: 200 })
    } catch (error) {
        let msg = `Error while creating model: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const createCategory = async (body) => {
    try {
        let category = validateModel(body)
        let createdCategory = await storeCategory(category)

        let msg = `Succesfully created category`
        console.log(msg)
        return ({ msg, id: createdCategory.id, code: 200 })
    } catch (error) {
        let msg = `Error while creating category: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const createExtra = async (body) => {
    try {
        let extra = validateModel(body)
        let id = await storeExtra(extra)

        let msg = `Succesfully created extra`
        console.log(msg)
        return ({ msg, id: createExtra.id, code: 200 })
    } catch (error) {
        let msg = `Error while creating extra: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const validateModel = (body) => {
    return body;
}

const storeVehicle = async (vehicle) => {
    if (!vehicle.id) {
        console.log(`Creating vehicle...`)
        let createdVehicle = await admin.firestore().collection('vehicles').add(vehicle)
        return createdVehicle;
    }
}

const updateVehicle = async (id, body) => {
    try {
        console.log("Updating vehicle with id: " + id)
        let response = await admin.firestore().collection('vehicles').doc(id).update(body);
        return ({ response, code: 200 });

    } catch (error) {
        let msg = `Error while updating vehicle: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const deleteVehicle = async (id) => {
    try {
        //Logical delete
        console.log("Disabling vehicle with id: " + id)
        let response = await admin.firestore().collection('vehicles').doc(id).update({ active: false });
        return ({ response, code: 200 });

        //Physical delete
        /*console.log("Deleting vehicle with id: " + id)
        let deleteDoc = await admin.firestore().collection('vehicles').doc(id).delete();
        let msg = "delete ok"
        return ({ msg, code: 200 });*/

    } catch (error) {
        let msg = `Error while disabling vehicle: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const storeBrand = async (brand) => {
    if (!brand.id) {
        console.log(`Creating brand...`)
        let id = await admin.firestore().collection('brands').add(brand)
        return id;
    }
}

const storeModel = async (model) => {
    if (!model.id) {
        console.log(`Creating model...`)
        let id = await admin.firestore().collection('models').add(model)
        return id;
    }
}

const storeCategory = async (category) => {
    if (!category.id) {
        console.log(`Creating category...`)
        let id = await admin.firestore().collection('categories').add(category)
        return id;
    }
}

const storeExtra = async (extra) => {
    if (!extra.id) {
        console.log(`Creating extra...`)
        let id = await admin.firestore().collection('extras').add(extra)
        return id;
    }
}

const getVehicles = async () => {
    try {
        let vehicles = [];
        vehicles = (await admin.firestore().collection('vehicles').where('active', '==', true).get())._docs().map((doc) => {
            return { ...doc.data(), id: doc.id }
        });

        return ({ vehicles, code: 200 });
    }
    catch (error) {
        let msg = `Error while getting all vehicles` + error.msg;
        console.log(msg);
        return ({ msg, code: 500 });
    }
}

const getBrands = async () => {
    try {
        let brands = [];
        brands = (await admin.firestore().collection('brands').get())._docs().map((doc) => { return { ...doc.data(), id: doc.id } });
        return ({ brands, code: 200 });
    }
    catch (error) {
        let msg = `Error while getting all brands`;
        console.log(msg);
        return ({ msg, code: 500 });
    }
}

const getModels = async (brand) => {
    try {
        let models = {};
        models = (await admin.firestore().collection('models').where("brand", "==", brand).get())._docs().map((doc) => { return { ...doc.data(), id: doc.id } });
        return ({ models, code: 200 });
    }
    catch (error) {
        let msg = `Error while getting models: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const getCategories = async () => {
    try {
        let categories = [];
        categories = (await admin.firestore().collection('categories').get())._docs().map((doc) => { return { ...doc.data(), id: doc.id } });
        return ({ categories, code: 200 });
    } catch (error) {
        let msg = `Error while getting all categories`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const getExtras = async () => {
    try {
        let extras = [];
        extras = (await admin.firestore().collection('extras').get())._docs().map((doc) => { return { ...doc.data(), id: doc.id } });
        return ({ extras, code: 200 });
    } catch (error) {
        let msg = `Error while getting all extras`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const getVehicle = async (id) => {
    try {
        let vehicle = {};
        vehicle = (await admin.firestore().collection('vehicles').doc(id).get()).data();
        return ({ vehicle, code: 200 });
    }
    catch (error) {
        let msg = `Error while getting vehicle: ${error.message}`
        console.log(msg)
        return ({ msg, code: 500 })
    }
}

const getVehiclesFromAirport = async (id, from, to) => {
    try {
        const vehicles = (await admin.firestore().collection('vehicles')
            .where('airport', '==', id)
            .where('active', '==', true)
            .get())._docs().map((doc) => {
                return { ...doc.data(), id: doc.id }
            });

        const rents = (await rentController.getRents(from, to)).result;

        updateRentStatus(vehicles, rents, parseDate(from))

        return ({ vehicles, code: 200 });
    }
    catch (error) {
        let msg = `Error while getting all vehicles` + error.msg;
        console.log(msg);
        return ({ msg, code: 500 });
    }
}

const updateRentStatus = (vehicles, rents, from) => {
    vehicles.forEach(vehicle => {
        const rentsForVehicle = rents.filter(rent => rent.car_id === vehicle.id).map(rent => {
            //Transform date.
            rent.from = parseDate(rent.from)
            rent.to = parseDate(rent.to)
            return rent
        })
        vehicle.rent_status = buildRentStatus(rentsForVehicle, from)
    })

    console.log('Vehicles updated.')

}

const buildRentStatus = (rents, from) => {
    if (rents) {
        if (isRented(from, rents[0])) {
            return {
                status: 'not_available',
                available_untill: null,
                available_since: moment(rents[0].to).format().split('T')[0],
                rents: rents.map(rent => {
                    rent.to = moment(rent.to).format().split('T')[0]
                    rent.from = moment(rent.from).format().split('T')[0]
                    return rent
                })
            }
        }

        return {
            status: 'available',
            available_untill: moment(rents[0].from).format().split('T')[0],
            available_since: null,
            rents: rents.map(rent => {
                rent.to = moment(rent.to).format().split('T')[0]
                rent.from = moment(rent.from).format().split('T')[0]
                return rent
            })
        }
    }

    return {
        status: 'available',
        available_untill: null,
        available_since: null,
        rents: []
    }
}

const isRented = (from, rent) => {
    return rent.from <= from && rent.to >= from
}

module.exports = {
    createVehicle,
    createBrand,
    createModel,
    createCategory,
    createExtra,
    getVehicles,
    getBrands,
    getModels,
    getCategories,
    getExtras,
    getVehicle,
    getVehiclesFromAirport,
    updateVehicle,
    deleteVehicle
}
