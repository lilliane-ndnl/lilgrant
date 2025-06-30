# LilGrant Image Assets Organization

This folder contains all image assets for the LilGrant project, organized by category for easy management.

## Folder Structure

### `/src/assets/images/` (Processed Images)
These images will be processed by Vite's build system and optimized for production.

- **`logo/`** - Brand logos, wordmarks, and brand identity assets
- **`team/`** - Team member photos, founder pictures, about page images
- **`illustrations/`** - Custom illustrations, graphics, decorative elements
- **`elements/`** - UI elements, icons, small graphics used in components
- **`backgrounds/`** - Background images, patterns, textures

### `/public/images/` (Static Images)
These images are served directly without processing. Good for images that don't need optimization.

- **`static/`** - Large images, high-resolution photos
- **`banners/`** - Hero banners, promotional images
- **`icons/`** - Favicon, app icons, social media icons

## Usage Examples

### For processed images (src/assets):
```jsx
import teamPhoto from '../assets/images/team/founder.jpg'
import logo from '../assets/images/logo/lilgrant-logo.png'

// Use in components
<img src={teamPhoto} alt="Founder" />
```

### For static images (public):
```jsx
// Reference directly from public folder
<img src="/images/static/hero-banner.jpg" alt="Hero" />
```

## Recommended File Formats
- **Logos**: PNG, SVG
- **Photos**: JPG, WebP
- **Illustrations**: PNG, SVG
- **Icons**: SVG, PNG

## File Naming Convention
- Use kebab-case: `team-photo.jpg`
- Be descriptive: `founder-profile-2024.jpg`
- Include dimensions if needed: `logo-300x100.png` 