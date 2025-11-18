import Complaint from '../models/Complaint.js';

// CREATE (User)
export const createComplaint = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const newComplaint = new Complaint({
      subject,
      message,
      submittedBy: req.user.id, // from authMiddleware
    });
    await newComplaint.save();
    res.status(201).json({ msg: 'Complaint submitted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// READ (Admin)
export const getAllComplaints = async (req, res) => {
  try {
    // .populate() fetches the user's name and email instead of just the ID
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name email universityId')
      .sort({ createdAt: -1 }); // Show newest first
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// UPDATE (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., { "status": "resolved" }
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const editComplaint = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // Validate
    if (!subject || !message) {
      return res.status(400).json({ msg: 'Subject and message are required' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { subject, message }, // Update these two fields
      { new: true, runValidators: true } // Return the updated doc and run schema validators
    );

    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }
    
    // Return the updated complaint (with user info)
    await complaint.populate('submittedBy', 'name email universityId');
    res.json(complaint);

  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// DELETE (Admin)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }
    res.json({ msg: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};