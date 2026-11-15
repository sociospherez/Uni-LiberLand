@echo off
cd /d "%~dp0"
echo Keep this window open while testing Stripe sandbox payments.
node server/stripe-listen.js
pause
