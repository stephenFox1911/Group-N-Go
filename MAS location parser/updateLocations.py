__author__ = 'Adam'

# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#
#                                                   Updates the data in the groupngo database using the gtplaces database.
#                                Called via CRON job, this script should get all the buildings on GT campus, then lookup the gps coordinates for the building
#                                              Any buildings aready in the DB will be updated with the new Name/Address/Lat/Lng
#
#                                        THE CRON SCRIPT THAT CALLS THIS SHOULD ALSO LOG IN TO MYSQL AND IMPORT THE UPDATE.SQL FILE
#
# ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import requests
import re

placesendpoint = "http://m.gatech.edu/api/gtplaces/buildings/"
start = "INSERT INTO `groupngo`.`Locations` (`BuildingCode`, `Name`, `Address`, `Lat`, `Lng`) VALUES "
req = requests.request('GET', placesendpoint)
bldgs = req.json()
for bldg in bldgs:
    bldgid = re.sub(r'\s+', ' ', bldg['b_id'].strip())
    bldgname = re.sub(r'\s+', ' ', bldg['name'].strip())
    if (str(bldgid).strip() == "" or bldgid is None) or (str(bldgname).strip() == "" or bldgname is None):
        continue
    bldgaddr = re.sub(r'\s+', ' ', bldg['address'].strip())
    bldglat = bldg['latitude']
    bldglng = bldg['longitude']
    start += "(\"" + bldgid + "\", \"" + bldgname + "\", \"" + bldgaddr + "\", " + bldglat + ", " + bldglng + "), "
SQL = re.sub(r', $', ' ', start)
SQL += "ON DUPLICATE KEY UPDATE Name=VALUES(Name), Address=VALUES(Address), Lat=VALUES(Lat), Lng=VALUES(Lng);"
fout = open('updateGTplaces.sql', 'w')
fout.write(SQL + "\n")
fout.close()
