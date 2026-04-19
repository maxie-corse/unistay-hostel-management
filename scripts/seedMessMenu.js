// scripts/seedMessMenu.js
// Run this ONCE after setting up Firebase to populate the mess menu.
// Usage: paste into browser console while logged into the app, OR
//        call seedMessMenu() from src/services/firebase.js in a dev-only button.

import { seedMessMenu } from '../src/services/firebase.js';

seedMessMenu()
  .then(() => console.log('✅ Mess menu seeded successfully!'))
  .catch(err => console.error('❌ Failed to seed mess menu:', err));

