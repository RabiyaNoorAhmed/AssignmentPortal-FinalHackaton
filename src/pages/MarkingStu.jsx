import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { BarChart, Bar, Cell, Tooltip, Legend, XAxis, YAxis } from "recharts";
import Loader from '../components/loader/Loader';
const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const studentId = currentUser.id;

      if (!token || !studentId) {
        console.error("Token or student ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/assignments/assignments`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { studentId },
          }
        );
        console.log("Fetched assignments:", response.data); // Log data
        setAssignments(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch assignments:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setTimeout(() => {
          setLoading(false); // Stop loading
          setShowLoader(false); // Hide loader
        }, 3000);
      }
    };

    if (currentUser) {
      fetchAssignments();
    }
  }, [currentUser]);

  const determinePassFail = (marks, totalMarks) => {
    if (totalMarks === 0 || totalMarks === undefined || totalMarks === null)
      return "Pending"; // Handle edge cases
    const passingPercentage = 50; // Define the passing percentage
    const percentage = (marks / totalMarks) * 100;

    return percentage >= passingPercentage ? "Pass" : "Fail";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pass":
        return "green";
      case "Fail":
        return "red";
      default: // Assuming default is 'Pending'
        return "orange"; // Or yellow, depending on your preference
    }
  };

  // Prepare data for the bar chart
  const barData = [
    {
      name: "Pass",
      value: assignments.filter(
        (assignment) => assignment.passFailStatus === "Pass"
      ).length,
    },
    {
      name: "Fail",
      value: assignments.filter(
        (assignment) => assignment.passFailStatus === "Fail"
      ).length,
    },
    {
      name: "Pending",
      value: assignments.filter(
        (assignment) => assignment.passFailStatus === "Pending"
      ).length,
    },
  ];

  const COLORS = ["#4CAF50", "#F44336", "#FFC107"];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Assignments
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Assignment Title</b>
                  </TableCell>
                  <TableCell>
                    <b>Marks</b>
                  </TableCell>
                  <TableCell>
                    <b>Remarks</b>
                  </TableCell>
                  <TableCell>
                    <b>Pass/Fail</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment._id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>
                      {`${assignment.marks !== undefined ? assignment.marks : "0"}/${
                        assignment.totalMarks
                      }`}
                    </TableCell>
                    <TableCell>{assignment.comments || "N/A"}</TableCell>
                    <TableCell
                      style={{
                        color: getStatusColor(assignment.passFailStatus),
                        fontWeight: "bold",
                      }}
                    >
                      {assignment.passFailStatus ? assignment.passFailStatus : "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Bar chart for assignment statuses */}
           
          </TableContainer>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Assignment Status Distribution
            </Typography>
            <BarChart
              width={500}
              height={300}
              data={barData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
        </>
      )}
    </Box>
  );
};

export default StudentAssignments;
