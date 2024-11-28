import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredEmployees, setFilteredEmployees] = useState([]); // State for filtered employee list
  const [searchField, setSearchField] = useState("Eid"); // Default search by Employee ID
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Fetch employee list
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
          setFilteredEmployees(result.data.Result); // Initially set the filtered list to all employees
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch categories for displaying category names
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

  // Filter employees based on the search query and selected search field
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = employees.filter((e) => {
      switch (searchField) {
        case "Eid":
          return e.Eid.toLowerCase().includes(lowercasedQuery);
        case "Fname":
          return e.Fname.toLowerCase().includes(lowercasedQuery);
        case "Lname":
          return e.Lname.toLowerCase().includes(lowercasedQuery);
        default:
          return true;
      }
    });
    setFilteredEmployees(filtered); // Update filtered employees list
  }, [searchQuery, employees, searchField]); // Re-filter when searchQuery, employees, or searchField changes

  const handleDelete = (id) => {
    // Call the API to delete the employee
    axios
      .delete(`http://localhost:3000/auth/delete_employee/${id}`)
      .then((result) => {
        if (result.data.Status) {
          // Re-fetch the employees after deletion
          setEmployees(employees.filter((employee) => employee.Eid !== id));
          setFilteredEmployees(filteredEmployees.filter((employee) => employee.Eid !== id));
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCategoryName = (categoryId) => {
    console.log(categoryId);
    const category = categories.find((cat) => cat._id.toString() === categoryId.toString());
    return categoryId?.name||"Unknown";
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>

      {/* Search Filter Dropdown and Search Input */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="mt-3">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="form-select"
            style={{
              width: '200px',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '10px',
            }}
          >
            <option value="Eid">Search by Employee ID</option>
            <option value="Fname">Search by First Name</option>
            <option value="Lname">Search by Last Name</option>
          </select>
        </div>

        <div className="mt-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Search by ${searchField}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            style={{
              width: '300px',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }} 
          />
        </div>

        <Link to="/dashboard/add_employee" className="btn btn-success mt-3">
          Add Employee
        </Link>
      </div>

      <div className="mt-3">
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.Eid} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/employee/${e.Eid}`)}>
                <td>{`${e.Fname} ${e.Lname}`}</td>
                <td>{e.Eid}</td>
                <td>{e.salary}</td>
                <td>{getCategoryName(e.category_id)}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/${e.Eid}`}
                    className="btn btn-info btn-sm me-2"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.Eid)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
