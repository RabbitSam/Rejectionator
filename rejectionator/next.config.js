/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/app/styles')],
        prependData: `@import "./src/app/styles/variables.scss";`
    }
};

module.exports = nextConfig;
