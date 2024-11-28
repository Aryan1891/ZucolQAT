import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);


const employeeSchema = new mongoose.Schema({
  Fname: { type: String, required: true },
  gender: { type: String, required: true }, 
  Lname: { type: String, required: true }, 
  dob: { type: Date, required: true }, 
  Eid: { type: String, required: true, unique: true }, 
  salary: { type: String, required: true, default: "0" }, 
  Bonus: { type: String, default: "0" }, 
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
});



const Employee = mongoose.model('Employee', employeeSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true,unique: true }
});

const Category = mongoose.model('Category', categorySchema);

export { Admin, Employee, Category };
