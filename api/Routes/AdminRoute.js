import express from 'express';
import jwt from 'jsonwebtoken';
import { Admin, Employee, Category } from '../models/index.js';
import bcrypt from 'bcrypt';
import { log } from 'console';

const router = express.Router();

// JWT Secret
const jwtSecret = 'jwt_secret_key';

// Login
router.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && password === admin.password) {
      const token = jwt.sign({ role: 'admin', email, id: admin._id }, jwtSecret, { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true });
      return res.json({ loginStatus: true });
    }
    return res.json({ loginStatus: false, Error: 'Wrong email or password' });
  } catch (err) {
    return res.json({ loginStatus: false, Error: 'Error processing request' });
  }
});

// Fetch Categories
router.get('/category', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ Status: true, Result: categories });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

// Add Category
router.post('/add_category', async (req, res) => {
  const { category } = req.body;
  try {
    const newCategory = new Category({ name: category });
    await newCategory.save();
    res.json({ Status: true });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

// Add Employee
router.post('/add_employee', async (req, res) => {
  const { Fname, Lname, dob, Eid, salary, Bonus, category_id, gender } = req.body;

  try {
    // Create a new employee
    const newEmployee = await Employee.create({
      Fname,
      Lname,
      dob,
      Eid,
      salary,
      Bonus,
      category_id,
      gender // Added gender field
    });

    res.json({ Status: true, Message: "Employee added successfully", Result: newEmployee });
  } catch (err) {
    res.json({ Status: false, Error: err.message });
  }
});

// Get All Employees
router.get('/employee', async (req, res) => {
  try {
    const employees = await Employee.find().populate('category_id');
    res.json({ Status: true, Result: employees });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

// Get Employee By ID
router.get('/employee/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id).populate('category_id');
    res.json({ Status: true, Result: employee });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

router.put('/edit_employee/:id', async (req, res) => {
  const { id } = req.params;
  const { Fname, Lname, dob, salary, Bonus, category_id, gender } = req.body;

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Eid: id },
      { Fname, Lname, dob, salary, Bonus, category_id, gender }, // Include gender field
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ Status: false, Error: 'Employee not found' });
    }

    res.json({ Status: true, Result: updatedEmployee });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

router.delete('/delete_employee/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Employee.findByIdAndDelete(id);
    res.json({ Status: true });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

router.get('/employee_count', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.json({ Status: true, Result: { employee: count } });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

router.get('/salary_count', async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $project: {
          salary: { $toDouble: "$salary" },
          Bonus: { $toDouble: "$Bonus" }
        }
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: '$salary' },
          totalBonus: { $sum: '$Bonus' }
        }
      }
    ]);

    const ts = result[0]?.totalSalary + result[0]?.totalBonus || 0;
    res.json({ Status: true, Result: { totalSalary: ts || 0 } });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

// Fetch Admin Records
router.get('/admin_records', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({ Status: true, Result: admins });
  } catch (err) {
    res.json({ Status: false, Error: 'Query Error' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ Status: true });
});

router.get('/department_salary_report', async (req, res) => {
  try {
    const report = await Employee.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: "$categoryDetails"
      },
      {
        $group: {
          _id: "$category_id",  
          departmentName: { $first: "$categoryDetails.name" },  
          totalSalary: { 
            $sum: { 
              $add: [
                { $toDouble: "$salary" },  
                { $ifNull: [{ $toDouble: "$bonus" }, 0] }  
              ]
            }
          },
          totalEmployees: { $sum: 1 }  
        }
      }
    ]);

    res.json({ Status: true, Result: report });
  } catch (err) {
    res.json({ Status: false, Error: err.message });
  }
});


// Gender Ratio in Departments
router.get('/department_gender_report', async (req, res) => {
  try {
    const report = await Employee.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: "$categoryDetails"
      },
      {
        $group: {
          _id: "$category_id",
          departmentName: { $first: "$categoryDetails.name" },
          totalMaleEmployees: {
            $sum: {
              $cond: [{ $eq: ["$gender", "M"] }, 1, 0]
            }
          },
          totalFemaleEmployees: {
            $sum: {
              $cond: [{ $eq: ["$gender", "F"] }, 1, 0]
            }
          },
          totalEmployees: { $sum: 1 }
        }
      },
      {
        $project: {
          departmentID: "$_id",
          departmentName: 1,
          totalMaleEmployees: 1,
          malePercentage: {
            $multiply: [{ $divide: ["$totalMaleEmployees", "$totalEmployees"] }, 100]
          },
          totalFemaleEmployees: 1,
          femalePercentage: {
            $multiply: [{ $divide: ["$totalFemaleEmployees", "$totalEmployees"] }, 100]
          }
        }
      }
    ]);

    res.json({ Status: true, Result: report });
  } catch (err) {
    res.json({ Status: false, Error: err.message });
  }
});

export { router as adminRouter };
