#!/bin/bash
forever stopall
cd /home/repos/Group-N-Go/server/
forever start -w -e logs/errors.log -o logs/output.log app.js

