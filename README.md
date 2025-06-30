# 🎓 LilGrant - Scholarship Discovery Platform

**Unlock Your Future. Discover LilGrant.**

LilGrant is a modern, user-friendly web platform that connects students to educational opportunities through a comprehensive scholarship discovery experience. Built with React and TypeScript, LilGrant makes finding and applying for scholarships smooth, inspiring, and accessible.

## ✨ Features

- **🔍 Scholarship Discovery**: Browse through a curated collection of scholarships tailored to various fields and criteria
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎯 Detailed Information**: Comprehensive scholarship details with eligibility requirements and application instructions
- **📚 Resources Section**: Additional educational resources and guides
- **📝 Blog**: Latest news and tips for scholarship seekers
- **ℹ️ About Section**: Learn more about our mission and team

## 🚀 Live Demo

Visit the live application: [LilGrant Platform](https://lilgrant.netlify.app)

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS3 with modern design principles
- **HTTP Client**: Axios
- **Deployment**: Netlify

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lilgrant.git
   cd lilgrant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/         # Navigation header
│   ├── Footer/         # Site footer
│   ├── HeroSection/    # Landing page hero
│   ├── ScholarshipCard/    # Scholarship display cards
│   └── ScholarshipDetailModal/  # Detailed scholarship view
├── pages/              # Page components
│   ├── HomePage/       # Landing page
│   ├── ScholarshipsPage/  # Scholarship listings
│   ├── AboutPage/      # About us page
│   ├── BlogPage/       # Blog and articles
│   └── ResourcesPage/  # Educational resources
├── assets/             # Static assets
│   └── images/         # Image assets
└── utils/              # Utility functions
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run fetch-data` - Fetch scholarship data

## 🌐 Deployment

This project is configured for easy deployment on Netlify:

1. **Automatic Deployment**: Connect your GitHub repository to Netlify for automatic deployments
2. **Build Settings**: Already configured in `netlify.toml`
3. **Environment Variables**: Set any required environment variables in Netlify dashboard

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

## 🤝 Contributing

We welcome contributions to make LilGrant even better! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain responsive design principles
- Write clean, readable code
- Test your changes across different devices
- Follow the existing code style and conventions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

If you have any questions or need help getting started:

- 📧 Email: support@lilgrant.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/lilgrant/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/lilgrant/discussions)

## 🎯 Mission

At LilGrant, we believe that financial barriers shouldn't limit educational dreams. Our platform is designed to democratize access to scholarship information, making it easier for students from all backgrounds to discover and pursue funding opportunities for their education.

## Recent Updates
- Fixed all TypeScript errors for successful Netlify deployment
- Improved type safety across all components
- Enhanced code maintainability and performance

---

**Made with ❤️ for students everywhere**
