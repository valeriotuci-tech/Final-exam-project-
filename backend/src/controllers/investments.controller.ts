import { Request, Response } from 'express';
import { pool } from '../db';
import logger from '../config/logger';

export const createInvestment = async (req: Request, res: Response) => {
  const { campaignId, amount } = req.body;
  const userId = (req as any).user?.id;

  try {
    // Check if campaign exists and is active
    const campaignResult = await pool.query(
      `SELECT id, goal_amount, min_investment, max_investment, status, end_date
       FROM campaigns WHERE id = $1`,
      [campaignId]
    );

    if (campaignResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    const campaign = campaignResult.rows[0];

    if (campaign.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Campaign is not active',
      });
    }

    if (new Date(campaign.end_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Campaign has ended',
      });
    }

    // Validate investment amount
    if (amount < campaign.min_investment) {
      return res.status(400).json({
        success: false,
        message: `Minimum investment is ${campaign.min_investment}`,
      });
    }

    if (amount > campaign.max_investment) {
      return res.status(400).json({
        success: false,
        message: `Maximum investment is ${campaign.max_investment}`,
      });
    }

    // Check current total investment
    const totalResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM investments WHERE campaign_id = $1',
      [campaignId]
    );

    const currentTotal = parseFloat(totalResult.rows[0].total);
    if (currentTotal + amount > campaign.goal_amount) {
      return res.status(400).json({
        success: false,
        message: 'Investment would exceed campaign goal',
      });
    }

    // Create investment
    const result = await pool.query(
      `INSERT INTO investments (user_id, campaign_id, amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'pending', NOW(), NOW())
       RETURNING *`,
      [userId, campaignId, amount]
    );

    logger.info(`Investment created: ${result.rows[0].id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating investment',
    });
  }
};

export const getUserInvestments = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const result = await pool.query(
      `SELECT i.*, c.title as campaign_title, c.status as campaign_status,
              r.name as restaurant_name
       FROM investments i
       JOIN campaigns c ON i.campaign_id = c.id
       JOIN restaurants r ON c.restaurant_id = r.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get user investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching investments',
    });
  }
};

export const getInvestmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  try {
    const result = await pool.query(
      `SELECT i.*, c.title as campaign_title, c.status as campaign_status,
              r.name as restaurant_name, r.cuisine_type, r.location
       FROM investments i
       JOIN campaigns c ON i.campaign_id = c.id
       JOIN restaurants r ON c.restaurant_id = r.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching investment',
    });
  }
};

export const updateInvestmentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE investments 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    logger.info(`Investment status updated: ${id} to ${status}`);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Update investment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating investment status',
    });
  }
};

export const deleteInvestment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  try {
    // Check if investment belongs to user and is still pending
    const checkResult = await pool.query(
      'SELECT status FROM investments WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found',
      });
    }

    if (checkResult.rows[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending investments',
      });
    }

    const result = await pool.query(
      'DELETE FROM investments WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    logger.info(`Investment deleted: ${id}`);

    res.json({
      success: true,
      message: 'Investment cancelled successfully',
    });
  } catch (error) {
    logger.error('Delete investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling investment',
    });
  }
};
