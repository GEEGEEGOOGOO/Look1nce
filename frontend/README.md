# Look1nce Frontend

Next.js 14 frontend with TypeScript and TailwindCSS for the virtual try-on app.

## Setup

### 1. Install Bun (if not already installed)

**Windows:**
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Run Development Server

```bash
bun dev
```

Frontend will start at: **http://localhost:3000**

## Alternative: Using npm/yarn

If you prefer not to use Bun:

```bash
npm install
npm run dev
```

or

```bash
yarn install
yarn dev
```

## Features

- 📸 Camera integration for live photo capture
- 📤 Drag & drop file upload
- 🎨 Beautiful gradient UI with Tailwind CSS
- ⚡ Fast builds with Bun
- 📱 Responsive design
- 🔄 Real-time processing status

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with step flow
│   └── globals.css         # Global styles
├── components/
│   ├── ClothUpload.tsx     # Cloth image upload component
│   ├── PersonUpload.tsx    # Person photo/camera component
│   └── TryOnResult.tsx     # Result display component
├── lib/
│   └── api.ts              # API client
├── package.json
└── next.config.js
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Camera Permissions

When using the camera feature:
1. Browser will request camera access
2. Click "Allow" to enable camera
3. Capture photo when ready

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
bun dev --port 3001
```

### Camera Not Working
- Check browser permissions
- Try HTTPS in production (camera requires secure context)
- Use uploaded image as alternative

### API Connection Issues
- Ensure backend is running on port 8000
- Check `.env.local` has correct API URL
- Verify CORS settings in backend

## Building for Production

```bash
bun run build
bun start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Camera**: react-webcam
- **Runtime**: Bun
