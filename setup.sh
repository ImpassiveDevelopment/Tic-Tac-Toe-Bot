#!/bin/bash

touch .env
echo "TOKEN=" >> .env
echo "SERVER_LOGS=" >> .env
echo "TOPGG=" >> .env
echo "OWNER=" >> .env
echo "OS=" >> .env
touch data.json
echo "{\"system\": {\"games\": 0}}" >> data.json
touch commands.json
echo "[]" >> commands.json