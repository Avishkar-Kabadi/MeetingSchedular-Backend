📘 Debug Module & Environment Setup in Node.js
🔧 Install Debug Module

    npm i debug


📦 Require and Use debug

// Correct syntax (note the comma or space, not colon):

    const dbgr = require('debug')('development:file_name');

// Example usage:

    dbgr('This is a debug message');

🧪 Enable Debugging
To see debug output for a specific namespace or all under a scope:


    set DEBUG=development:*      # Enable all debug logs under 'development'


To enable only specific file:

    set DEBUG=development:file_name


🧹 Disable Debugging

    set DEBUG=                   # Turns off all debug logs


🌐 Set Environment Variables
To set the environment for development or production:


    set NODE_ENV=development     # For development mode
    set NODE_ENV=production      # For production mode

🧠 Notes
debug messages are hidden by default and only shown when the DEBUG environment variable matches the namespace.

Always use NODE_ENV to control your environment-specific logic (e.g., logging, DB config, error handling).