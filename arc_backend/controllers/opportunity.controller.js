import Opportunity from '../models/opportunity.model.js';

// GET /admin/opportunities
export const getAllOpportunities = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const totalOpportunities = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .populate('organizerId', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      opportunities,
      meta: {
        total: totalOpportunities,
        page: parseInt(page),
        totalPages: Math.ceil(totalOpportunities / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /admin/opportunity/:id/status
export const updateOpportunityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Opportunity.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Opportunity not found' });

    res.json({ message: 'Status updated successfully', opportunity: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
