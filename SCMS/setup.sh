#!/bin/bash
# SupplyNet SCMS — Quick Setup Script
echo "========================================"
echo "   SupplyNet SCMS Setup Script"
echo "========================================"

echo ""
echo "📦 Installing backend dependencies..."
cd backend-project && npm install
echo "✅ Backend dependencies installed"

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend-project && npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "========================================"
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend-project && npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend-project && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
echo "  Make sure MongoDB is running on port 27017"
echo "========================================"
