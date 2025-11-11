#!/bin/bash
source ~debpacker/.bash_profile
cd src
rm -rf node_modules
npm install
npm run build
cd ..
