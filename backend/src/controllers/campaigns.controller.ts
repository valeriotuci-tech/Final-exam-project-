import { Request, Response } from 'express';
import { pool } from '../db';
import logger from '../config/logger';

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT c.*, r.name as restaurant_name, r.cuisine_type, r.location,
             COALESCE(SUM(i.amount), 0) as current_amount,
             COUNT(DISTINCT i.id) as investor_count
      FROM campaigns c
      LEFT JOIN restaurants r ON c.restaurant_id = r.id
      LEFT JOIN investments i ON c.id = i.campaign_id
    `;

    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push(`c.status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY c.id, r.id
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: result.rowCount || 0,
      },
    });
  } catch (error) {
    logger.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
    });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Get campaign with restaurant info
    const campaignResult = await pool.query(
      `SELECT c.*, r.name as restaurant_name, r.cuisine_type, r.location, r.description as restaurant_description
       FROM campaigns c
       LEFT JOIN restaurants r ON c.restaurant_id = r.id
       WHERE c.id = $1`,
      [id]
    );

    if (campaignResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    const campaign = campaignResult.rows[0];

    // Get milestones for this campaign
    const milestonesResult = await pool.query(
      `SELECT milestone_id, campaign_id, milestone_name, description, target_amount_krw, status
       FROM milestones
       WHERE campaign_id = $1
       ORDER BY milestone_id`,
      [id]
    );

    // Get investment summary
    const investmentSummary = await pool.query(
      `SELECT 
         COALESCE(SUM(amount_krw), 0) as total_invested,
         COUNT(DISTINCT investor_user_id) as backer_count
       FROM investments
       WHERE campaign_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        campaign: campaign,
        restaurant: {
          name: campaign.restaurant_name,
          cuisine_type: campaign.cuisine_type,
          location: campaign.location,
          description: campaign.restaurant_description
        },
        milestones: milestonesResult.rows,
        investmentSummary: {
          totalInvested: Number(investmentSummary.rows[0].total_invested),
          backerCount: Number(investmentSummary.rows[0].backer_count)
        }
      },
    });
  } catch (error) {
    logger.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign',
    });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  const {
    restaurant_id,
    title,
    description,
    goal_amount,
    min_investment,
    max_investment,
    equity_offered,
    end_date,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO campaigns (
        restaurant_id, title, description, goal_amount, 
        min_investment, max_investment, equity_offered, 
        end_date, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW(), NOW())
      RETURNING *`,
      [
        restaurant_id,
        title,
        description,
        goal_amount,
        min_investment,
        max_investment,
        equity_offered,
        end_date,
      ]
    );

    logger.info(`Campaign created: ${result.rows[0].id}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating campaign',
    });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    goal_amount,
    min_investment,
    max_investment,
    equity_offered,
    status,
    end_date,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE campaigns 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           goal_amount = COALESCE($3, goal_amount),
           min_investment = COALESCE($4, min_investment),
           max_investment = COALESCE($5, max_investment),
           equity_offered = COALESCE($6, equity_offered),
           status = COALESCE($7, status),
           end_date = COALESCE($8, end_date),
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        title,
        description,
        goal_amount,
        min_investment,
        max_investment,
        equity_offered,
        status,
        end_date,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    logger.info(`Campaign updated: ${id}`);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating campaign',
    });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM campaigns WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    logger.info(`Campaign deleted: ${id}`);

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    logger.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting campaign',
    });
  }
};

export const getCampaignInvestments = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT i.*, u.name as investor_name, u.email as investor_email
       FROM investments i
       JOIN users u ON i.user_id = u.id
       WHERE i.campaign_id = $1
       ORDER BY i.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get campaign investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign investments',
    });
  }
};
