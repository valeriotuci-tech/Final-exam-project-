import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/api/auth/register`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: body.email,
        name: body.name,
      },
      accessToken: 'mock-access-token',
    }, { status: 201 });
  }),

  http.post(`${API_URL}/api/auth/login`, async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: body.email,
          name: 'Test User',
        },
        accessToken: 'mock-access-token',
      });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/api/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // Campaigns endpoints
  http.get(`${API_URL}/api/campaigns`, () => {
    return HttpResponse.json({
      campaigns: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'Help Local Pizzeria Expand',
          description: 'Support our neighborhood pizza place',
          targetAmount: 50000,
          currentAmount: 25000,
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z',
          status: 'active',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'New Sushi Restaurant',
          description: 'Bringing authentic sushi to the community',
          targetAmount: 100000,
          currentAmount: 75000,
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.999Z',
          status: 'active',
        },
      ],
    });
  }),

  http.get(`${API_URL}/api/campaigns/:id`, ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      id,
      title: 'Help Local Pizzeria Expand',
      description: 'Support our neighborhood pizza place to open a second location',
      targetAmount: 50000,
      currentAmount: 25000,
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-12-31T23:59:59.999Z',
      status: 'active',
      restaurant: {
        id: '123e4567-e89b-12d3-a456-426614174010',
        name: 'Local Pizzeria',
        description: 'Best pizza in town',
      },
    });
  }),

  http.post(`${API_URL}/api/campaigns`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: '123e4567-e89b-12d3-a456-426614174003',
      ...body,
      currentAmount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Investments endpoints
  http.post(`${API_URL}/api/investments`, async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: '123e4567-e89b-12d3-a456-426614174020',
      ...body,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.get(`${API_URL}/api/investments/user/:userId`, () => {
    return HttpResponse.json({
      investments: [
        {
          id: '123e4567-e89b-12d3-a456-426614174020',
          campaignId: '123e4567-e89b-12d3-a456-426614174001',
          amount: 1000,
          status: 'completed',
          createdAt: '2024-01-15T10:00:00.000Z',
        },
      ],
    });
  }),

  // Restaurants endpoints
  http.get(`${API_URL}/api/restaurants`, () => {
    return HttpResponse.json({
      restaurants: [
        {
          id: '123e4567-e89b-12d3-a456-426614174010',
          name: 'Local Pizzeria',
          description: 'Best pizza in town',
          cuisine: 'Italian',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174011',
          name: 'Sushi Master',
          description: 'Authentic Japanese cuisine',
          cuisine: 'Japanese',
        },
      ],
    });
  }),
];
