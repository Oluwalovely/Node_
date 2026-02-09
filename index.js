const express = require('express');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
const dotenv = require('dotenv');
dotenv.config();
app.use(express.urlencoded({extended: true}));

// app.get(Path2D, callback)
// req=>request, res=>response

const products = [
    {
        prodName: 'Laptop',
        prodPrice: 45000,
        prodQuantity: "15",
        prodDescription: "High-performance laptop with Intel i7 processor, 16GB RAM, and 512GB SSD",
    },
    {
        prodName: 'Smartphone',
        prodPrice: 35000,
        prodQuantity: "30",
        prodDescription: "Latest Android smartphone with 128GB storage, dual camera, and 5000mAh battery",
    },
    {
        prodName: 'Wireless Headphones',
        prodPrice: 12000,
        prodQuantity: "50",
        prodDescription: "Noise-cancelling Bluetooth headphones with 30-hour battery life and premium sound",
    },
    {
        prodName: 'Smartwatch',
        prodPrice: 25000,
        prodQuantity: "25",
        prodDescription: "Fitness tracker smartwatch with heart rate monitor, GPS, and waterproof design",
    },
    {
        prodName: 'Tablet',
        prodPrice: 55000,
        prodQuantity: "20",
        prodDescription: "10.5-inch tablet with stylus support, 256GB storage, and all-day battery life",
    },
    {
        prodName: 'Gaming Mouse',
        prodPrice: 8000,
        prodQuantity: "40",
        prodDescription: "RGB gaming mouse with 16000 DPI, programmable buttons, and ergonomic design",
    },
    {
        prodName: 'Mechanical Keyboard',
        prodPrice: 15000,
        prodQuantity: "35",
        prodDescription: "RGB mechanical keyboard with blue switches, anti-ghosting, and aluminum frame",
    },
    {
        prodName: 'External SSD 1TB',
        prodPrice: 20000,
        prodQuantity: "45",
        prodDescription: "Portable SSD with 1TB capacity, USB-C connection, and 540MB/s transfer speed",
    },
    {
        prodName: 'Webcam HD',
        prodPrice: 18000,
        prodQuantity: "28",
        prodDescription: "1080p HD webcam with autofocus, built-in microphone, and wide-angle lens",
    },
    {
        prodName: 'Portable Charger',
        prodPrice: 6000,
        prodQuantity: "60",
        prodDescription: "20000mAh power bank with fast charging, dual USB ports, and LED indicator",
    }
]
app.get('/', (req, res)=>{
    // res.send(true)
    // res.send('Emmie','Lovely')
    // res.send(products)

    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
})

app.get('/index', (req, res)=>{
    res.render('index', {products})
})

app.get('/addProduct', (req, res)=>{
    res.render("addProduct")
})

app.post("/addProduct", (req, res)=>{
    // console.log(req.body);
    const {prodName, prodPrice, prodImg, prodDesc} = req.body;

    products.push(req.body)
    res.render("index", {products})
})

app.post("/deleteProd/:id", (req, res)=>{
    // console.log(req.params);
    const {id} = req.params;
    products.splice(id, 1);
    res.render("index", {products})
})

app.get("/editProd/:id", (req, res)=>{
    res.render("editProduct")
})

app.post("/editProd/:id", (req, res)=>{
    const {id} = req.params;
    const {prodName, prodPrice, prodImg, prodDesc} = req.body;
    products.splice(id, 1, req.body);
    res.render("index", {products})
})


// app.listen(prompt, callback)
app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log('Error in server startup', err);
    }else{
        console.log(`Server started successfully`);
    }
})