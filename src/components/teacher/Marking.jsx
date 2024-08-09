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
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const courses = ['Graphics Designing', 'Web and App Development', 'Tecno Kids', 'UI UX Designing', 'Generative Ai & Chatbox', 'Digital Marketing', 'Amazon Mastery'];
const batches = ['Batch 11', 'Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17'];

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
    course: 'Graphics Designing',
    batch: 'Batch 11',
    assignments: [
      { id: 1, marks: 40, link: 'http://example.com/alice-math-homework', code: 'XYZ123', uploadedAt: '2024-07-24T10:00:00Z' },
      { id: 2, marks: 90, link: 'http://example.com/alice-history-essay', code: 'ABC456', uploadedAt: '2024-07-25T11:00:00Z' },
    ],
  },
  // Add more student data as needed
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
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
    const marksValue = Number(marks);
    if (isNaN(marksValue)) return; // Avoid setting invalid marks
    setStudents(students.map(student =>
      student.id === studentId
        ? {
          ...student,
          assignments: student.assignments.map(assignment =>
            assignment.id === assignmentId
              ? { ...assignment, marks: marksValue }
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

  const filteredStudents = students.filter(student =>
    student.course === selectedCourse && student.batch === selectedBatch
  );

  const filteredAssignments = assignments.filter(assignment =>
    filteredStudents.some(student =>
      student.assignments.some(a => a.id === assignment.id)
    )
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

    const averageMarks = assignmentMarks.length === 0
      ? 0
      : assignmentMarks.reduce((sum, marks) => sum + marks, 0) / assignmentMarks.length;

    const sortedByMarks = studentsWithAssignment.sort((a, b) =>
      b.assignments.find(assignment => assignment.id === assignmentId)?.marks -
      a.assignments.find(assignment => assignment.id === assignmentId)?.marks
    );

    const topStudent = sortedByMarks[0]?.name || 'N/A';
    const bottomStudent = sortedByMarks.slice(-1)[0]?.name || 'N/A';
    const missingAssignments = totalStudents - submittedAssignments;

    return {
      submittedAssignments,
      totalStudents,
      averageMarks: averageMarks.toFixed(2),
      topStudent,
      bottomStudent,
      missingAssignments,
      assignmentMarks,
      studentsWithAssignment: studentsWithAssignment || [],
    };
  };

  const renderAssignmentStatsChart = () => {
    if (!selectedAssignment) return null;

    const stats = getAssignmentStats(selectedAssignment);

    if (!stats.studentsWithAssignment || !Array.isArray(stats.studentsWithAssignment)) {
      return null;
    }

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Assignment Statistics Chart</Typography>
        <BarChart
          width={isSmallScreen ? 250 : 600} // Responsive width
          height={300}
          data={stats.studentsWithAssignment.map(student => ({
            name: student.name,
            marks: student.assignments.find(assignment => assignment.id === selectedAssignment)?.marks || 0,
          }))}
          margin={{ top: -20, right: 30, left: 10, bottom: 5 }}
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
            {filteredAssignments.map(assignment => (
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
