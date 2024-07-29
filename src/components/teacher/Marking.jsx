import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const courses = ['Math', 'History', 'Science'];
const batches = ['Batch A', 'Batch B', 'Batch C'];

const initialAssignments = [
  { id: 1, title: 'Math Homework', totalMarks: 50, locked: false },
  { id: 2, title: 'History Essay', totalMarks: 100, locked: false },
  { id: 3, title: 'Science Project', totalMarks: 75, locked: false },
];

const initialStudents = [
  {
    id: 1,
    rollNo: 'A01',
    name: 'Alice',
    course: 'Math',
    batch: 'Batch A',
    assignments: [
      { id: 1, marks: 40, link: 'http://example.com/alice-math-homework', code: 'XYZ123', uploadedAt: '2024-07-24T10:00:00Z' },
      { id: 2, marks: 90, link: 'http://example.com/alice-history-essay', code: 'ABC456', uploadedAt: '2024-07-25T11:00:00Z' },
    ],
  },
  {
    id: 2,
    rollNo: 'A02',
    name: 'Bob',
    course: 'Math',
    batch: 'Batch A',
    assignments: [
      { id: 1, marks: 35, link: 'http://example.com/bob-math-homework', code: 'LMN789', uploadedAt: '2024-07-24T12:00:00Z' },
      { id: 2, marks: 85, link: 'http://example.com/bob-history-essay', code: 'DEF012', uploadedAt: '2024-07-25T14:00:00Z' },
    ],
  },
  {
    id: 3,
    rollNo: 'B01',
    name: 'Charlie',
    course: 'History',
    batch: 'Batch B',
    assignments: [
      { id: 2, marks: 80, link: 'http://example.com/charlie-history-essay', code: 'GHI345', uploadedAt: '2024-07-25T15:00:00Z' },
    ],
  },
  {
    id: 4,
    rollNo: 'C01',
    name: 'David',
    course: 'Science',
    batch: 'Batch C',
    assignments: [
      { id: 3, marks: 70, link: 'http://example.com/david-science-project', code: 'JKL678', uploadedAt: '2024-07-26T09:00:00Z' },
    ],
  },
];

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  fontSize: '1rem',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9f9f9',
  },
});

const StatsBox = styled(Box)({
  marginBottom: '16px',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const Marking = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [students, setStudents] = useState(initialStudents);
  const theme = useTheme();

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  const handleAssignmentChange = (event) => {
    setSelectedAssignment(event.target.value);
  };

  const handleMarkChange = (studentId, assignmentId, marks) => {
    setStudents(students.map(student => 
      student.id === studentId
        ? {
            ...student,
            assignments: student.assignments.map(assignment =>
              assignment.id === assignmentId
                ? { ...assignment, marks: Number(marks) }
                : assignment
            ),
          }
        : student
    ));
  };

  const handleLockToggle = (assignmentId) => {
    setAssignments(assignments.map(assignment =>
      assignment.id === assignmentId
        ? { ...assignment, locked: !assignment.locked }
        : assignment
    ));
  };

  const filteredStudents = initialStudents.filter(student =>
    student.course === selectedCourse && student.batch === selectedBatch
  );

  const getAssignmentStats = (assignmentId) => {
    const studentsWithAssignment = filteredStudents.filter(student =>
      student.assignments.some(assignment => assignment.id === assignmentId)
    );
    const totalStudents = filteredStudents.length;
    const submittedAssignments = studentsWithAssignment.length;
    const assignmentMarks = studentsWithAssignment.flatMap(student =>
      student.assignments.filter(assignment => assignment.id === assignmentId).map(assignment => assignment.marks)
    );

    if (assignmentMarks.length === 0) {
      return {
        submittedAssignments,
        totalStudents,
        averageMarks: 0,
        topStudent: 'N/A',
        bottomStudent: 'N/A',
        missingAssignments: totalStudents,
      };
    }

    const averageMarks = assignmentMarks.reduce((sum, marks) => sum + marks, 0) / assignmentMarks.length;
    const topStudent = studentsWithAssignment.sort((a, b) =>
      b.assignments.find(assignment => assignment.id === assignmentId).marks -
      a.assignments.find(assignment => assignment.id === assignmentId).marks
    )[0]?.name || 'N/A';
    const bottomStudent = studentsWithAssignment.sort((a, b) =>
      a.assignments.find(assignment => assignment.id === assignmentId).marks -
      b.assignments.find(assignment => assignment.id === assignmentId).marks
    )[0]?.name || 'N/A';
    const missingAssignments = totalStudents - submittedAssignments;

    return {
      submittedAssignments,
      totalStudents,
      averageMarks: averageMarks.toFixed(2),
      topStudent,
      bottomStudent,
      missingAssignments,
      assignmentMarks,
      studentsWithAssignment,
    };
  };

  const renderAssignmentStatsChart = () => {
    if (!selectedAssignment) return null;

    const stats = getAssignmentStats(selectedAssignment);

    return (
      <Box sx={{ mb: 3 }}>
      
        <Typography variant="h6" gutterBottom>Assignment Statistics Chart</Typography>
        <BarChart
          width={600}
          height={300}
          data={stats.studentsWithAssignment.map(student => ({
            name: student.name,
            marks: student.assignments.find(assignment => assignment.id === selectedAssignment)?.marks || 0,
          }))}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="marks" fill={theme.palette.primary.main} />
        </BarChart>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant="h4" gutterBottom>
        Assignment Marking
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleCourseChange}
            label="Course"
          >
            {courses.map(course => (
              <MenuItem key={course} value={course}>{course}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Batch</InputLabel>
          <Select
            value={selectedBatch}
            onChange={handleBatchChange}
            label="Batch"
          >
            {batches.map(batch => (
              <MenuItem key={batch} value={batch}>{batch}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Assignment</InputLabel>
          <Select
            value={selectedAssignment}
            onChange={handleAssignmentChange}
            label="Assignment"
          >
            {assignments.map(assignment => (
              <MenuItem key={assignment.id} value={assignment.id}>
                {assignment.title}
                <IconButton onClick={() => handleLockToggle(assignment.id)} sx={{ ml: 2 }}>
                  {assignment.locked ? <LockIcon /> : <LockOpenIcon />}
                </IconButton>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedAssignment && renderAssignmentStatsChart()}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Roll No</StyledTableCell>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell>Deployment Link</StyledTableCell>
              <StyledTableCell>Code</StyledTableCell>
              <StyledTableCell>Upload Time</StyledTableCell>
              <StyledTableCell>Marks</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => (
              student.assignments
                .filter(assignment => assignment.id === selectedAssignment)
                .map(assignment => (
                  <StyledTableRow key={assignment.code}>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <a href={assignment.link} target="_blank" rel="noopener noreferrer">View Assignment</a>
                    </TableCell>
                    <TableCell>{assignment.code}</TableCell>
                    <TableCell>{new Date(assignment.uploadedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={assignment.marks || ''}
                        onChange={(e) => handleMarkChange(student.id, assignment.id, e.target.value)}
                        sx={{ width: '100px' }}
                        disabled={assignments.find(a => a.id === selectedAssignment)?.locked}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleMarkChange(student.id, assignment.id, '')}
                        color="error"
                        disabled={assignments.find(a => a.id === selectedAssignment)?.locked}
                      >
                        Clear
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Marking;
