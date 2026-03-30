# Profile and Settings Pages Documentation

This document describes the newly created Profile and Settings pages that follow the same design system as the Home.vue page.

## Created Files

### 1. Profile.vue (`src/views/Profile.vue`)
A comprehensive user profile management page.

**Features:**
- **Edit Mode**: Toggle between view and edit modes
- **Personal Information Section**:
  - First Name & Last Name
  - Email Address (with icon)
  - Phone Number (with icon)
  - Bio (textarea)
- **Address Information Section**:
  - Street Address
  - City, State, ZIP Code
  - Country
- **Stats Cards** (4 cards):
  - Account Status (Active/Verified)
  - Member Since (with days counter)
  - Total Boxes
  - Total Requests
- **Sidebar**:
  - Profile Picture (Avatar with initials)
  - Quick Actions (Change Password, Privacy Settings, Download Data)
  - Account Info Card (Tips and reminders)

**State Management:**
- Form data is loaded from localStorage
- Changes are saved back to localStorage
- Edit/Cancel/Save functionality
- Loading states during save operations

**Design Features:**
- Responsive grid layout (2/3 main content, 1/3 sidebar)
- Consistent rounded-xl cards
- Hover effects on stats cards
- Disabled input states when not editing
- Icon-enhanced input fields
- Gradient profile picture placeholder

---

### 2. Settings.vue (`src/views/Settings.vue`)
A comprehensive settings management page with tabbed navigation.

**Tabs:**

#### General Settings
- Language selection (English, Spanish, French, German)
- Timezone selection (ET, CT, MT, PT, UTC)
- Date format preferences (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)

#### Notifications Settings
- **Email Notifications**:
  - Delivery Updates
  - Service Requests
  - Marketing Emails
- **Push Notifications**:
  - Browser Notifications
- Toggle switches with custom styling

#### Security Settings
- **Change Password Section**:
  - Current Password
  - New Password
  - Confirm New Password
  - Update button with loading state
- **Two-Factor Authentication**:
  - Enable/Disable 2FA
  - Status indicator
- **Active Sessions**:
  - List of current sessions
  - Device and location information
  - Revoke session functionality
  - Current session indicator

#### Privacy Settings
- Profile Visibility toggle
- Show Activity Status toggle
- Data Collection toggle
- All with custom toggle switches

**Sidebar:**
- Security Tips Card (gradient blue)
- Need Help? Support Card
- Danger Zone Card:
  - Deactivate Account (red button)
  - Delete Account (red button)

**Features:**
- Tabbed navigation with icons
- Unsaved changes detection
- Save all settings button (appears when changes detected)
- Settings persist in localStorage
- Loading states
- Custom toggle switches with focus states

---

## Design System

Both pages follow the exact same design patterns as Home.vue:

### Color Scheme
- Primary: `#0D65AE` (brand blue)
- Success: Green (`green-600`, `green-100`)
- Warning: Yellow (`yellow-600`, `yellow-100`)
- Danger: Red (`red-600`, `red-100`)
- Info: Purple (`purple-600`, `purple-100`)
- Orange: Orange (`orange-600`, `orange-100`)

### Component Styling
- **Cards**: `rounded-xl border border-gray-200 p-5 sm:p-6`
- **Hover Effects**: `hover:border-[#0D65AE] hover:shadow-lg transition-all`
- **Buttons Primary**: `bg-[#0D65AE] text-white rounded-lg hover:bg-[#0D65AE]/90`
- **Buttons Secondary**: `bg-white border border-gray-300 rounded-lg hover:bg-gray-50`
- **Input Fields**: `border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]`

### Responsive Breakpoints
- Mobile: Default
- Small: `sm:` (640px)
- Medium: `md:` (768px)
- Large: `lg:` (1024px)

### Stats Cards
- 4 cards with different color themes
- Icon in colored circle on the right
- Title, value, and description
- Hover effects with border color change
- Consistent padding: `p-5 sm:p-6`

### Layout Grid
- Main content: `lg:col-span-2`
- Sidebar: `lg:col-span-1` (right side)
- Gap: `gap-4 sm:gap-6`

---

## Router Configuration

Routes added to `src/router.js`:

```javascript
{
  path: '/profile',
  component: MainLayout,
  children: [
    {
      path: '',
      name: 'Profile',
      component: Profile
    },
  ],
},
{
  path: '/settings',
  component: MainLayout,
  children: [
    {
      path: '',
      name: 'Settings',
      component: Settings
    },
  ],
}
```

---

## Navigation Links

The pages are accessible from the MainLayout header dropdown:
- Profile: `/profile`
- Settings: `/settings`

Both links are already present in the user dropdown menu in `MainLayout.vue`.

---

## Data Persistence

### Profile Page
- Reads user data from `localStorage.getItem('user')`
- Saves updated profile to `localStorage.setItem('user', JSON.stringify(user))`
- Stats (boxes, requests) are currently mock data (can be connected to API)

### Settings Page
- Reads settings from `localStorage.getItem('userSettings')`
- Saves settings to `localStorage.setItem('userSettings', JSON.stringify(settings))`
- All preferences persist across sessions

---

## Future Enhancements

### Profile Page
1. Connect stats to real API endpoints
2. Implement profile picture upload
3. Add email verification flow
4. Add phone number verification

### Settings Page
1. Implement actual 2FA setup flow (QR code, backup codes)
2. Connect password change to API
3. Implement session revocation
4. Add account deactivation/deletion flows
5. Add export data functionality
6. Email frequency preferences
7. Theme/appearance settings

---

## Usage Examples

### Navigate to Profile
```javascript
import { useRouter } from 'vue-router';
const router = useRouter();
router.push('/profile');
```

### Navigate to Settings
```javascript
router.push('/settings');
// Or with specific tab
router.push({ path: '/settings', hash: '#security' });
```

### Access User Data
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.name, user.email);
```

### Access Settings
```javascript
const settings = JSON.parse(localStorage.getItem('userSettings'));
console.log(settings.language, settings.timezone);
```

---

## Component Dependencies

Both pages are standalone Vue 3 Composition API components with no external dependencies:
- No PrimeVue components
- No custom components
- Pure Vue 3 with native HTML elements
- Tailwind CSS for styling

---

## Accessibility Features

- Semantic HTML elements
- Proper label associations
- Focus states on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- ARIA attributes where needed
- High contrast text
- Disabled state indicators

---

## Mobile Responsiveness

Both pages are fully responsive:
- Single column layout on mobile
- Two/three column layout on desktop
- Collapsible sections
- Touch-friendly button sizes
- Horizontal scrolling tabs on mobile
- Adaptive spacing (`p-4 sm:p-6 lg:p-8`)

---

## Testing Checklist

- [ ] Profile view mode displays correctly
- [ ] Profile edit mode enables all fields
- [ ] Profile save updates localStorage
- [ ] Profile cancel restores original data
- [ ] Stats cards display mock data
- [ ] Settings tabs switch correctly
- [ ] Settings toggles work
- [ ] Settings persist after refresh
- [ ] Password change validates inputs
- [ ] Mobile responsive layout works
- [ ] All hover states work
- [ ] Navigation from header dropdown works

---

## Maintenance Notes

- Profile and Settings data is stored in localStorage
- To clear data: `localStorage.clear()`
- Mock stats can be replaced with API calls in `loadProfile()` method
- Session data in Settings is currently static (line 705-718)
- Custom toggle switch styles use Tailwind's peer utilities
