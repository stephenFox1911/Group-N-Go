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

api_key = "AIzaSyCDpJr0yyMkMJ4hjbDycjoNTbuVbHWK-c0"
geocodeendpoint = "https://maps.googleapis.com/maps/api/geocode/json"
placesendpoint = "http://m.gatech.edu/api/gtplaces/buildings/"

def getBuildings():
    req = requests.request('GET', placesendpoint)
    # parse json response here in to list of building objects
    # store buildingcode, Name, Address
    return req.json()


def getLatLng(addr):
    address = re.sub(r'\s+', '+', addr)
    requestparams = "?address=" + str(address) + "&key=" + api_key
    reqstring = geocodeendpoint+requestparams
    r = requests.request('GET', reqstring)
    jsonobj = r.json()['results']
    location = re.sub(r'.*?(location[^_]*?}).*$', r'\1', str(jsonobj))
    location = re.sub(r'(.*?\{)|(\}.*)', "", location)
    location = re.sub(r'\s+', "", location)
    coords = re.split(r'\s*,\s*', location)
    lat = re.sub(r'[^\d\.-]', "", coords[0])
    lng = re.sub(r'[^\d\.-]', "", coords[1])
    return lat, lng


def createSQL(valuelist):
    start = "INSERT INTO `groupngo`.`Locations` (`BuildingCode`, `Name`, `Address`, `Lat`, `Lng`) VALUES "
    for value in valuelist:
        start += value + ", "
    SQL = re.sub(r', $', ' ', start)
    SQL += "ON DUPLICATE KEY UPDATE Name=VALUES(Name), Address=VALUES(Address), Lat=VALUES(Lat), Lng=VALUES(Lng)"
    fout = open('updateGTplaces.sql', 'w')
    fout.write(SQL + "\n")
    fout.close()

if __name__ == "__main__":
    values = []
    places = getBuildings()
    for place in places:
        # parse out name address etc
        name = "name"
        # lookup geocode for address and store with other info in list
        lat, lng = getLatLng(name)
        values.append(name)
    # create update statement
    createSQL(values)