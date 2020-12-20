
/* using mongodb 
const { MongoClient } = require("mongodb");
// Connection URI
const uri = "mongodb://localhost:27017/?poolSize=20&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const db = client.db("student-management");
    console.log("Connected successfully to server");
    // await insertStudents(db);
    await findDocuments(db);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const insertStudents = async function(db){
    const studentsDocuments = [
        { _id: 1, name: "Hien", age: 20, class: "SE1401"},
        { _id: 2, name: "Giang", age: 20, class: "GD1401"},
        { _id: 3, name: "Long", age: 20, class: "SE1401"}
      ];
    const result = await db.collection('students').insertMany(studentsDocuments);
    console.dir(result.insertedCount+" affected");
}

const findDocuments = async function(db){
    await db.collection("students").find({}).toArray().then( result => {
        console.log(result);
    });
}
*/

/* using mongoose */
const mongoose = require('mongoose');
let Students = null;
let Subjects = null;

async function run() {
  try {
    // Connect the client to the server
    await mongoose.connect("mongodb://localhost:27017/student-management", {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Connected successfully to server");
    //create subject schema
    const subjectSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true , 'Name is empty']
      },
      detail: String
    })
    // Create student schema
    const studentSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true , 'Name is empty']
      },
      age: {
        type: Number,
        min: 0,
        max: 100
      },
      classname: String,
      subjects: subjectSchema
    })
    Students =  mongoose.model("Students",studentSchema);
    Subjects = mongoose.model("Subjects",subjectSchema);
    //await insertStudents();
    await updateStudents();
    //await deleteStudents();
    await findStudents();
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.connection.close();
  }
}
run().catch(console.dir);

const insertStudents = async function insertStudents(){
  const std1 = new Students({
    name: "Hien",
    age: 20,
    classname: "SE1401"
  })
  
  const std2 = new Students({
    name: "Giang",
    age: 20,
    classname: "GD1401"
  })
  
  const std3 = new Students({
    name: "Long",
    age: 20,
    classname: "SE1401"
  })

  // await Students.insertMany([std1,std2,std3],(err) => {
  //     if(err) console.log(err);
  //     else console.log("Successfully");
  //   })

  const subject = new Subjects({
    name: "SWT",
    detail: "Software Testing"
  })

  await subject.save();

  const std4 = new Students({
    name: "Hien Quang",
    age: 20,
    classname: "SE1401",
    subjects: subject
  })

  std4.save();
    
}

const findStudents =  async function findStudents(){
  await Students.find((err, stdList) => {
    if(err) console.log(err);
    else {
      stdList.forEach((std) => {
        console.log(std.name);
      })
    }
  })
}

const updateStudents = async function updateStudents(){
  const subject = new Subjects({
    name: "SWR",
    detail: "Software Requirement"
  })

  await subject.save();
  await Students.updateOne({name: 'Long'}, {subjects: subject}, (err) =>{
    if(err) console.log(err);
    else console.log('Successfully')
  })
}

const deleteStudents = async function deleteStudents(){
  await Students.deleteOne({name: 'Long'}, (err) =>{
    if(err) console.log(err);
    else console.log('Successfully')
  })
}
