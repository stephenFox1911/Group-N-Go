__author__ = 'Adam'

import re
import requests

api_key = "AIzaSyCDpJr0yyMkMJ4hjbDycjoNTbuVbHWK-c0"
endpoint = "https://maps.googleapis.com/maps/api/geocode/"


def getLatLng(addr):
    address = re.sub(r'\s+', '+', addr)
    requestparams = "json?address=" + str(address) + "&key=" + api_key
    reqstring = endpoint+requestparams
    r = requests.request('GET', reqstring)
    jsonobj = r.json()['results']
    location = re.sub(r'.*?(location[^_]*?}).*$', r'\1', str(jsonobj))
    location = re.sub(r'(.*?\{)|(\}.*)', "", location)
    coords = re.split(r'\s*,\s*', location)
    lattitude = re.sub(r'[^\d\.-]', "", coords[0])
    longitude = re.sub(r'[^\d\.-]', "", coords[1])
    return lattitude, longitude


def createSQL(valuelist):
    start = "INSERT INTO `groupngo`.`Locations` (`Name`, `Address`, `Lat`, `Lng`) VALUES "
    for value in valuelist:
        start += value + ", "
    SQL = re.sub(r', $', ';', start)
    fout = open('addLocations.sql', 'w')
    fout.write(SQL + "\n")
    fout.close()

if __name__ == "__main__":
    values = []
    fin = open('building_info.txt', 'r')
    line = fin.readline()
    while (line is not None) and (line is not ""):
        parts = re.split(r'\s+\|\s+', line)
        name = parts[0].strip()
        address = parts[1].strip()
        lat, lng = getLatLng(address)
        valstring = "(\"" + name + "\", \"" + address + "\", " + lat + ", " + lng + ")"
        print(valstring)
        values.append(valstring)
        line = fin.readline()
    fin.close()
    createSQL(values)