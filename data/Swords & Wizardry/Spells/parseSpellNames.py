def GetSpellNames():
    inputFilename = 'spellList.txt'
    return sorted(set([line.rstrip('\n') for line in open(inputFilename)]), key=lambda s: s.lower())

def GetCSVHeader():
    return ['Spell Name', 'Spell Level', 'Range', 'Duration', 'Description']

def GetSpellData():
    spellFile = 'spellData.txt'
    return [line.rstrip('\n') for line in open(spellFile, encoding='utf8')]

def TransformData( data ):
    data[1] = data[1].lstrip('Spell Level: ')
    # Bug: lstrip('Range: ') takes too much off from the line:
    # Range: Referee's Discretion
    # It only leaves the line: "feree's Discretion"
    data[2] = data[2].lstrip('Range:').lstrip(' ')
    data[3] = data[3].lstrip('Duration: ')
    data[4] = " ".join(data[4:])
    return data[:5]

def ProcessSpells( names, spellData ):
    data = []
    for currentSpell, nextSpell in zip( names[:-1], names[1:]):
        currentIndex = spellData.index(currentSpell)
        nextIndex = spellData.index(nextSpell)
        if len(spellData[currentIndex:nextIndex-1]) == 0:
            print( currentSpell, nextSpell )
        data.append( spellData[currentIndex:nextIndex] )

        if names.index(nextSpell) == len(names)-1:
            data.append(spellData[nextIndex:])
    data = [TransformData( x ) for x in data]
    return data

def ExportData( data ):
    import csv, json
    with open( 'spellData.csv', 'w', newline='' ) as outFile:
        wr = csv.writer( outFile )
        wr.writerow( GetCSVHeader() )
        wr.writerows( data )
    with open( 'spellData.csv', 'r' ) as inFile, open( 'spellData.json', 'w') as outFile:
        reader = csv.DictReader( inFile, GetCSVHeader() )
        # Skip the header row
        next( reader )
        json.dump( [row for row in reader], outFile, indent=3, separators=(',',': '), sort_keys=True, ensure_ascii=False)

ExportData( ProcessSpells( GetSpellNames(), GetSpellData() ) )
