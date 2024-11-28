import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    Fname: "",
    Lname: "",
    dob: "",
    Eid: "",
    gender: "",
    salary: "0",
    Bonus: "0",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    axios
      .get('http://localhost:3000/auth/category')
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch employee details
    axios
      .get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        const data = result.data.Result[0];
        setEmployee({
          Fname: data.Fname,
          Lname: data.Lname,
          dob: data.dob,
          Eid: data.Eid,
          gender: data.gender,
          salary: data.salary,
          Bonus: data.Bonus || "0", 
          category_id: data.category_id,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(employee);
    axios
      .put(`http://localhost:3000/auth/edit_employee/${employee.Eid}`, employee)
      .then((result) => {
        if (result.data.Status) {
          console.log(result);
          navigate('/dashboard/employee');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-6">
            <label htmlFor="inputFname" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputFname"
              placeholder="Enter First Name"
              value={employee.Fname}
              onChange={(e) =>
                setEmployee({ ...employee, Fname: e.target.value })
              }
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="inputLname" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputLname"
              placeholder="Enter Last Name"
              value={employee.Lname}
              onChange={(e) =>
                setEmployee({ ...employee, Lname: e.target.value })
              }
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              className="form-select"
              value={employee.gender}
              onChange={(e) =>
                setEmployee({ ...employee, gender: e.target.value })
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputDob" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDob"
              value={employee.dob}
              onChange={(e) =>
                setEmployee({ ...employee, dob: e.target.value })
              }
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEid" className="form-label">
              Employee ID
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEid"
              placeholder="Enter Employee ID"
              value={employee.Eid}
              onChange={(e) =>
                setEmployee({ ...employee, Eid: e.target.value })
              }
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="inputBonus" className="form-label">
              Bonus
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputBonus"
              placeholder="Enter Bonus"
              value={employee.Bonus}
              onChange={(e) =>
                setEmployee({ ...employee, Bonus: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Department Name
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.category_id}
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
              required
            >
              <option value="">Select Department</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
