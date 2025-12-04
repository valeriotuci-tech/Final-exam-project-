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

async function seedFromExcel() {
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
    
    // Create restaurants (matching your Excel data)
    console.log('🍽️  Creating restaurants...');
    
    const restaurants = [
      {
        owner_id: owner1.rows[0].id,
        name: 'Seoul Grill House',
        description: 'Authentic Korean BBQ experience with premium cuts and traditional side dishes',
        cuisine_type: 'Korean BBQ',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Kimchi Masters',
        description: 'Traditional Korean restaurant specializing in homemade kimchi and classic dishes',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Hanok Kitchen',
        description: 'Traditional Korean dining in a beautiful hanok setting',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Foodie Lab',
        description: 'Innovative Korean fusion cuisine laboratory',
        cuisine_type: 'Korean Fusion',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'Gangnam Tacos',
        description: 'Korean-Mexican fusion tacos and street food',
        cuisine_type: 'Fusion',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'Golden Dumplings',
        description: 'Handmade Korean dumplings and traditional comfort food',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Spice & Soul',
        description: 'Modern Korean cuisine with bold flavors',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Hanari Feast',
        description: 'Korean royal court cuisine and traditional feasts',
        cuisine_type: 'Korean Royal Cuisine',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'Sunrise Noodles',
        description: 'Fresh handmade noodles and Korean soups',
        cuisine_type: 'Korean Noodles',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Bim & Roll',
        description: 'Korean rice bowls and kimbap rolls',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Sunset Bibim Kitchen',
        description: 'Bibimbap specialists with seasonal ingredients',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'Jangsu Tofu House',
        description: 'Soft tofu stews and traditional Korean comfort food',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Seoul Sando',
        description: 'Korean-style sandwiches and street food',
        cuisine_type: 'Korean Street Food',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47'
      },
      {
        owner_id: owner2.rows[0].id,
        name: 'Myeong Grill',
        description: 'Premium Korean BBQ and grilled specialties',
        cuisine_type: 'Korean BBQ',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733'
      },
      {
        owner_id: owner3.rows[0].id,
        name: 'Kimchi Soul Kitchen',
        description: 'Traditional kimchi varieties and fermented foods',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10'
      },
      {
        owner_id: owner1.rows[0].id,
        name: 'Hallyu Tables',
        description: 'Modern Korean dining inspired by K-culture',
        cuisine_type: 'Korean',
        location: 'Seoul',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
      }
    ];
    
    const restaurantIds: any[] = [];
    for (const restaurant of restaurants) {
      const result = await client.query(`
        INSERT INTO restaurants (owner_id, name, description, cuisine_type, location, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name
      `, [restaurant.owner_id, restaurant.name, restaurant.description, restaurant.cuisine_type, restaurant.location, restaurant.image_url]);
      
      restaurantIds.push({ id: result.rows[0].id, name: result.rows[0].name });
    }
    
    console.log(`   ✓ Created ${restaurants.length} restaurants\n`);
    
    // Create campaigns (from your Excel data)
    console.log('📊 Creating campaigns...');
    
    const campaigns = [
      {
        restaurant_id: restaurantIds[0].id, // Seoul Grill House
        title: 'Support Seoul Grill House',
        description: 'Help Seoul Grill House grow in Seoul. This campaign will support Operations and menu development.',
        target_amount: 25000000,
        current_amount: 20000,
        start_date: '2022-12-30',
        end_date: '2024-12-30',
        status: 'active'
      },
      {
        restaurant_id: restaurantIds[1].id, // Kimchi Masters
        title: 'Support Kimchi Masters',
        description: 'Help Kimchi Masters grow in Seoul. This campaign will support Operations and menu development. Initial food and drink inventory purchase.',
        target_amount: 20000000,
        current_amount: 20000,
        start_date: '2022-01-10',
        end_date: '2024-01-10',
        status: 'failed'
      },
      {
        restaurant_id: restaurantIds[2].id, // Hanok Kitchen
        title: 'Support Hanok Kitchen',
        description: 'Help Hanok Kitchen grow in Seoul. This campaign will support Operations and menu development. Website and technology development.',
        target_amount: 25000000,
        current_amount: 20000,
        start_date: '2025-01-02',
        end_date: '2025-12-31',
        status: 'active'
      },
      {
        restaurant_id: restaurantIds[3].id, // Foodie Lab
        title: 'Support Foodie Lab',
        description: 'Help Foodie Lab grow in Seoul. This campaign aims to secure Physical investment. Location expansion.',
        target_amount: 15000000,
        current_amount: 30000,
        start_date: '2022-05-14',
        end_date: '2022-07-01',
        status: 'live'
      },
      {
        restaurant_id: restaurantIds[2].id, // Hanok Kitchen
        title: 'Support Hanok Kitchen',
        description: 'Help Hanok Kitchen grow in Seoul. This campaign will support larger inventory purchases. Initial food and drink inventory purchase.',
        target_amount: 10000000,
        current_amount: 10000,
        start_date: '2022-05-21',
        end_date: '2023-07-21',
        status: 'funded'
      },
      {
        restaurant_id: restaurantIds[4].id, // Gangnam Tacos
        title: 'Support Gangnam Tacos',
        description: 'Help Gangnam Tacos grow in Seoul. This campaign will support Operations and menu development. Staff training program.',
        target_amount: 50000000,
        current_amount: 50000,
        start_date: '2022-04-07',
        end_date: '2023-07-05',
        status: 'funded'
      },
      {
        restaurant_id: restaurantIds[5].id, // Golden Dumplings
        title: 'Support Golden Dumplings',
        description: 'Help Golden Dumplings grow in Seoul. This campaign will support Operations and menu development. Delivery system implementation.',
        target_amount: 50000000,
        current_amount: 50000,
        start_date: '2022-01-02',
        end_date: '2023-01-02',
        status: 'funded'
      },
      {
        restaurant_id: restaurantIds[6].id, // Spice & Soul
        title: 'Support Spice & Soul',
        description: 'Help Spice & Soul grow in Seoul. This campaign will support Operations and menu development. Staff training program.',
        target_amount: 5000000,
        current_amount: 5000,
        start_date: '2023-01-01',
        end_date: '2025-01-03',
        status: 'funded'
      },
      {
        restaurant_id: restaurantIds[7].id, // Hanari Feast
        title: 'Support Hanari Feast',
        description: 'Help Hanari Feast grow in Seoul. This campaign will support Operations and menu development. Initial food and drink inventory purchase.',
        target_amount: 5000000,
        current_amount: 5000,
        start_date: '2023-01-01',
        end_date: '2025-01-02',
        status: 'funded'
      },
      {
        restaurant_id: restaurantIds[8].id, // Sunrise Noodles
        title: 'Support Sunrise Noodles',
        description: 'Help Sunrise Noodles grow in Seoul. This campaign could mean Marketing and Technology. Improve delivery app presence.',
        target_amount: 50000000,
        current_amount: 10000,
        start_date: '2025-01-11',
        end_date: '2025-04-15',
        status: 'failed'
      },
      {
        restaurant_id: restaurantIds[9].id, // Bim & Roll
        title: 'Support Bim & Roll',
        description: 'Help Bim & Roll grow in Seoul. This campaign will support Operations and menu development. Delivery system implementation.',
        target_amount: 15000000,
        current_amount: 15000,
        start_date: '2025-01-20',
        end_date: '2025-03-17',
        status: 'draft'
      },
      {
        restaurant_id: restaurantIds[10].id, // Sunset Bibim Kitchen
        title: 'Support Sunset Bibim Kitchen',
        description: 'Help Sunset Bibim Kitchen grow in Seoul. This campaign aims to secure Physical investment. Open new location.',
        target_amount: 15000000,
        current_amount: 5000,
        start_date: '2025-04-20',
        end_date: '2025-06-20',
        status: 'draft'
      },
      {
        restaurant_id: restaurantIds[11].id, // Jangsu Tofu House
        title: 'Support Jangsu Tofu House',
        description: 'Help Jangsu Tofu House grow in Seoul. This campaign will support Operations and menu development. Initial food and drink inventory purchase.',
        target_amount: 5000000,
        current_amount: 5000,
        start_date: '2025-01-05',
        end_date: '2025-03-05',
        status: 'closed'
      },
      {
        restaurant_id: restaurantIds[12].id, // Seoul Sando
        title: 'Support Seoul Sando',
        description: 'Help Seoul Sando grow in Seoul. This campaign aims to secure Physical investment. Ventilation system installation.',
        target_amount: 10000000,
        current_amount: 10000,
        start_date: '2025-03-01',
        end_date: '2025-04-03',
        status: 'closed'
      },
      {
        restaurant_id: restaurantIds[13].id, // Myeong Grill
        title: 'Support Myeong Grill',
        description: 'Help Myeong Grill grow in Seoul. This campaign aims to secure Physical investment. Menu development.',
        target_amount: 20000000,
        current_amount: 20000,
        start_date: '2025-02-02',
        end_date: '2025-04-02',
        status: 'closed'
      },
      {
        restaurant_id: restaurantIds[14].id, // Kimchi Soul Kitchen
        title: 'Support Kimchi Soul Kitchen',
        description: 'Help Kimchi Soul Kitchen grow in Seoul. This campaign aims to secure Physical investment. Outdoor terrace adaptation.',
        target_amount: 50000000,
        current_amount: 50000,
        start_date: '2025-05-28',
        end_date: '2025-07-14',
        status: 'funded'
      },
      {
        restaurant_id: restaurantIds[15].id, // Hallyu Tables
        title: 'Support Hallyu Tables',
        description: 'Help Hallyu Tables grow in Seoul. This campaign will support Operations and menu development. Initial food and drink inventory purchase.',
        target_amount: 50000000,
        current_amount: 50000,
        start_date: '2025-05-04',
        end_date: '2025-07-02',
        status: 'funded'
      }
    ];
    
    for (const campaign of campaigns) {
      await client.query(`
        INSERT INTO campaigns (restaurant_id, title, description, target_amount, current_amount, status, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [campaign.restaurant_id, campaign.title, campaign.description, campaign.target_amount, campaign.current_amount, campaign.status, campaign.start_date, campaign.end_date]);
    }
    
    console.log(`   ✓ Created ${campaigns.length} campaigns\n`);
    
    console.log('✅ Database seeded with data from Excel!\n');
    console.log('📊 Summary:');
    console.log(`   - 1 admin user (admin@tastyfund.com / password123)`);
    console.log(`   - 3 restaurant owners`);
    console.log(`   - ${restaurants.length} restaurants`);
    console.log(`   - ${campaigns.length} campaigns`);
    console.log('\n🎉 All done! Your database matches your Excel data.');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedFromExcel();
