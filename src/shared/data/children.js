// Mock child profiles (and the parent account) for the grown-up side.
// Stand-in until there are real accounts: these will come from the backend via api.js.
//
//   avatar   key of a picture registered in data/images.js, or null for the generic person icon.
export const children = [
  { id: 'child-1', name: 'Noah', age: 6, avatar: null, joinedDate: '2026-09-01' },
  { id: 'child-2', name: 'Maya', age: 4, avatar: null, joinedDate: '2026-09-15' },
];

// The logged-in parent (there's no real login yet, so the parent is always "signed in").
// Mock only, so the change-password flow can be tried. There is no real login yet.
export const MOCK_PARENT_PASSWORD = 'tinygiants1';
export const parentAccount = { name: 'Alex Morgan', email: 'alex.morgan@example.com' };
