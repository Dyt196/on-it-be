import db from '../databases/initiate.js';

export async function getItemList(req, res) {
    try {
        const [items] = await db.query('SELECT * FROM items');
        res.json(items)
    }  catch (error) {
        res.status(500).json({ error });
    }
}

export async function getCourierList(req, res) {
    try {
        const [items] = await db.query('SELECT * FROM couriers');
        res.json(items)
    }  catch (error) {
        res.status(500).json({ error });
    }
}

export async function goThroughPackage (req, res) {
    try {
        const [courier] = await db.query('SELECT * FROM couriers');
        const cart = req.body.cart.sort((a,b) => b.prc - a.prc);

        let packageCart = splitItem(cart, courier)

        res.json(packageCart)
    } catch (error) {
        res.status(500).json({ error })
    }
}

function splitItem(cart, courier) {
    // Get default value for calculation
    const totalPrice = cart.reduce((sum, item) => sum + item.prc, 0)
    const totalWeight = cart.reduce((sum, item) => sum + item.wgt, 0)
    // Calculate Default Total Package Based on Total Price (Preferrably < 250 per package)
    const totalPackage = Math.ceil(totalPrice/250)
    const idealWeight = Math.ceil(totalWeight/totalPackage)
    const idealCourier = courier.find(cour => idealWeight >= cour.min && idealWeight <= cour.max)

    // Package if total price less than 250
    if(totalPrice <= 250 ){
        let courierPrice = courier.find(cour => totalWeight >= cour.min && totalWeight <= cour.max).prc ?? 0;
        return [
            {
                item: cart,
                totalWeight: totalWeight,
                totalPrice: totalPrice,
                courierPrice: courierPrice
            }
        ]
    }


    let emptyPack = {
        item: [],
        totalWeight: 0,
        totalPrice: 0,
        courierPrice: 0
    }

    let packageCart = Array.from({ length: totalPackage }, () => JSON.parse(JSON.stringify(emptyPack)))

    // Condition break to package less than 250 per package & less than Ideal Average Weight
    for(const item of cart){
        let itemAdded = false
        for(const pack of packageCart) {
            if(pack.totalPrice + item.prc < 250 && pack.totalWeight + item.wgt <= idealCourier.max ){
                pack.item.push(item)
                pack.totalWeight += item.wgt
                pack.totalPrice += item.prc
                pack.courierPrice = courier.find(cour => pack.totalWeight >= cour.min && pack.totalWeight <= cour.max)?.prc ?? 0
                itemAdded = true
                break;
            }
            if(pack.totalPrice + item.prc < 250){
                pack.item.push(item)
                pack.totalWeight += item.wgt
                pack.totalPrice += item.prc
                pack.courierPrice = courier.find(cour => pack.totalWeight >= cour.min && pack.totalWeight <= cour.max)?.prc ?? 0
                itemAdded = true
                break;
            }
        }

        // If no condition were met and additional package were required
        if(!itemAdded){
            let itemToPush = {
                item: [item],
                totalWeight: item.wgt,
                totalPrice: item.prc,
                courierPrice: courier.find(cour => item.wgt >= cour.min && item.wgt <= cour.max)?.prc ?? 0
            }
            packageCart.push(itemToPush)
        }
    }

    return packageCart
}