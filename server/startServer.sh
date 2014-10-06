#!/bin/bash
forever stopall
forever start -w -e ./logs/errors.log -o ./logs/output.log app.js

