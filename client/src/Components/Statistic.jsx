import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css'; // If you're using an external CSS file

const Statistics = () => {
  const [salaryReport, setSalaryReport] = useState([]);
  const [genderReport, setGenderReport] = useState([]);

  useEffect(() => {
    // Fetch department-wise salary report
    axios
      .get('http://localhost:3000/auth/department_salary_report')
      .then((response) => {
        if (response.data.Status) {
          setSalaryReport(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error(error));

    // Fetch department-wise gender ratio report
    axios
      .get('http://localhost:3000/auth/department_gender_report')
      .then((response) => {
        if (response.data.Status) {
          setGenderReport(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="statistics-container">
      <h3>Department-wise Salary Report</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Total Employees</th>
              <th>Total Salary (Monthly)</th>
            </tr>
          </thead>
          <tbody>
            {salaryReport.map((report) => (
              <tr key={report._id}>
                <td>{report._id}</td>
                <td>{report.departmentName}</td>
                <td>{report.totalEmployees}</td>
                <td>{report.totalSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Gender Ratio in Departments</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Total Male Employees</th>
              <th>% Male</th>
              <th>Total Female Employees</th>
              <th>% Female</th>
            </tr>
          </thead>
          <tbody>
            {genderReport.map((report) => (
              <tr key={report.departmentID}>
                <td>{report.departmentID}</td>
                <td>{report.departmentName}</td>
                <td>{report.totalMaleEmployees}</td>
                <td>{report.malePercentage}%</td>
                <td>{report.totalFemaleEmployees}</td>
                <td>{report.femalePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
