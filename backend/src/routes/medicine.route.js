import express from 'express';
import { body, param } from 'express-validator'
import { validate } from '../middlewares/validator.middleware.js';

// Medicine verification endpoint

const medicineRoute = express.Router();
medicineRoute.get(
  '/verify/:barcode',
  [
    param('barcode').notEmpty().withMessage('Barcode is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { barcode } = req.params;
      const mockMedicineInfo = {
        name: 'Paracetamol 500mg',
        manufacturer: 'Dược Hậu Giang',
        expiryDate: '2025-12-31',
        isAuthentic: true,
        barcode: barcode,
      };
      
      res.json(mockMedicineInfo);
    } catch (error) {
      console.error('Medicine verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { medicineRoute };