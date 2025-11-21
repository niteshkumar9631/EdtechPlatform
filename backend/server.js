// const express = require('express')
// const app = express();

// // packages
// const fileUpload = require('express-fileupload');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// // connection to DB and cloudinary
// const { connectDB } = require('./config/database');
// const { cloudinaryConnect } = require('./config/cloudinary');

// // routes
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/profile');
// const paymentRoutes = require('./routes/payments');
// const courseRoutes = require('./routes/course');


// // middleware 
// app.use(express.json()); // to parse json body
// app.use(cookieParser());
// app.use(
//     cors({
//         // origin: 'http://localhost:5173', // frontend link
//         origin: "*",
//         credentials: true
//     })
// );
// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: '/tmp'
//     })
// )


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server Started on PORT ${PORT}`);
// });

// // connections
// connectDB();
// cloudinaryConnect();

// // mount route
// app.use('/api/v1/auth', userRoutes);
// app.use('/api/v1/profile', profileRoutes);
// app.use('/api/v1/payment', paymentRoutes);
// app.use('/api/v1/course', courseRoutes);




// // Default Route
// app.get('/', (req, res) => {
//     // console.log('Your server is up and running..!');
//     res.send(`<div>
//     This is Default Route  
//     <p>Everything is OK</p>
//     </div>`);
// })



// server.js
const express = require('express');
const app = express();

// packages
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// connection to DB and cloudinary
const { connectDB } = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

// routes
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const courseRoutes = require('./routes/course');

const aiRoutes = require('./routes/ai');
const quizRoutes = require('./routes/quiz');
const assignmentRoutes = require('./routes/assignment');
const certificationRoutes = require('./routes/certification');

// const categoryRoutes = require("./routes/category"); // add this near other routes

// middleware 
app.use(express.json()); // to parse json body
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    // origin: "*",
    credentials: true
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});

// connections
connectDB();
cloudinaryConnect();

// mount route
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
// // then mount it below others
// app.use('/api/v1/category', categoryRoutes);

// new mounts
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/assignment', assignmentRoutes);
app.use('/api/v1/certification', certificationRoutes);



// Serve generated certificates
app.use('/certificates', express.static('certificates'));
// app.use('/certificates', express.static(path.join(__dirname, 'certificates')));


// Default Route
app.get('/', (req, res) => {
  res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});
