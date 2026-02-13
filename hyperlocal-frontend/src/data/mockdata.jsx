export const mockUser = {
  id: 1,
  name: "Ritik Sharma",
  email: "ritik@example.com",
  phone: "9876543210",
  address: "New Delhi, India"
};

export const mockProviders = [
  {
    id: 1,
    name: "Raj Plumbing",
    service: "Plumbing",
    rating: 4.5,
    price: 499
  },
  {
    id: 2,
    name: "Spark Electric",
    service: "Electrician",
    rating: 4.8,
    price: 599
  }
];

export const mockBookings = [
  {
    id: 1,
    service: "Plumbing",
    provider: "Raj Plumbing",
    date: "2026-02-15",
    status: "Confirmed"
  },
  {
    id: 2,
    service: "Electrician",
    provider: "Spark Electric",
    date: "2026-02-18",
    status: "Pending"
  }
];
