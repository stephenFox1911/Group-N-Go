#!/bin/bash
forever stopall
forever start -w -e /home/repos/Group-N-Go/server/logs/errors.log -o /home/repos/Group-N-Go/server/logs/output.log /home/repos/Group-N-Go/server/app.js

