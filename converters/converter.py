#this takes a CSV in the form of 
#TableName
#Die Range, Table Entry
#...
#See included sample

import csv, json, sys
from optparse import OptionParser

def convert( infile, outfile ):
   csvData = csv.reader( open( infile ), skipinitialspace = True )
   data = {}
   currentTable = ''
   for row in csvData:
      if row[0]:
         if row[1]:
            numbers = [int(x) for x in row[0].split('-')]
            rData = {}
            rData['label'] = row[1]
            if len( numbers ) > 1:
               rData['weight'] = numbers[1] - numbers[0] + 1
            data[currentTable].append( rData )
            
         else:
            currentTable = row[0]
            data[currentTable] = []

   with open( outfile, 'w' ) as ofile:
      json.dump( data, ofile, sort_keys=True, indent=4, separators=(',', ':') )

   print "Conversion Complete, %s written" % ( outfile )

def main( argv ):
   parser = OptionParser()
   parser.add_option( "-i", "--ifile", dest="inputFile", help="Input File", default=None )
   parser.add_option( "-o", "--ofile", dest="outputFile", help="Output File", default=None )
   
   (options, args) = parser.parse_args()
   
   if options.inputFile is None or options.outputFile is None:
      print "Please supply the input/output files (-i/-o)"
      
   convert( options.inputFile, options.outputFile )
      
if __name__ == "__main__":
   main( sys.argv[1:] )