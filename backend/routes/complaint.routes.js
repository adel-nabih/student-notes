import express from 'express';
import { 
  createComplaint, 
  getAllComplaints, 
  updateComplaintStatus, 
  deleteComplaint,
  editComplaint 
} from '../controllers/complaint.controller.js'; // We will create this next

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// --- User Route ---
// POST /api/complaints
// (A logged-in user can CREATE a complaint)
router.post('/', authMiddleware, createComplaint);

// --- Admin CRUD Routes ---
// GET /api/complaints/admin
// (An admin can READ all complaints)
router.get('/admin', adminMiddleware, getAllComplaints);

// PUT /api/complaints/admin/:id
// (An admin can UPDATE a complaint's status)
router.put('/admin/:id', adminMiddleware, updateComplaintStatus);

// PUT /api/complaints/admin/edit/:id
// (An admin can UPDATE a complaint's text)
router.put('/admin/edit/:id', adminMiddleware, editComplaint);

// DELETE /api/complaints/admin/:id
// (An admin can DELETE a complaint)
router.delete('/admin/:id', adminMiddleware, deleteComplaint);

export default router;