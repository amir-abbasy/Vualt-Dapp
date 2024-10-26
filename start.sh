#!/bin/bash

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Define header function
header() {
    echo -e "${YELLOW}=========================${NC}"
    echo -e "${GREEN}$1${NC}"  # Header text
    echo -e "${YELLOW}=========================${NC}"
}

header "Hardhat Deplying and Testing"
cd hardhat  

# Install Node.js app dependencies
echo "Installing Node.js app dependencies..."
npm install

npx hardhat compile
npx hardhat test



# Navigate to Node.js app directory
cd ../hardhat
sleep 10

# Start Node.js app and show logs
header "Starting Node.js app and showing EVENTS..."
gnome-terminal -- bash -c "npm start; exec bash"
# npm start


header "Navigate to React app directory"
cd ../frontend


# Install React app dependencies
echo "Installing React app dependencies..."
npm install

# Start React app
echo "Starting React app..."
npm run dev &

# Wait for React app to start
echo "Waiting for React app to launch..."

# Get the React app URL
APP_URL="http://localhost:5173"

# Open the app in the browser
echo "Opening React app in the browser..."
xdg-open $APP_URL
