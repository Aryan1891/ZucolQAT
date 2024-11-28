import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [deptTotal, setAdminTotal] = useState(0)
  const [employeeTotal, setemployeeTotal] = useState(0)
  const [salaryTotal, setSalaryTotal] = useState(0)
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    deptCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, [])

  const AdminRecords = () => {
    axios.get('http://localhost:3000/auth/admin_records')
    .then(result => {
      if(result.data.Status) {
        setAdmins(result.data.Result)
      } else {
         alert(result.data.Error)
      }
    })
  }
  const deptCount = () => {
    axios
      .get('http://localhost:3000/auth/department_count')
      .then(response => {
        if (response.data.Status) {
          setAdminTotal(response.data.Result.department || 0); // Access the count directly
        } else {
          console.error('Error fetching admin count:', response.data.Error);
        }
      })
      .catch(error => {
        console.error('Network or server error:', error);
      });
  };
  
  const employeeCount = () => {
    axios.get('http://localhost:3000/auth/employee_count')
    .then(response => {
      if(response.data.Status) {
        setemployeeTotal(response.data.Result.employee)
      }
    })
  }
  const salaryCount = () => {
    axios.get('http://localhost:3000/auth/salary_count')
    .then(response => {
      if(response.data.Status) {
        setSalaryTotal(response.data.Result.totalSalary||0)
      } else {
        alert(response.data.Error)
      }
    })
  }
  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Departments</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{deptTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salary</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>
      {/* <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              admins.map(a => (
                <tr>
                  <td>{a.email}</td>
                  <td>
                  <button
                    className="btn btn-info btn-sm me-2">
                    Edit
                  </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div> */}
    </div>
  )
}

export default Home