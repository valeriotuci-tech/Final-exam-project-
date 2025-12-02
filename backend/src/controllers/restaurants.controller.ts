import { Request, Response } from 'express';
import { pool } from '../db';
import logger from '../config/logger';

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const { cuisine_type, location, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM restaurants';
    const params: any[] = [];
    const conditions: string[] = [];

    if (cuisine_type) {
      conditions.push(`cuisine_type = $${params.length + 1}`);
      params.push(cuisine_type);
    }

    if (location) {
      conditions.push(`location ILIKE $${params.length + 1}`);
      params.push(`%${location}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
    logger.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants',
    });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Get associated campaigns
    const campaignsResult = await pool.query(
      `SELECT c.*, 
              COALESCE(SUM(i.amount), 0) as current_amount,
              COUNT(DISTINCT i.id) as investor_count
       FROM campaigns c
       LEFT JOIN investments i ON c.id = i.campaign_id
       WHERE c.restaurant_id = $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        campaigns: campaignsResult.rows,
      },
    });
  } catch (error) {
    logger.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant',
    });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  const {
    name,
    description,
    cuisine_type,
    location,
    owner_id,
    contact_email,
    contact_phone,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO restaurants (
        name, description, cuisine_type, location, 
        owner_id, contact_email, contact_phone, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [
        name,
        description,
        cuisine_type,
        location,
        owner_id,
        contact_email,
        contact_phone,
      ]
    );

    logger.info(`Restaurant created: ${result.rows[0].id}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating restaurant',
    });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    cuisine_type,
    location,
    contact_email,
    contact_phone,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE restaurants 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           cuisine_type = COALESCE($3, cuisine_type),
           location = COALESCE($4, location),
           contact_email = COALESCE($5, contact_email),
           contact_phone = COALESCE($6, contact_phone),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, cuisine_type, location, contact_email, contact_phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    logger.info(`Restaurant updated: ${id}`);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating restaurant',
    });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if restaurant has active campaigns
    const campaignsResult = await pool.query(
      'SELECT id FROM campaigns WHERE restaurant_id = $1 AND status = $2',
      [id, 'active']
    );

    if (campaignsResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete restaurant with active campaigns',
      });
    }

    const result = await pool.query(
      'DELETE FROM restaurants WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    logger.info(`Restaurant deleted: ${id}`);

    res.json({
      success: true,
      message: 'Restaurant deleted successfully',
    });
  } catch (error) {
    logger.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting restaurant',
    });
  }
};

export const getRestaurantCampaigns = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.*, 
              COALESCE(SUM(i.amount), 0) as current_amount,
              COUNT(DISTINCT i.id) as investor_count
       FROM campaigns c
       LEFT JOIN investments i ON c.id = i.campaign_id
       WHERE c.restaurant_id = $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get restaurant campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant campaigns',
    });
  }
};
