import express from 'express';
import { 
  createComplaint, 
  getAllComplaints, 
  updateComplaintStatus, 
  deleteComplaint,
  editComplaint 
} from '../controllers/complaint.controller.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// user
// POST /api/complaints
// only logged-in user can CREATE a complaint
router.post('/', authMiddleware, createComplaint);

// admin crud routes
// GET /api/complaints/admin
// admin can read
router.get('/admin', adminMiddleware, getAllComplaints);

// PUT /api/complaints/admin/:id
// admin can update stuff
router.put('/admin/:id', adminMiddleware, updateComplaintStatus);

// PUT /api/complaints/admin/edit/:id
// can update tetx of complaint
router.put('/admin/edit/:id', adminMiddleware, editComplaint);

// DELETE /api/complaints/admin/:id
// admin can delete
router.delete('/admin/:id', adminMiddleware, deleteComplaint);

export default router;