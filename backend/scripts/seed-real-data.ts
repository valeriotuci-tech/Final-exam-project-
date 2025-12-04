import { config } from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function clearData(client: any): Promise<void> {
  console.log('🗑️  Clearing existing data...\n');
  
  await client.query('DELETE FROM investments');
  await client.query('DELETE FROM rewards');
  await client.query('DELETE FROM campaigns');
  await client.query('DELETE FROM restaurants');
  await client.query('DELETE FROM users');
  
  console.log('   ✓ All data cleared\n');
}

async function seedRealData() {
  const client = await pool.connect();
  
  try {
    await clearData(client);
    
    const password = await bcrypt.hash('password123', 10);
    
    // Create admin user
    console.log('👥 Creating users...');
    const adminResult = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['admin@tastyfund.com', password, 'Admin User', 'admin']);
    const adminId = adminResult.rows[0].id;
    console.log('   ✓ Admin user created\n');
    
    // Create restaurant owners
    const owner1 = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['kim.owner@tastyfund.com', password, 'Kim Min-jun', 'owner']);
    
    const owner2 = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['lee.owner@tastyfund.com', password, 'Lee Ji-woo', 'owner']);
    
    const owner3 = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, ['park.owner@tastyfund.com', password, 'Park Seo-jun', 'owner']);
    
    console.log('   ✓ 3 restaurant owners created\n');
    
    // Create restaurants
    console.log('🍽️  Creating restaurants...');
    
    const restaurants = [
      {
        owner_id: owner1.rows[0].id,
        name: 'Seoul Grill House',
        description: 'Authentic Korean BBQ experience with premium cuts and traditional side dishes',
        cuisine_type: 'Korean BBQ',
        location: 'Seoul, South Korea',
        image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Kimchi Masters',
        description: 'Traditional Korean restaurant specializing in homemade kimchi and classic dishes',
        cuisine_type: 'Korean',
        location: 'Busan, South Korea',
        image_url: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Bibimbap Palace',
        description: 'Modern Korean fusion restaurant with creative bibimbap variations',
        cuisine_type: 'Korean Fusion',
        location: 'Incheon, South Korea',
        image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Hanok Kitchen',
        description: 'Traditional Korean dining in a beautiful hanok setting',
        cuisine_type: 'Korean',
        location: 'Jeonju, South Korea',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'K-Street Food Hub',
        description: 'Popular Korean street food favorites in a modern casual setting',
        cuisine_type: 'Korean Street Food',
        location: 'Gangnam, Seoul',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'Jeju Island Seafood',
        description: 'Fresh seafood restaurant featuring Jeju Island specialties',
        cuisine_type: 'Korean Seafood',
        location: 'Jeju Island, South Korea',
        image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Tofu Village',
        description: 'Cozy restaurant specializing in sundubu-jjigae and tofu dishes',
        cuisine_type: 'Korean',
        location: 'Daegu, South Korea',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Gangnam Chicken',
        description: 'Korean fried chicken and beer (chimaek) restaurant',
        cuisine_type: 'Korean Fried Chicken',
        location: 'Gangnam, Seoul',
        image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710'
      }
    ];
    
    const restaurantIds = [];
    for (const restaurant of restaurants) {
      const result = await client.query(`
        INSERT INTO restaurants (owner_id, name, description, cuisine_type, location, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [restaurant.owner_id, restaurant.name, restaurant.description, restaurant.cuisine_type, restaurant.location, restaurant.image_url]);
      
      restaurantIds.push({ id: result.rows[0].id, name: restaurant.name });
    }
    
    console.log(`   ✓ Created ${restaurants.length} restaurants\n`);
    
    // Create campaigns
    console.log('📊 Creating campaigns...');
    
    const campaigns = [
      {
        restaurant_id: restaurantIds[0].id,
        title: 'Support Seoul Grill House Expansion',
        description: 'Help us open a second location in Gangnam! We need funds for kitchen equipment, interior design, and initial inventory. Your support will bring authentic Korean BBQ to more food lovers.',
        target_amount: 75000,
        current_amount: 45000,
        status: 'active',
        start_date: '2024-11-01',
        end_date: '2025-02-28'
      },
      {
        restaurant_id: restaurantIds[1].id,
        title: 'Support Kimchi Masters',
        description: 'We want to expand our kimchi production facility and create a kimchi-making workshop space. Help us share the art of traditional kimchi making with the community!',
        target_amount: 50000,
        current_amount: 32000,
        status: 'active',
        start_date: '2024-10-15',
        end_date: '2025-01-31'
      },
      {
        restaurant_id: restaurantIds[2].id,
        title: 'Bibimbap Palace Food Truck',
        description: 'Launch our mobile bibimbap food truck to bring Korean fusion to festivals and events across the city. Modern Korean cuisine on wheels!',
        target_amount: 60000,
        current_amount: 18000,
        status: 'active',
        start_date: '2024-12-01',
        end_date: '2025-03-31'
      },
      {
        restaurant_id: restaurantIds[3].id,
        title: 'Hanok Kitchen Renovation',
        description: 'Restore our traditional hanok building to preserve Korean heritage while upgrading our kitchen facilities for better service.',
        target_amount: 100000,
        current_amount: 85000,
        status: 'active',
        start_date: '2024-09-01',
        end_date: '2025-01-15'
      },
      {
        restaurant_id: restaurantIds[4].id,
        title: 'K-Street Food Hub Grand Opening',
        description: 'Help us launch the ultimate Korean street food destination! Tteokbokki, hotteok, Korean corn dogs, and more. All your favorites in one place.',
        target_amount: 45000,
        current_amount: 12000,
        status: 'active',
        start_date: '2024-11-20',
        end_date: '2025-02-20'
      },
      {
        restaurant_id: restaurantIds[5].id,
        title: 'Jeju Island Seafood Market',
        description: 'Create a fresh seafood market section where customers can select their seafood and have it prepared fresh. Direct from Jeju waters to your table!',
        target_amount: 80000,
        current_amount: 55000,
        status: 'active',
        start_date: '2024-10-01',
        end_date: '2025-01-31'
      },
      {
        restaurant_id: restaurantIds[6].id,
        title: 'Tofu Village Organic Farm',
        description: 'Start our own organic soybean farm to make the freshest tofu daily. From farm to table, supporting local agriculture.',
        target_amount: 90000,
        current_amount: 25000,
        status: 'active',
        start_date: '2024-11-10',
        end_date: '2025-04-30'
      },
      {
        restaurant_id: restaurantIds[7].id,
        title: 'Gangnam Chicken Delivery Fleet',
        description: 'Expand our delivery service with eco-friendly electric scooters. Hot, crispy Korean fried chicken delivered faster and greener!',
        target_amount: 35000,
        current_amount: 28000,
        status: 'active',
        start_date: '2024-11-01',
        end_date: '2025-01-31'
      },
      {
        restaurant_id: restaurantIds[0].id,
        title: 'Seoul Grill House Premium Meat Selection',
        description: 'Partner with premium Korean beef suppliers to offer the highest quality hanwoo beef. Elevate the Korean BBQ experience.',
        target_amount: 40000,
        current_amount: 35000,
        status: 'active',
        start_date: '2024-10-20',
        end_date: '2025-01-20'
      },
      {
        restaurant_id: restaurantIds[1].id,
        title: 'Kimchi Masters Cookbook & Classes',
        description: 'Publish a traditional kimchi cookbook and launch cooking classes. Share our family recipes with the world!',
        target_amount: 25000,
        current_amount: 20000,
        status: 'active',
        start_date: '2024-11-15',
        end_date: '2025-02-15'
      },
      {
        restaurant_id: restaurantIds[2].id,
        title: 'Bibimbap Palace Catering Service',
        description: 'Launch a corporate catering service bringing healthy Korean bowls to offices and events.',
        target_amount: 30000,
        current_amount: 8000,
        status: 'active',
        start_date: '2024-12-01',
        end_date: '2025-03-01'
      },
      {
        restaurant_id: restaurantIds[4].id,
        title: 'K-Street Food Late Night Menu',
        description: 'Extend hours and create a special late-night menu for the after-hours crowd. Korean comfort food when you need it most!',
        target_amount: 20000,
        current_amount: 15000,
        status: 'active',
        start_date: '2024-11-25',
        end_date: '2025-01-25'
      }
    ];
    
    for (const campaign of campaigns) {
      await client.query(`
        INSERT INTO campaigns (restaurant_id, title, description, target_amount, current_amount, status, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [campaign.restaurant_id, campaign.title, campaign.description, campaign.target_amount, campaign.current_amount, campaign.status, campaign.start_date, campaign.end_date]);
    }
    
    console.log(`   ✓ Created ${campaigns.length} campaigns\n`);
    
    console.log('✅ Database seeded with real restaurant data!\n');
    console.log('📊 Summary:');
    console.log(`   - 1 admin user (admin@tastyfund.com / password123)`);
    console.log(`   - 3 restaurant owners`);
    console.log(`   - ${restaurants.length} restaurants`);
    console.log(`   - ${campaigns.length} campaigns`);
    console.log('\n🎉 All done! Your database now has realistic Korean restaurant data.');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedRealData();
