const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const { getLeads, getLead, createLead, updateLead, deleteLead, getLeadStats, exportLeads } = require('../controllers/leadController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);
router.get('/stats', getLeadStats);
router.get('/',      getLeads);
router.post('/export', adminOnly, exportLeads);
router.get('/:id',   getLead);
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  validate,
  createLead
);
router.put('/:id',   updateLead);
router.delete('/:id',deleteLead);
module.exports = router;
