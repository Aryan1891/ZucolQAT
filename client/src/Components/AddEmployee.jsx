import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    Fname: "",
    Lname: "",
    dob: "",
    Eid: "",
    salary: "0",
    Bonus: "0",
    gender:"",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending the employee data as a JSON object directly to the backend
    axios
      .post("http://localhost:3000/auth/add_employee", employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
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
              onChange={(e) =>
                setEmployee({ ...employee, Lname: e.target.value })
              }
              required
            />
          </div>
          <div className="col-12">
          <label htmlFor="gender" clasName="form-label">
              Gender
            </label>
          <input
              type="text"
              className="form-control rounded-0"
              id="Gender"
              placeholder="M/F"
              onChange={(e) =>
                setEmployee({ ...employee, gender: e.target.value })
              }
              required
            />
            </div>
          <div className="col-12">
            <label htmlFor="inputDob" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDob"
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
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
