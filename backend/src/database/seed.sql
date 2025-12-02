-- Sample data for TastyFund restaurant crowdfunding

-- Users
INSERT INTO users (id, email, password_hash, name, role)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'alice@example.com', 'hashed-password-1', 'Alice Owner', 'owner'),
    ('00000000-0000-0000-0000-000000000002', 'bob@example.com', 'hashed-password-2', 'Bob Backer', 'user')
ON CONFLICT (id) DO NOTHING;

-- Restaurants
INSERT INTO restaurants (id, owner_id, name, description, location, cuisine_type, image_url)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'Midnight Ramen Lab',
        'Experimental ramen pop-up exploring regional broths and toppings.',
        'Tokyo, Japan',
        'Ramen',
        'https://example.com/images/ramen-lab.jpg'
    )
ON CONFLICT (id) DO NOTHING;

-- Campaigns
INSERT INTO campaigns (
    id,
    restaurant_id,
    title,
    description,
    target_amount,
    current_amount,
    start_date,
    end_date,
    status,
    rewards_json
)
VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'Seasonal Tasting Series',
        'Help us launch a 6-week late-night tasting menu featuring rotating regional ramens.',
        15000,
        3500,
        CURRENT_DATE - INTERVAL '3 days',
        CURRENT_DATE + INTERVAL '27 days',
        'active',
        '[{"tier":"Supporter","min":20},{"tier":"VIP Counter Seat","min":120}]'
    )
ON CONFLICT (id) DO NOTHING;

-- Rewards
INSERT INTO rewards (
    id,
    campaign_id,
    tier_name,
    minimum_amount,
    description,
    limit_quantity,
    claimed_quantity
)
VALUES
    (
        '30000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000001',
        'Supporter',
        20,
        'Thank-you note and your name on our supporter wall.',
        NULL,
        10
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000001',
        'VIP Counter Seat',
        120,
        'One seat at our chef''s counter for the tasting menu opening night.',
        20,
        3
    )
ON CONFLICT (id) DO NOTHING;

-- Investments
INSERT INTO investments (
    id,
    user_id,
    campaign_id,
    amount,
    reward_tier,
    transaction_id,
    status
)
VALUES
    (
        '40000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000001',
        120,
        'VIP Counter Seat',
        'txn_123456789',
        'confirmed'
    )
ON CONFLICT (id) DO NOTHING;
