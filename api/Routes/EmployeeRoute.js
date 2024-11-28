import express from 'express';
import { Employee } from '../models/index.js';

const router = express.Router();



// Route to get employee details
router.get('/employee/detail/:id', (req, res) => {
  const employeeId = req.params.id;
  Employee.findById(employeeId)
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    })
    .catch(err => res.status(500).json({ Error: err.message }));
});


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ Status: true });
});

export { router as EmployeeRouter };
