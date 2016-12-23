import requests
from bs4 import BeautifulSoup
from shutil import move

def getUrl():
    return 'http://www.drivethrurpg.com/browse/pub/44/Wizards-of-the-Coast?filters=0_0_0_44294_0'

def getBackupFile():
    return 'backup.txt'

def getCurrentFile():
    return 'titleList.txt'

def getHtmlResponse(url):
   return requests.get(url).text

def makeSoup(url):
    return BeautifulSoup(getHtmlResponse(url), 'html.parser')

def processData(url, count):
    soup = makeSoup(url)
    move(getCurrentFile(), getBackupFile())
    with open(getCurrentFile(), 'a') as f:
        [f.write(x['title']+'\n') for x in soup.find('table', class_='productListing').find_all('a', title=True)[3:]]
    getNextPage(soup, count)

def getData(fileName):
    with open( fileName, 'r' ) as inputFile:
        return [line.rstrip('\n') for line in inputFile]

def compareData():
    print( set(getData(getCurrentFile())) - set(getData(getBackupFile())) )

def getNextPage(soup, count):
    nextPage = soup.find('a', title=' Next Page ')
    if nextPage is not None:
        processData(nextPage['href'], count+1)
    compareData()
        
processData(getUrl(), 1)