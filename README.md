# Digital Portfolio Creation Tool

Hello, and thank you for taking the time to check out my full-stack take home assignment!

## Overview

As requested, I've built a digital portfolio creation tool. Looking at the assignment, I decided to build a sort of WYSIWYG (What You See Is What You Get) editor with media file management.

The app is still rough around the edges, but I built it this way as a sort of proof-of-concept; the sort of thing that you would bring to the team after working on it for a few days to get feedback and rapidly iterate on until you get something more commercial.

I thought this would better mimic the real design process, which is why I opted to create something more advanced, even if it's not perfect.

## Design Philosophy

For the design aesthetic, I went with a Neumorphic inspired design (think Tesla vehicle UI). This seems to be a design trend that's sticking around for a while, and I thought it would be nice to go for something more stylized. The design could also use some refinement, but I think the classic depth effects and subtle visual language of the style is there.

I decided to keep the back-end simple and functional, as I wanted to focus a lot of time on the front-end features of the assignment since it's a digital portfolio, which to me strikes me as something very visual-focused.

If I could do it again, I might cut down on a few of the features I attempted to implement, but I am happy with the general ideas I think this proof-of-concept represents. I tried to be thoughtful with my UX choices in addition to my UI ones, putting relevant menus close to where the user would be looking and keeping UI elements minimal so the user could focus on the overall visual design of the portfolio.

## Features

### Core Requirements

You'll see that the required features from the initial prompt are fulfilled:

- ✅ **Upload images and videos** - Drag and drop or click to upload media files
- ✅ **Provide descriptions and metadata** - Title, description, upload date for each item
- ✅ **Organize portfolio items into expandable/collapsible sections** - Fully collapsible sections with drag-and-drop organization
- ✅ **View a live preview of the portfolio** - Real-time preview mode with professional layout
- ✅ **Save their portfolio by interacting with a backend API** - Persistent storage with Python Flask backend

### Additional Features

The site also includes the following features:

- 🔧 **Context Menus** - Right-click context menus for quick element editing and manipulation
- 🎯 **Drag & Drop Interface** - Intuitive drag-and-drop for reordering elements and sections
- ⚡ **Real-time Editing** - Live updates as you edit text, resize elements, and modify properties
- 🖼️ **Advanced Image Management** - Grid-based image containers with flexible layouts
- 🎥 **Video Support** - Embedded video playback with customizable player controls
- 📐 **Flexible Spacing Controls** - Precise margin and padding controls for all elements
- 🔄 **Auto-save Functionality** - Automatic portfolio loading and saving
- 📋 **Element Toolbar** - Floating action button with quick access to add new elements
- 🎨 **Typography Controls** - Font family, size, weight, and color customization
- 📱 **Touch-friendly Interface** - Optimized for touch interactions on tablets and mobile

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Modern drag and drop library
- **FontAwesome** - Icon library for UI elements

### Backend

- **Python Flask** - Lightweight web framework
- **File System Storage** - Simple file-based media storage
- **RESTful API** - Clean API design for portfolio operations

## Usage/Running The App

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

### Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd markburghard-fullstack-take-home
   ```

2. **Install all dependencies (frontend + backend)**

   ```bash
   npm run setup
   ```

3. **Start both frontend and backend servers**

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Potential Areas for Improvement

### Technical Improvements

- **Authentication & Authorization** - User accounts and portfolio ownership
- **Cloud Storage** - Integrate with AWS S3 or similar for scalable media storage
- **Performance Optimization** - Image compression, lazy loading, and CDN integration
- **Testing Coverage** - Comprehensive unit and integration tests
- **Error Handling** - More robust error boundaries and user feedback
- **Bug Fixes** - Correct the issues with the UI/Context Menus
