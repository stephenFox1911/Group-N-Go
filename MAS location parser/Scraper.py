__author__ = 'Adam'

import bs4
import urllib.request
import re


def getBuildingList():
    sourcelink = "http://www.facilities.gatech.edu/map/alpha_occupants.php"
    source = urllib.request.urlopen(sourcelink).read()
    soup = bs4.BeautifulSoup(source)
    maindiv = soup.find(id="newsRelease")
    uls = maindiv.findAll('ul')
    links = []
    for ul in uls:
        anchors = ul.findAll('a')
        for a in anchors:
            string = a.getText() + " | " + a['href']
            if string not in links:
                links.append(string)
    return links


def get_Address(building_info):
    parts = re.split(r'\s+\|\s+', building_info)
    name = parts[0]
    link = "http://www.facilities.gatech.edu/map/" + re.sub(r'\s+', "", parts[1])
    bldg_page = urllib.request.urlopen(link).read()
    bldg_soup = bs4.BeautifulSoup(bldg_page)
    centerdiv = bldg_soup.find(id="columnPrimary")
    info = centerdiv.findAll('h4')
    address = ""
    for line in info:
        if re.match(r'[0-9]', line.getText().strip()[0]):
            address = line.getText().strip() + ", Atlanta, GA 30313"
    if address is not "":
        return name + " | " + address

if __name__ == "__main__":
    rawlist = getBuildingList()
    finallist = []
    for bldg in rawlist:
        bldgtext = get_Address(bldg)
        if (bldgtext is not None) and (bldgtext not in finallist):
            finallist.append(bldgtext)

    f = open('building_info.txt', 'w')
    for done in finallist:
        f.write(done + "\n")
    print("DONE")